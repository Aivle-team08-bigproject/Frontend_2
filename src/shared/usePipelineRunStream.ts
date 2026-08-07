import { useEffect, useState } from 'react'
import {
  subscribePipelineRunEvents,
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

function agentColorFor(runStatus: string | null): string {
  if (runStatus === 'FAILED') return colors.danger
  if (runStatus === 'COMPLETED') return colors.success
  if (runStatus?.startsWith('WAITING')) return colors.warning
  return colors.flowPrimary
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
        setState((prev) => ({
          ...prev,
          connectionState: 'connected',
          runStatus: frame.run_status,
          currentStage: frame.current_stage,
          progressPercent: frame.progress_percent,
          items: frame.items,
        }))
      },
      onStatus: (frame: PipelineStatusFrame) => {
        setState((prev) => {
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
          const logLine: LiveLogLine = {
            time: formatTime(frame.occurred_at),
            agent: stageLabel(frame.current_stage),
            agentColor: agentColorFor(frame.run_status),
            message: frame.message,
          }
          return {
            ...prev,
            connectionState: 'connected',
            runStatus: frame.run_status ?? prev.runStatus,
            currentStage: frame.current_stage ?? prev.currentStage,
            progressPercent: frame.progress_percent,
            items,
            stepMessages,
            logLines: [...prev.logLines, logLine].slice(-MAX_LOG_LINES),
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
