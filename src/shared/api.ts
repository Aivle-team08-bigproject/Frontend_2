import { getAccessToken } from './auth'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export type LoginResponse = {
  access_token: string
  expires_in_seconds: number
  expires_at: string
  employee: {
    employee_code: string
    name: string
    department: string
    status: string
    must_change_password: boolean
    permissions: string[]
  }
}

export type CreateDataRequestPayload = {
  raw_requirement: string
  title?: string
  requester_name?: string
}

export type CreateDataRequestResponse = {
  request_no: string
  run_id: number
  request_status: string
  run_status: string
  current_stage: string
  created_at: string
}

export type PipelineStage = {
  stage_code: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'ROLLED_BACK'
  executor: string
  created_at: string
}

export type PipelineEvent = {
  id: number
  event_type: string
  severity: string
  message: string
  payload: Record<string, unknown>
  occurred_at: string
}

export type PipelineRunResponse = {
  run_id: number
  request_no: string
  request_title: string
  raw_requirement: string
  request_status: string
  run_status: string
  current_stage: string | null
  progress_percent: number
  created_at: string
  updated_at: string
  stages: PipelineStage[]
  events: PipelineEvent[]
}

export type TaskViewResponse<T extends object> = {
  request_no: string
  request_title: string
  view_code: string
  payload: T
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = getAccessToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.detail?.message ?? `API 요청에 실패했습니다. (${response.status})`
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export function login(employeeCode: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ employee_code: employeeCode, password, remember_me: rememberMe }),
  })
}

export function fetchCurrentEmployee(): Promise<LoginResponse['employee']> {
  return request('/api/auth/me')
}

export function createDataRequest(payload: CreateDataRequestPayload): Promise<CreateDataRequestResponse> {
  return request('/api/v1/data-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchPipelineRun(runId: number): Promise<PipelineRunResponse> {
  return request(`/api/v1/runs/${runId}`)
}

export function fetchDashboard<T>(): Promise<T> {
  return request('/api/v1/dashboard')
}

export function fetchDashboardMyTasks<T>(): Promise<T> {
  return request('/api/v1/dashboard/my-tasks')
}

export function fetchDashboardTaskLookup<T>(): Promise<T> {
  return request('/api/v1/dashboard/task-lookup')
}

export async function fetchDeveloperDashboard<T>(): Promise<T> {
  const response = await request<{ payload: T }>('/api/v1/dashboard/developer')
  return response.payload
}

export function fetchDashboardMembers<T>(): Promise<T> {
  return request('/api/v1/dashboard/members')
}

export function currentRequestNo(fallback = 'REQ-2024-0847'): string {
  return new URLSearchParams(window.location.search).get('requestNo') || fallback
}

export async function fetchTaskView<T extends object>(viewCode: string, requestNo = currentRequestNo()): Promise<T> {
  const response = await request<TaskViewResponse<Omit<T, 'reqId' | 'requestTitle'>>>(
    `/api/v1/tasks/${encodeURIComponent(requestNo)}/views/${encodeURIComponent(viewCode)}`,
  )
  return {
    reqId: response.request_no,
    requestTitle: response.request_title,
    ...response.payload,
  } as T
}
