import { useEffect, useState } from 'react'
import {
  subscribePipelineRunEvents,
  type PipelineSnapshotFrame,
  type PipelineStatusFrame,
  type PipelineStreamItem,
} from './pipelineEventStream'
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

function failureLogLines(frame: PipelineSnapshotFrame): LiveLogLine[] {
  if (frame.run_status !== 'FAILED') return []
  const time = formatTime(frame.occurred_at)
  const agent = stageLabel(frame.current_stage)
  const message = frame.error_message ?? '파이프라인 실행에 실패했습니다.'
  return [
    { time, agent, agentColor: colors.danger, message, level: 'ERROR' },
    ...failureReasons(frame.failure).map((reason) => ({
      time,
      agent,
      agentColor: colors.danger,
      message: reason,
      level: 'ERROR' as const,
    })),
  ]
}

/**
 * run_id 하나의 파이프라인 진행 상태를 SSE로 구독한다.
 * `stepField`는 이 화면이 관심 있는 서브스텝 종류(요구사항 분석/선별/가공)를 가리키며,
 * 다른 단계의 status 이벤트는 진행률·run_status만 반영하고 items는 건드리지 않는다.
 */
export function usePipelineRunStream(
  runId: number | null,
  stepField: PipelineStepField,
): PipelineRunStreamState {
  const [state, setState] = useState<PipelineRunStreamState>(INITIAL_STATE)
  const stepStatusField = STEP_STATUS_FIELD_BY_STEP_FIELD[stepField]

  useEffect(() => {
    if (runId === null || !Number.isFinite(runId)) return

    setState(INITIAL_STATE)

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
            errorMessage: frame.run_status === 'FAILED' ? frame.error_message : null,
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
          const items = stepCode
            ? prev.items.map((item) =>
                item.item_code === stepCode
                  ? {
                      ...item,
                      status: stepStatus ?? item.status,
                      error_message: stepStatus === 'FAILED' ? frame.message : item.error_message,
                    }
                  : item,
              )
            : prev.items
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

    return unsubscribe
  }, [runId, stepField, stepStatusField])

  return state
}
