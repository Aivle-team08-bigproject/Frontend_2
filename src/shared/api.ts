import { clearAccessToken, getAccessToken, remembersLogin, saveAccessToken } from './auth'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')
let refreshPromise: Promise<string> | null = null

/** `GET /api/auth/me`와 `POST /api/auth/login`이 공유하는 EmployeeSummary 스키마. */
export type EmployeeSummary = {
  employee_code: string
  name: string
  email: string
  department_id: number | null
  department_name: string | null
  role: EmployeeRole | null
  status: string
  must_change_password: boolean
  permissions: EmployeePermissionCode[]
}

export type LoginResponse = {
  access_token: string
  token_type: string
  expires_in_seconds: number
  expires_at: string
  employee: EmployeeSummary
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

export type PriorityCode = 'REQUIREMENT' | 'SAMPLE' | 'FINAL'

export type StageGroupCode =
  | 'REQUIREMENT_ANALYSIS'
  | 'SAMPLE_DATA'
  | 'FINAL_OUTPUT'
  | 'COMPLETED'
  | 'UNKNOWN'

export type DecisionStatus = 'pending' | 'approved' | 'changes_requested' | 'not_required'

export type StatusGroupCode = 'waiting_review' | 'in_progress' | 'completed' | 'failed' | 'unknown'

export type DashboardTaskItem = {
  request_no: string
  client: string
  title: string
  assignee_code: string | null
  assignee_name: string
  stage_code: string | null
  stage_group_code: StageGroupCode
  stage_label: string
  status_code: string | null
  status_group_code: StatusGroupCode
  priority_code: PriorityCode | null
  decision_status: DecisionStatus
  requires_action: boolean
  detail_route: string
  created_at: string
  updated_at: string
}

export type DashboardPriorityCard = {
  priority_code: PriorityCode
  label: string
  count: number
  detail_route: string
}

export type PopularProduct = {
  product_code: string
  product_name: string
  request_count: number
}

export type DashboardResponse = {
  generated_at: string
  priority_cards: DashboardPriorityCard[]
  priority_actions: DashboardTaskItem[]
  popular_products: PopularProduct[]
  popular_products_unavailable_message: string
  approval_tasks: DashboardTaskItem[]
  active_task_count: number
}

export type DashboardPageSize = 30 | 50 | 100

export type DashboardTasksQuery = {
  priority?: PriorityCode
  stage?: StageGroupCode
  page?: number
  page_size?: DashboardPageSize
}

export type DashboardTasksResponse = {
  items: DashboardTaskItem[]
  total_count: number
  page: number
  page_size: DashboardPageSize
}

export type TaskViewResponse<T extends object> = {
  request_no: string
  request_title: string
  view_code: string
  payload: T
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('로그인 세션이 만료되었습니다.')
        }
        const body = (await response.json()) as { access_token: string }
        saveAccessToken(body.access_token, remembersLogin())
        return body.access_token
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function request<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
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
  if (response.status === 401 && !retried && accessToken && path !== '/api/auth/refresh') {
    try {
      await refreshAccessToken()
      return request<T>(path, init, true)
    } catch (refreshError) {
      clearAccessToken()
      if (window.location.pathname !== '/login') window.location.assign('/login')
      throw refreshError
    }
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.detail?.message ?? `API 요청에 실패했습니다. (${response.status})`
    throw new Error(message)
  }
  // 로그아웃/비밀번호 변경처럼 204를 반환하는 엔드포인트가 있고,
  // 프록시가 빈 200을 돌려줄 수도 있으므로 본문 파싱 전에 JSON 여부를 확인한다.
  if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export function login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
  })
}

export function fetchCurrentEmployee(): Promise<EmployeeSummary> {
  return request('/api/auth/me')
}

export function logout(): Promise<void> {
  return request<void>('/api/auth/logout', { method: 'POST' })
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

export function fetchDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/api/v1/dashboard')
}

export function fetchDashboardTasks(query: DashboardTasksQuery): Promise<DashboardTasksResponse> {
  const params = new URLSearchParams()
  if (query.priority !== undefined) params.set('priority', query.priority)
  if (query.stage !== undefined) params.set('stage', query.stage)
  if (query.page !== undefined) params.set('page', String(query.page))
  if (query.page_size !== undefined) params.set('page_size', String(query.page_size))
  const queryString = params.toString()
  return request<DashboardTasksResponse>(`/api/v1/dashboard/tasks${queryString ? `?${queryString}` : ''}`)
}

export function fetchDashboardMyTasks<T>(): Promise<T> {
  return request('/api/v1/dashboard/my-tasks')
}

export function fetchDashboardTaskLookup<T>(): Promise<T> {
  return request('/api/v1/dashboard/task-lookup')
}

export async function fetchDeveloperDashboard<T>(period: 'daily' | 'weekly' | 'monthly'): Promise<T> {
  const response = await request<{ payload: T }>(`/api/v1/dashboard/developer?period=${period}`)
  return response.payload
}

export function fetchDashboardMembers<T>(): Promise<T> {
  return request('/api/v1/dashboard/members')
}

export type EmployeePermissionCode =
  | 'EMPLOYEE_READ'
  | 'EMPLOYEE_CREATE'
  | 'EMPLOYEE_UPDATE'
  | 'EMPLOYEE_PERMISSION_MANAGE'
  | 'EMPLOYEE_SESSION_MANAGE'
  | 'AUDIT_READ'
  | 'DATA_PRODUCT_READ'
  | 'DATA_PRODUCT_WRITE'
  | 'QUOTE_READ'
  | 'QUOTE_PROCESS'
  | 'CONTRACT_MANAGE'

export type EmployeeStatusCode = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'LOCKED' | 'DISABLED'

/** `/api/admin/employees/*`가 반환하는 EmployeeResponse 중 프론트가 사용하는 필드. */
export type AdminEmployee = {
  employee_code: string
  name: string
  email: string | null
  department_id: number | null
  department_name: string | null
  role: EmployeeRole | null
  status: EmployeeStatusCode
  must_change_password: boolean
  permissions: EmployeePermissionCode[]
}

export function replaceEmployeePermissions(employeeCode: string, permissions: EmployeePermissionCode[]) {
  return request<AdminEmployee>(`/api/admin/employees/${encodeURIComponent(employeeCode)}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  })
}

export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'SENIOR' | 'GENERAL'

export function replaceEmployeeRole(employeeCode: string, role: EmployeeRole) {
  return request<AdminEmployee>(`/api/admin/employees/${encodeURIComponent(employeeCode)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

export function updateEmployeeStatus(employeeCode: string, status: 'ACTIVE' | 'DISABLED') {
  return request<AdminEmployee>(`/api/admin/employees/${encodeURIComponent(employeeCode)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
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
