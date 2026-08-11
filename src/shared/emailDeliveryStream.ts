import { API_BASE_URL, refreshAccessToken } from './api'
import { clearAccessToken, getAccessToken } from './auth'

/** GET /api/v1/runs/{run_id}/email-deliveries/{delivery_id}/events가 내려주는 상태 프레임. */
export type EmailDeliveryStatusFrame = {
  delivery_id: string
  status: string
  provider_message_id: string | null
  failure_code: string | null
}

function parseFrame(rawFrame: string): { event: string; data: string } | null {
  let event = 'message'
  const dataLines: string[] = []
  for (const line of rawFrame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
    else if (line.startsWith(':')) return null // heartbeat 주석
  }
  if (dataLines.length === 0) return null
  return { event, data: dataLines.join('\n') }
}

async function connectOnce(
  runId: number,
  deliveryId: string,
  onStatus: (frame: EmailDeliveryStatusFrame) => void,
  signal: AbortSignal,
  retried = false,
): Promise<void> {
  const accessToken = getAccessToken()
  const headers: Record<string, string> = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const response = await fetch(
    `${API_BASE_URL}/api/v1/runs/${runId}/email-deliveries/${encodeURIComponent(deliveryId)}/events`,
    { headers, credentials: 'include', signal },
  )

  if (response.status === 401 && !retried) {
    await refreshAccessToken()
    return connectOnce(runId, deliveryId, onStatus, signal, true)
  }
  if (!response.ok) {
    if (response.status === 401) clearAccessToken()
    throw new Error(`발송 상태 스트림 연결에 실패했습니다. (${response.status})`)
  }
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
        if (!frame || frame.event !== 'status') continue
        onStatus(JSON.parse(frame.data) as EmailDeliveryStatusFrame)
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 발송 요청 하나의 상태를 SSE로 구독한다. 백엔드가 종료 상태(SENT/FAILED 등)에서
 * 스트림을 스스로 닫으므로, 여기서는 재접속 없이 단발 연결만 시도한다. 반환값
 * 호출로 구독 해제.
 */
export function subscribeEmailDeliveryStatus(
  runId: number,
  deliveryId: string,
  onStatus: (frame: EmailDeliveryStatusFrame) => void,
  onError: (error: unknown) => void,
): () => void {
  const controller = new AbortController()
  connectOnce(runId, deliveryId, onStatus, controller.signal).catch((error: unknown) => {
    if (!controller.signal.aborted) onError(error)
  })
  return () => controller.abort()
}
