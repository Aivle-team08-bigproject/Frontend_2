import { colors } from './theme'

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
