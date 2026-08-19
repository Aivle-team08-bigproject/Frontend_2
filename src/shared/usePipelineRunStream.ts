import { useEffect, useState } from 'react'
import {
  subscribePipelineRunEvents,
  type PipelineSnapshotFrame,
  type PipelineStatusFrame,
  type PipelineStreamItem,
} from './pipelineEventStream'
import { fetchPipelineRun } from './api'
import type { LiveLogLine } from './LiveLogPanel'
import { colors } from './theme'
import { formatTime } from './datetime'
import { stageLabel } from './pipelineLabels'

export type PipelineStepField = 'analysis_step' | 'selection_step' | 'processing_step'
type PipelineStepStatusField = 'analysis_step_status' | 'selection_step_status' | 'processing_step_status'

const STEP_STATUS_FIELD_BY_STEP_FIELD: Record<PipelineStepField, PipelineStepStatusField> = {
  analysis_step: 'analysis_step_status',
  selection_step: 'selection_step_status',
  processing_step: 'processing_step_status',
}

export type PipelineStreamConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'error'

export type PipelineRunStreamState = {
  connectionState: PipelineStreamConnectionState
  runStatus: string | null
  currentStage: string | null
  progressPercent: number
  items: PipelineStreamItem[]
  /** item_code별 가장 최근 안내 문구. Timeline 설명에 쓰인다. */
  stepMessages: Record<string, string>
  logLines: LiveLogLine[]
  errorMessage: string | null
  failureCode: string | null
}

const MAX_LOG_LINES = 200

const INITIAL_STATE: PipelineRunStreamState = {
  connectionState: 'connecting',
  runStatus: null,
  currentStage: null,
  progressPercent: 0,
  items: [],
  stepMessages: {},
  logLines: [],
  errorMessage: null,
  failureCode: null,
}

/**
 * 실패 프레임에 실려온 구체적 사유를 꺼낸다.
 *
 * 단계가 실패하면 message는 "산출물 검증에 실패했습니다" 같은 총론만 담고, 실제 사유는
 * failure.details.validation_errors에 들어온다. 그대로 두면 진행 화면을 보고 있던
 * 실무자는 이유를 못 본 채 상세 화면으로 튕긴다.
 */
function failureReasons(failure: Record<string, unknown> | null): string[] {
  if (!failure) return []
  const details = failure.details
  if (typeof details !== 'object' || details === null) return []
  const errors = (details as Record<string, unknown>).validation_errors
  if (!Array.isArray(errors)) return []
  return errors.filter((error): error is string => typeof error === 'string' && error.length > 0)
}

function agentColorFor(runStatus: string | null): string {
  if (runStatus === 'FAILED') return colors.danger
  if (runStatus === 'COMPLETED') return colors.success
  if (runStatus?.startsWith('WAITING')) return colors.warning
  return colors.flowPrimary
}

function failureCode(failure: Record<string, unknown> | null): string | null {
  const code = failure?.failure_code
  return typeof code === 'string' ? code : null
}

function failureLogLines(frame: PipelineSnapshotFrame): LiveLogLine[] {
  if (frame.run_status !== 'FAILED') return []
  const time = formatTime(frame.occurred_at)
  const agent = stageLabel(frame.current_stage)
  const messages = [
    ...new Set(
      [frame.error_message, ...failureReasons(frame.failure)].filter(
        (message): message is string => Boolean(message),
      ),
    ),
  ]
  if (messages.length === 0) messages.push('파이프라인 실행에 실패했습니다.')
  return messages.map((message) => ({
    time,
    agent,
    agentColor: colors.danger,
    message,
    level: 'ERROR' as const,
  }))
}

/**
 * run_id 하나의 파이프라인 진행 상태를 SSE로 구독한다.
 * `stepField`는 이 화면이 관심 있는 서브스텝 종류(요구사항 분석/선별/가공)를 가리키며,
 * 다른 단계의 status 이벤트는 진행률·run_status만 반영하고 items는 건드리지 않는다.
 */

/** 상태 이벤트 하나를 단계 목록에 반영한다.
 *
 * 이벤트에는 started_at/completed_at이 실리지 않으므로 occurred_at으로 채운다.
 * 채우지 않으면 진행 화면의 시각이 계속 '-'로 남는다(2026-08-12 회귀).
 * 서버 스냅샷을 다시 받으면 정본 값으로 덮인다.
 */
export function applyStepStatus(
  items: PipelineStreamItem[],
  stepCode: string | null | undefined,
  stepStatus: string | null | undefined,
  occurredAt: string,
  message: string,
): PipelineStreamItem[] {
  if (!stepCode) return items
  return items.map((item) => {
    if (item.item_code !== stepCode) return item
    const nextStatus = stepStatus ?? item.status
    const isTerminal = nextStatus === 'COMPLETED' || nextStatus === 'FAILED'
    return {
      ...item,
      status: nextStatus,
      // A retry starts a new attempt for the same checklist item. Clear the
      // previous attempt's terminal fields so the UI cannot keep showing a
      // transient failure while attempt 2/3 is running.
      started_at: stepStatus === 'RUNNING' ? occurredAt : item.started_at ?? occurredAt,
      completed_at:
        stepStatus === 'RUNNING'
          ? null
          : isTerminal
            ? (item.completed_at ?? occurredAt)
            : item.completed_at,
      error_message:
        stepStatus === 'FAILED' ? message : stepStatus === 'RUNNING' ? null : item.error_message,
    }
  })
}

