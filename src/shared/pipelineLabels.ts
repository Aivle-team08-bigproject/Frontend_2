import { colors } from './theme'
import { formatTime } from './datetime'
import type { PipelineStreamItem } from './pipelineEventStream'
import type { TimelineItem, TimelineStepState } from './Timeline'

/**
 * Back의 canonical code를 화면 표시용 라벨·색으로 바꾼다.
 * 상태 판단은 항상 code로 하고, 여기서 나온 라벨은 표시 전용이다.
 */

export const STAGE_LABELS: Record<string, string> = {
  REQUIREMENT_ANALYSIS: '요구사항 분석',
  DATA_SELECTION: '데이터 선별',
  DATA_PROCESSING: '데이터 가공',
}

export function stageLabel(code: string | null | undefined): string {
  if (!code) return '-'
  return STAGE_LABELS[code] ?? code
}

type Tone = { label: string; bg: string; color: string }

/** PipelineRunStatus → 표시 라벨. */
const RUN_STATUS_TONES: Record<string, Tone> = {
  QUEUED: { label: '실행 대기', bg: colors.bg, color: colors.textSecondary },
  RUNNING: { label: '진행 중', bg: colors.infoBg, color: colors.info },
  WAITING_REQUIREMENT_REVIEW: { label: '요구사항 검토 필요', bg: colors.warningBg, color: colors.warning },
  WAITING_SAMPLE_REVIEW: { label: '샘플 데이터 검토 필요', bg: colors.warningBgAlt, color: colors.warningAlt },
  WAITING_FINAL_REVIEW: { label: '최종 산출물 검토 필요', bg: colors.warningBg, color: colors.warning },
  COMPLETED: { label: '완료', bg: colors.successBg, color: colors.success },
  FAILED: { label: '실패', bg: colors.dangerBg, color: colors.danger },
  CANCELLED: { label: '취소됨', bg: colors.bg, color: colors.textMuted },
}

export function runStatusTone(code: string | null | undefined): Tone {
  if (!code) return { label: '상태 없음', bg: colors.bg, color: colors.textMuted }
  return RUN_STATUS_TONES[code] ?? { label: code, bg: colors.bg, color: colors.textSecondary }
}

/** Dashboard 목록용 집계 상태 코드 → 표시 라벨. `status_code`는 현재 단계 상태이므로 여기와 혼용하지 않는다. */
const DASHBOARD_STATUS_TONES: Record<string, Tone> = {
  waiting_review: { label: '검토 대기', bg: colors.warningBg, color: colors.warning },
  in_progress: { label: '진행 중', bg: colors.infoBg, color: colors.info },
  completed: { label: '완료', bg: colors.successBg, color: colors.success },
  failed: { label: '실패', bg: colors.dangerBg, color: colors.danger },
  overdue: { label: '기한 초과', bg: colors.dangerBg, color: colors.danger },
  unknown: { label: '상태 없음', bg: colors.bg, color: colors.textMuted },
}

export function dashboardStatusTone(code: string | null | undefined): Tone {
  if (!code) return DASHBOARD_STATUS_TONES.unknown
  return DASHBOARD_STATUS_TONES[code] ?? { label: code, bg: colors.bg, color: colors.textSecondary }
}

/** StageRunStatus → 표시 라벨. */
const STAGE_STATUS_TONES: Record<string, Tone> = {
  PENDING: { label: '대기', bg: colors.bg, color: colors.textMuted },
  RUNNING: { label: '진행 중', bg: colors.infoBg, color: colors.info },
  COMPLETED: { label: '완료', bg: colors.successBg, color: colors.success },
  FAILED: { label: '실패', bg: colors.dangerBg, color: colors.danger },
  CANCELLED: { label: '취소됨', bg: colors.bg, color: colors.textMuted },
  ROLLED_BACK: { label: '롤백됨', bg: colors.warningBg, color: colors.warning },
}

export function stageStatusTone(code: string | null | undefined): Tone {
  if (!code) return { label: '-', bg: colors.bg, color: colors.textMuted }
  return STAGE_STATUS_TONES[code] ?? { label: code, bg: colors.bg, color: colors.textSecondary }
}

/** WAITING_*_REVIEW 상태에서 해당 검토를 처리할 단계별 화면 경로 조각. */
const REVIEW_ROUTE_BY_RUN_STATUS: Record<string, string> = {
  WAITING_REQUIREMENT_REVIEW: 'review',
  WAITING_SAMPLE_REVIEW: 'sample-feedback',
  WAITING_FINAL_REVIEW: 'final-feedback',
}

/** 진행 중인 단계에서 볼 화면 경로 조각. */
const PROGRESS_ROUTE_BY_STAGE: Record<string, string> = {
  REQUIREMENT_ANALYSIS: 'analyzing',
  DATA_SELECTION: 'selection',
  DATA_PROCESSING: 'processing',
}

const CONTENT_ROUTE_BY_STAGE: Record<string, string> = {
  REQUIREMENT_ANALYSIS: 'review',
  DATA_SELECTION: 'sample-feedback',
  DATA_PROCESSING: 'final-feedback',
}

