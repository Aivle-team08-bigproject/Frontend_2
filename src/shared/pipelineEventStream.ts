import { API_BASE_URL, refreshAccessToken } from './api'
import { clearAccessToken, getAccessToken } from './auth'

/** GET /api/v1/runs/{run_id}/events가 내려주는 stage 서브스텝 하나. */
export type PipelineStreamItem = {
  item_code: string
  status: string
  started_at: string | null
  completed_at: string | null
  metadata: Record<string, unknown> | null
  error_message: string | null
}

/** 최초 접속(또는 재접속) 시 오는 `snapshot` 프레임. */
export type PipelineSnapshotFrame = {
  event_id: number | null
  run_id: number
  run_status: string
  current_stage: string | null
  progress_percent: number
  stage_run_id: number | null
  attempt_no: number | null
  items: PipelineStreamItem[]
  message: string
  error_message: string | null
  failure: Record<string, unknown> | null
  occurred_at: string
}

/** 실시간/재접속 replay로 오는 `status` 프레임. app/worker/status_event.py PipelineStatusEvent와 대응. */
export type PipelineStatusFrame = {
  event_id: number | null
  run_id: number
  run_status: string | null
  current_stage: string | null
  stage_run_id: number | null
  analysis_step: string | null
  analysis_step_status: string | null
  selection_step: string | null
  selection_step_status: string | null
  processing_step: string | null
  processing_step_status: string | null
  attempt_no: number | null
  progress_percent: number
  message: string
  step_metadata: Record<string, unknown> | null
  failure: Record<string, unknown> | null
  rollback_to_stage: string | null
  occurred_at: string
}

export type PipelineStreamHandlers = {
  onSnapshot: (frame: PipelineSnapshotFrame) => void
  onStatus: (frame: PipelineStatusFrame) => void
  onConnected?: () => void
  /** 연결이 끊겨서 재시도를 시작할 때. 인증 실패처럼 재시도해도 소용없는 에러는 onFatal로 간다. */
  onDisconnected?: (error: unknown) => void
  onFatal?: (error: unknown) => void
}

const RETRY_DELAY_MS = 3000

function parseFrame(rawFrame: string): { event: string; id: number | null; data: string } | null {
  let event = 'message'
  let id: number | null = null
  const dataLines: string[] = []
  for (const line of rawFrame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('id:')) id = Number(line.slice(3).trim()) || null
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
    else if (line.startsWith(':')) return null // heartbeat 주석
  }
  if (dataLines.length === 0) return null
  return { event, id, data: dataLines.join('\n') }
}

async function readStream(
  response: Response,
  lastEventIdRef: { current: number | null },
  handlers: PipelineStreamHandlers,
): Promise<void> {
  if (!response.body) throw new Error('SSE 응답에 body가 없습니다.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return
      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split('\n\n')
      buffer = frames.pop() ?? ''
      for (const rawFrame of frames) {
        const frame = parseFrame(rawFrame)
        if (!frame) continue
        if (frame.id !== null) lastEventIdRef.current = frame.id
        if (frame.event === 'snapshot') {
          handlers.onSnapshot(JSON.parse(frame.data) as PipelineSnapshotFrame)
        } else if (frame.event === 'status') {
          handlers.onStatus(JSON.parse(frame.data) as PipelineStatusFrame)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

async function connectOnce(
  runId: number,
  lastEventIdRef: { current: number | null },
  handlers: PipelineStreamHandlers,
  signal: AbortSignal,
  retried = false,
): Promise<void> {
  const accessToken = getAccessToken()
  const headers: Record<string, string> = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  if (lastEventIdRef.current !== null) headers['Last-Event-ID'] = String(lastEventIdRef.current)

  const response = await fetch(`${API_BASE_URL}/api/v1/runs/${runId}/events`, {
    headers,
    credentials: 'include',
    signal,
  })

  if (response.status === 401 && !retried) {
    await refreshAccessToken()
    return connectOnce(runId, lastEventIdRef, handlers, signal, true)
  }
  if (!response.ok) {
    if (response.status === 401) clearAccessToken()
    throw new Error(`파이프라인 상태 스트림 연결에 실패했습니다. (${response.status})`)
  }

  handlers.onConnected?.()
  await readStream(response, lastEventIdRef, handlers)
}

/**
 * 파이프라인 실행의 SSE 이벤트를 구독한다. Authorization 헤더가 필요해서
 * 브라우저 기본 EventSource 대신 fetch + ReadableStream으로 직접 파싱한다.
 * 연결이 끊기면 Last-Event-ID를 들고 자동 재접속한다. 반환값 호출로 구독 해제.
 */
export function subscribePipelineRunEvents(runId: number, handlers: PipelineStreamHandlers): () => void {
  const controller = new AbortController()
  const lastEventIdRef = { current: null as number | null }
  let stopped = false

  async function loop() {
    while (!stopped) {
      try {
        await connectOnce(runId, lastEventIdRef, handlers, controller.signal)
        if (stopped) return
        handlers.onDisconnected?.(new Error('스트림 연결이 종료되었습니다.'))
      } catch (error) {
        if (stopped || controller.signal.aborted) return
        if (error instanceof Error && /만료|401/.test(error.message)) {
          handlers.onFatal?.(error)
          return
        }
        handlers.onDisconnected?.(error)
      }
      if (stopped) return
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }

  void loop()

  return () => {
    stopped = true
    controller.abort()
  }
}