export function usePipelineRunStream(
  runId: number | null,
  stepField: PipelineStepField,
): PipelineRunStreamState {
  const [state, setState] = useState<PipelineRunStreamState>(INITIAL_STATE)
  const stepStatusField = STEP_STATUS_FIELD_BY_STEP_FIELD[stepField]

  useEffect(() => {
    if (runId === null || !Number.isFinite(runId)) return

    setState(INITIAL_STATE)

    // SSE가 일시적으로 끊긴 동안에도 실행 상태가 멈춰 보이지 않도록 정본 API를
    // 주기적으로 확인한다. 단계별 항목은 SSE replay가 복원하고, 여기서는 실행의
    // 상태·현재 단계·진행률·최종 실패만 보정한다.
    let syncInFlight = false
    const syncRunState = async () => {
      if (syncInFlight) return
      syncInFlight = true
      try {
        const run = await fetchPipelineRun(runId)
        setState((prev) => ({
          ...prev,
          runStatus: run.run_status,
          currentStage: run.current_stage,
          progressPercent: run.progress_percent,
          failureCode: failureCode(run.failure ?? null) ?? prev.failureCode,
          errorMessage: prev.connectionState === 'error' ? prev.errorMessage : null,
        }))
      } catch {
        // SSE가 정상인 동안의 일시적인 polling 실패는 화면을 오류 상태로 바꾸지 않는다.
      } finally {
        syncInFlight = false
      }
    }
    const syncTimer = window.setInterval(() => void syncRunState(), 10_000)

    const unsubscribe = subscribePipelineRunEvents(runId, {
      onConnected: () => {
        setState((prev) => ({ ...prev, connectionState: 'connected', errorMessage: null }))
      },
      onSnapshot: (frame) => {
        setState((prev) => {
          const snapshotFailureLogs = failureLogLines(frame)
          return {
            ...prev,
            connectionState: 'connected',
            runStatus: frame.run_status,
            currentStage: frame.current_stage,
            progressPercent: frame.progress_percent,
            items: frame.items,
            // 실행 실패는 타임라인과 로그에만 표시한다. 이 배너는 SSE 연결 실패처럼
            // 사용자가 복구할 수 있는 화면 통신 오류만 알린다.
            errorMessage: null,
            failureCode: failureCode(frame.failure),
            logLines: snapshotFailureLogs.length > 0 ? snapshotFailureLogs : prev.logLines,
          }
        })
      },
      onStatus: (frame: PipelineStatusFrame) => {
        setState((prev) => {
          // agent_log는 상태 전이가 아니라 관찰 기록이다 — 진행률·단계 상태는 건드리지
          // 않고 로그 한 줄만 쌓는다.
          if (frame.event_kind === 'agent_log') {
            const agentLogLine: LiveLogLine = {
              time: formatTime(frame.occurred_at),
              agent: stageLabel(frame.current_stage),
              agentColor: agentColorFor(prev.runStatus),
              message: frame.message,
              level: frame.log_level ?? 'INFO',
            }
            return {
              ...prev,
              connectionState: 'connected',
              logLines: [...prev.logLines, agentLogLine].slice(-MAX_LOG_LINES),
            }
          }

          const stepCode = frame[stepField]
          const stepStatus = frame[stepStatusField]
          const items = applyStepStatus(prev.items, stepCode, stepStatus, frame.occurred_at, frame.message)
          const stepMessages = stepCode ? { ...prev.stepMessages, [stepCode]: frame.message } : prev.stepMessages
          const time = formatTime(frame.occurred_at)
          const agent = stageLabel(frame.current_stage)
          const agentColor = agentColorFor(frame.run_status)
          const newLogLines: LiveLogLine[] = [
            { time, agent, agentColor, message: frame.message },
            // 총론 뒤에 실제 사유를 붙여야 진행 화면만 보고도 원인을 알 수 있다.
            ...failureReasons(frame.failure).map((reason) => ({
              time,
              agent,
              agentColor,
              message: reason,
              level: 'ERROR' as const,
            })),
          ]
          return {
            ...prev,
            connectionState: 'connected',
            runStatus: frame.run_status ?? prev.runStatus,
            currentStage: frame.current_stage ?? prev.currentStage,
            progressPercent: frame.progress_percent,
            failureCode: failureCode(frame.failure) ?? prev.failureCode,
            items,
            stepMessages,
            logLines: [...prev.logLines, ...newLogLines].slice(-MAX_LOG_LINES),
          }
        })
      },
      onDisconnected: () => {
        setState((prev) => ({ ...prev, connectionState: 'reconnecting' }))
      },
      onFatal: (error) => {
        setState((prev) => ({
          ...prev,
          connectionState: 'error',
          errorMessage: error instanceof Error ? error.message : '연결에 실패했습니다.',
        }))
      },
    })

    return () => {
      window.clearInterval(syncTimer)
      unsubscribe()
    }
  }, [runId, stepField, stepStatusField])

  return state
}
