import { clearAccessToken, getAccessToken, remembersLogin, saveAccessToken } from './auth'

// 빌드 시 VITE_API_BASE_URL을 안 넘기면 Docker ARG가 "안 정해짐"이 아니라 빈 문자열로
// 들어온다. ??는 null/undefined만 잡고 빈 문자열은 안 잡아서 || 로 둘 다 처리해야 한다.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
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

export type Department = {
  id: number
  name: string
  code: string
}

export type SignupPosition = 'STAFF' | 'ASSISTANT_MANAGER' | 'MANAGER' | 'DEPUTY_GENERAL_MANAGER' | 'GENERAL_MANAGER'

export type SignupPayload = {
  name: string
  email: string
  phone: string
  department_id: number
  position: SignupPosition
  password: string
  terms_agreed: boolean
  privacy_agreed: boolean
}

export type SignupResponse = {
  employee_code: string
  email: string
  status: 'PENDING_APPROVAL' | string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export type CreateDataRequestPayload = {
  raw_requirement: string
  title?: string
  requester_name?: string
  client?: {
    company_name: string
    business_registration_number?: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
  }
  contract?: {
    contract_no?: string
    start_date?: string
    end_date?: string
    delivery_due_at?: string
  }
  structured_requirement?: Record<string, unknown>
  source_data_status?: 'READY' | 'PREPARING' | 'UNKNOWN'
  data_sensitivity?: 'NONE' | 'POSSIBLE' | 'UNKNOWN'
}

export type CreateDataRequestResponse = {
  request_no: string
  contract_no?: string | null
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
  requirement_analysis: RequirementAnalysisResponse | null
}

export type RequirementAnalysisResponse = {
  usage_purpose: string
  requested_data_sentence: string
  categories: Record<string, unknown>
  delivery_channel: string
  output_formats: string[]
}

export type SamplePreviewColumn = {
  name: string
  data_type: string
  is_derived: boolean
  source_columns: string[]
  description: string
}

export type SamplePreviewResponse = {
  run_id: number
  stage: string
  attempt_no: number
  columns: SamplePreviewColumn[]
  rows: Array<Record<string, unknown>>
  metadata: { is_synthetic: boolean; sample_count: number; notice: string | null }
  selected_tables: Array<Record<string, unknown>>
  source_columns: Array<Record<string, unknown>>
  derived_columns: Array<Record<string, unknown>>
  selection_query: Record<string, unknown>
  interpretations: Array<Record<string, unknown>>
  catalog_issues: Array<Record<string, unknown>>
  catalog_matches: Array<Record<string, unknown>>
  review_summary: {
    requires_confirmation: boolean
    confirmation_terms: string[]
    has_catalog_issues: boolean
    catalog_issue_count: number
  }
}

export type ProcessingResultResponse = {
  run_id: number
  stage: string
  attempt_no: number
  api_result: { items: Array<Record<string, unknown>>; meta: Record<string, unknown> }
  processed_columns: string[]
  quality_report: Record<string, unknown>
  processing_explanation: Record<string, unknown>
  visualization: Record<string, unknown> | null
  report: Record<string, unknown> | null
  processing_plan: Record<string, unknown> | null
}

export type FailureCode =
  | 'SCHEMA_INVALID'
  | 'REQUIRED_KEY_MISSING'
  | 'FORMAT_INVALID'
  | 'LOGICAL_CONTRADICTION'
  | 'MISINTERPRETED_REQUIREMENT'
  | 'INSUFFICIENT_DATA'
  | 'LOW_SIMILARITY_MATCH'
  | 'DUPLICATED_DATA'
  | 'OUTLIER_DETECTED'
  | 'PROCESSING_RULE_INVALID'
  | 'PRIVACY_THRESHOLD_NOT_MET'
  | 'HUMAN_REJECTED'

export type ReviewDecision = 'APPROVED' | 'CHANGES_REQUESTED'

/** POST /api/v1/runs/{run_id}/review 요청 바디. */
export type StageReviewPayload = {
  approved: boolean
  retry?: boolean
  feedback?: string | null
  failure_code?: FailureCode | null
}

export type StageReviewResponse = {
  run_id: number
  reviewed_stage: string
  decision: ReviewDecision
  run_status: string
  /** 승인 후 이어서 진행할 단계. 최종 승인이면 null. */
  next_stage: string | null
  rollback_to_stage: string | null
  celery_task_id: string | null
}

export type PriorityCode = 'REQUIREMENT' | 'SAMPLE' | 'FINAL'

export type StageGroupCode =
  | 'REQUIREMENT_ANALYSIS'
  | 'SAMPLE_DATA'
  | 'FINAL_OUTPUT'
  | 'COMPLETED'
  | 'UNKNOWN'

export type DecisionStatus = 'pending' | 'approved' | 'changes_requested' | 'not_required'

export type StatusGroupCode =
  | 'waiting_review'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'overdue'
  | 'unknown'

export type DashboardTaskItem = {
  request_no: string
  /** 파이프라인 실행 식별자. 실행이 아직 없는 요청은 null. */
  run_id: number | null
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
  progress_percent: number
  due_at: string | null
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

export type DashboardDeadlineTask = {
  request_no: string
  client: string
  title: string
  assignee_name: string
  stage_label: string
  due_at: string
  detail_route: string
}

export type DashboardCalendarEvent = {
  request_no: string
  title: string
  client: string
  event_type: 'CONTRACT_START' | 'CONTRACT_END' | 'DELIVERY_DUE'
  event_date: string
  detail_route: string
}

export type DashboardScope = 'mine' | 'all'

export type PersonalDashboardSummary = {
  total_count: number
  active_count: number
  approval_count: number
  failed_count: number
  completion_rate: number
}

export type DashboardStageProgress = {
  code: string
  status: string
  progress_percent: number
}

export type DashboardProgress = {
  percent: number
  current_stage: string | null
  stages: DashboardStageProgress[]
}

/** `GET /api/v1/dashboard` — 항상 현재 로그인 사용자의 개인 작업 범위. */
export type DashboardResponse = {
  scope: 'mine'
  generated_at: string
  summary: PersonalDashboardSummary
  progress: DashboardProgress
  priority_cards: DashboardPriorityCard[]
  priority_actions: DashboardTaskItem[]
  popular_products: PopularProduct[]
  popular_products_unavailable_message: string
  approval_tasks: DashboardTaskItem[]
  deadline_tasks: DashboardDeadlineTask[]
  calendar_events: DashboardCalendarEvent[]
  active_task_count: number
}

export type AdminDashboardSummary = {
  total_count: number
  active_count: number
  waiting_review_count: number
  failed_count: number
  overdue_count: number
  deadline_soon_count: number
}

export type AssigneeProgress = {
  assignee_code: string | null
  assignee_name: string
  total_count: number
  completed_count: number
  waiting_review_count: number
  failed_count: number
  progress_percent: number
}

/** `GET /api/v1/dashboard/overview` — CONTRACT_MANAGE 권한 보유자 전용. */
export type AdminDashboardResponse = {
  scope: 'all'
  generated_at: string
  summary: AdminDashboardSummary
  assignee_progress: AssigneeProgress[]
  /** deadline_soon / overdue / repeated_failures / final_outputs_for_review 키를 사용한다. */
  attention_items: Record<string, DashboardTaskItem[]>
}

export type DashboardPageSize = 30 | 50 | 100

export type DashboardTasksQuery = {
  /** 기본값 mine. all은 관리자 권한이 있어야 한다. */
  scope?: DashboardScope
  search?: string
  priority?: PriorityCode
  stage?: StageGroupCode
  status?: StatusGroupCode
  assignee?: string
  /** YYYY-MM-DD */
  created_from?: string
  created_to?: string
  page?: number
  page_size?: DashboardPageSize
}

export type DashboardTasksResponse = {
  scope: DashboardScope
  items: DashboardTaskItem[]
  total_count: number
  page: number
  page_size: DashboardPageSize
}

export type TaskArtifactDetail = {
  artifact_id: number
  artifact_type: string
  storage_key: string
  mime_type: string | null
  size_bytes: number | null
  pii_scan_status: string
}

export type TaskStageDetail = {
  stage_code: string
  status: string
  progress_percent: number
  attempt_no: number
  executor: string
  review_status: string | null
  artifacts: TaskArtifactDetail[]
  created_at: string
  started_at: string | null
  completed_at: string | null
  error_message: string | null
}

export type TaskHistoryEntry = {
  review_type: string
  decision: string
  feedback: string | null
  reviewer_name: string | null
  created_at: string
}

export type TaskDetailAction = 'APPROVE' | 'REQUEST_CHANGES' | 'RETRY' | 'DOWNLOAD'

/** `GET /api/v1/tasks/{request_no}/runs/{run_id}/detail` */
export type TaskDetailResponse = {
  request_no: string
  run_id: number
  title: string
  assignee_code: string | null
  assignee_name: string
  run_status: string | null
  current_stage: string | null
  progress_percent: number
  attempt_no: number | null
  rollback_to_stage: string | null
  error_message: string | null
  stages: TaskStageDetail[]
  available_actions: TaskDetailAction[]
  history: TaskHistoryEntry[]
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
  // FormData(파일 업로드)는 브라우저가 자동으로 boundary 포함한 Content-Type을 설정해야 하므로
  // 여기서 application/json을 강제로 넣지 않는다.
  const isFormData = init?.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
    throw new ApiError(message, response.status, body?.detail?.code)
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

export function fetchPublicDepartments(): Promise<Department[]> {
  return request<Department[]>('/api/public/departments')
}

export function signup(payload: SignupPayload): Promise<SignupResponse> {
  return request<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
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

export type ExtractedTextResponse = {
  extracted_text: string
  filename: string
  /** extracted_text가 길이 제한(8000자, raw_requirement max_length와 동일)을 넘어 잘렸는지. */
  truncated: boolean
}

/**
 * 업로드한 문서(.txt/.docx/.pdf)에서 텍스트만 추출한다. DB에 아무것도 안 쓰고 에이전트도
 * 안 돈다 — 순수 변환이라 결과를 어디에 채워 넣을지는 호출부 몫이다.
 */
export function extractDocumentText(file: File): Promise<ExtractedTextResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return request<ExtractedTextResponse>('/api/documents/extract-text', {
    method: 'POST',
    body: formData,
  })
}

export function fetchPipelineRun(runId: number): Promise<PipelineRunResponse> {
  return request(`/api/v1/runs/${runId}`)
}

export function fetchSamplePreview(runId: number): Promise<SamplePreviewResponse> {
  return request(`/api/v1/runs/${runId}/sample-preview`)
}

export function fetchProcessingResult(runId: number): Promise<ProcessingResultResponse> {
  return request(`/api/v1/runs/${runId}/processing-result`)
}

/** 인증 쿠키 기반 결과 파일 다운로드 주소. */
export function pipelineResultDownloadUrl(runId: number): string {
  return `${API_BASE_URL}/api/v1/runs/${runId}/result.csv`
}

/** 단계 산출물 검토(HITL). 승인 시 다음 단계로, 반려 시 해당 단계로 되돌린다. */
export function submitReview(runId: number, payload: StageReviewPayload): Promise<StageReviewResponse> {
  return request(`/api/v1/runs/${runId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/api/v1/dashboard')
}

/** 관리자 전체 작업 Dashboard. CONTRACT_MANAGE 권한이 없으면 403이 온다. */
export function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  return request<AdminDashboardResponse>('/api/v1/dashboard/overview')
}

export function fetchDashboardTasks(query: DashboardTasksQuery): Promise<DashboardTasksResponse> {
  const params = new URLSearchParams()
  if (query.scope !== undefined) params.set('scope', query.scope)
  if (query.search) params.set('search', query.search)
  if (query.priority !== undefined) params.set('priority', query.priority)
  if (query.stage !== undefined) params.set('stage', query.stage)
  if (query.status !== undefined) params.set('status', query.status)
  if (query.assignee) params.set('assignee', query.assignee)
  if (query.created_from) params.set('created_from', query.created_from)
  if (query.created_to) params.set('created_to', query.created_to)
  if (query.page !== undefined) params.set('page', String(query.page))
  if (query.page_size !== undefined) params.set('page_size', String(query.page_size))
  const queryString = params.toString()
  return request<DashboardTasksResponse>(`/api/v1/dashboard/tasks${queryString ? `?${queryString}` : ''}`)
}

export function fetchTaskDetail(requestNo: string, runId: number): Promise<TaskDetailResponse> {
  return request<TaskDetailResponse>(
    `/api/v1/tasks/${encodeURIComponent(requestNo)}/runs/${runId}/detail`,
  )
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