/** 이미 완료된 이전 단계의 산출물 화면을 다시 여는 경로. */
export function stageContentPath(requestNo: string, runId: number | string, stageCode: string): string {
  const base = `/tasks/${encodeURIComponent(requestNo)}/runs/${runId}`
  return `${base}/${CONTENT_ROUTE_BY_STAGE[stageCode] ?? 'detail'}`
}

/**
 * run_status와 current_stage로 지금 사용자가 봐야 할 단계별 화면을 정한다.
 * 새로고침·직접 URL 접근에서도 같은 규칙으로 화면을 복원할 수 있다.
 */
export function stageScreenPath(
  requestNo: string,
  runId: number | string,
  runStatus: string | null | undefined,
  currentStage: string | null | undefined,
): string {
  const base = `/tasks/${encodeURIComponent(requestNo)}/runs/${runId}`
  if (!runStatus) return `${base}/detail`
  if (runStatus === 'COMPLETED') return `${base}/complete`
  const reviewPath = REVIEW_ROUTE_BY_RUN_STATUS[runStatus]
  if (reviewPath) return `${base}/${reviewPath}`
  if (runStatus === 'RUNNING' || runStatus === 'QUEUED') {
    const progressPath = currentStage ? PROGRESS_ROUTE_BY_STAGE[currentStage] : undefined
    return `${base}/${progressPath ?? 'analyzing'}`
  }
  // FAILED·CANCELLED는 단계 화면 대신 통합 상세에서 원인과 이력을 본다.
  return `${base}/detail`
}

export type StepDef = { code: string; title: string }

/** app/domains/pipeline/analysis_steps.py ANALYSIS_STEP_ORDER와 대응. */
export const ANALYSIS_STEPS: StepDef[] = [
  { code: 'REQUEST_ANALYSIS', title: '요청 분석' },
  { code: 'REQUEST_STRUCTURING', title: '요청 구조화' },
  { code: 'DATA_CATEGORIZATION', title: '데이터 범주화' },
]

/** app/domains/pipeline/selection_steps.py SELECTION_STEP_ORDER와 대응. */
export const SELECTION_STEPS: StepDef[] = [
  { code: 'SOURCE_COLUMN_SELECTION', title: '원본 컬럼 선별' },
  { code: 'DERIVED_COLUMN_DESIGN', title: '파생 컬럼 정의' },
  { code: 'SYNTHETIC_SAMPLE_GENERATION', title: '합성 샘플 생성' },
]

/** app/domains/pipeline/processing_steps.py PROCESSING_STEP_ORDER와 대응. */
export const PROCESSING_STEPS: StepDef[] = [
  { code: 'DEDUPLICATION_PLAN', title: '중복 제거 계획' },
  { code: 'MISSING_VALUE_PLAN', title: '결측 처리 계획' },
  { code: 'DERIVED_COLUMN_ORDER', title: '파생 컬럼 생성 순서' },
  { code: 'FINAL_COLUMN_VALIDATION', title: '최종 컬럼·품질 검증' },
]

function stepTimelineState(status: string | undefined): TimelineStepState {
  if (status === 'COMPLETED') return 'done'
  if (status === 'RUNNING' || status === 'FAILED') return 'active'
  return 'pending'
}

const FALLBACK_STEP_DESCRIPTION: Record<string, string> = {
  PENDING: '대기하고 있습니다.',
  RUNNING: '진행하고 있습니다.',
  COMPLETED: '완료되었습니다.',
  FAILED: '실패했습니다.',
  ROLLED_BACK: '롤백되었습니다.',
}

/**
 * SSE로 받은 서브스텝 배열을 Timeline이 그리는 형태로 바꾼다.
 * `messages`는 실시간 status 이벤트에서 모아둔 item_code별 최신 안내 문구로,
 * 있으면 그걸 우선 쓰고 없으면(snapshot 직후 등) 상태 기반 기본 문구를 쓴다.
 */
export function buildStepTimelineItems(
  items: PipelineStreamItem[],
  steps: StepDef[],
  messages?: Record<string, string>,
): TimelineItem[] {
  const byCode = new Map(items.map((item) => [item.item_code, item]))
  return steps.map((step) => {
    const item = byCode.get(step.code)
    const status = item?.status
    const time = item?.completed_at
      ? formatTime(item.completed_at)
      : item?.started_at
        ? formatTime(item.started_at)
        : '-'
    const description =
      messages?.[step.code] ??
      (status === 'FAILED' && item?.error_message ? item.error_message : undefined) ??
      FALLBACK_STEP_DESCRIPTION[status ?? 'PENDING']
    return {
      title: step.title,
      time,
      description,
      state: stepTimelineState(status),
    }
  })
}

/** 서브스텝 배열 전체로 상위 stage의 대표 상태를 판단한다(카드 헤더 배지용). */
export function aggregateStepStatus(items: PipelineStreamItem[]): 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' {
  if (items.length === 0) return 'PENDING'
  if (items.some((item) => item.status === 'FAILED')) return 'FAILED'
  if (items.every((item) => item.status === 'COMPLETED')) return 'COMPLETED'
  if (items.some((item) => item.status === 'RUNNING' || item.status === 'COMPLETED')) return 'RUNNING'
  return 'PENDING'
}
