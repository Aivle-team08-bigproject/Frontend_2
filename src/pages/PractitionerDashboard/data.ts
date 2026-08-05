import type { SubNavItem } from '../../shared/SubNav'
import { fetchDashboard, type DashboardResponse, type DashboardTaskItem, type PriorityCode } from '../../shared/api'
import { colors } from '../../shared/theme'

/** 전체 작업/작업 리스트/내 작업 현황 세 페이지가 공유하는 SubNav 탭. 페이지마다 따로 하드코딩하면 하나 바꿀 때 나머지가 안 맞음. */
export const PRACTITIONER_NAV_ITEMS: SubNavItem[] = [
  { label: '전체 작업', to: '/dashboard' },
  { label: '작업 리스트', to: '/dashboard/tasks' },
  { label: '내 작업 현황', to: '/dashboard/my-tasks' },
]

export type StatCard = {
  label: string
  value: number
  unit: string
  caption: string
  highlight?: boolean
  /** 클릭 시 이동할 경로. 없으면 클릭 불가. */
  linkTo?: string
}

export type WarningCard = {
  title: string
  countLabel: string
  countBg: string
  countColor: string
  description: string
  footNote: string
  actionTo: string
}

export type RankedItem = {
  rank: number
  title: string
  subtitle: string
  tag: string
  tagBg: string
  tagColor: string
}

export type SupplementItem = {
  title: string
  note: string
  noteColor: string
  tag: string
  tagBg: string
  tagColor: string
}

export type DeadlineItem = {
  requestNo: string
  title: string
  subtitle: string
  tag: string
  tagBg: string
  tagColor: string
  route: string
}

export const TASK_STATUSES = [
  '요구사항 분석',
  '요구사항 분석 진행',
  '요구사항 완료 피드백',
  '데이터 선별 진행',
  '샘플데이터 및 피드백',
  '데이터 가공 진행',
  '최종 산출물 및 피드백',
  '작업완료',
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_FILTER_STAGES = ['요구사항 분석', '샘플 데이터', '최종 산출물', '완료'] as const
export type TaskFilterStage = (typeof TASK_FILTER_STAGES)[number]

export const taskFilterStageForStatus: Record<TaskStatus, TaskFilterStage> = {
  '요구사항 분석': '요구사항 분석',
  '요구사항 분석 진행': '요구사항 분석',
  '요구사항 완료 피드백': '요구사항 분석',
  '데이터 선별 진행': '샘플 데이터',
  '샘플데이터 및 피드백': '샘플 데이터',
  '데이터 가공 진행': '최종 산출물',
  '최종 산출물 및 피드백': '최종 산출물',
  작업완료: '완료',
}

export const taskStatusColors: Record<TaskStatus, { bg: string; color: string }> = {
  '요구사항 분석': { bg: '#e6f0ff', color: '#0066ff' },
  '요구사항 분석 진행': { bg: '#dbeafe', color: '#2563eb' },
  '요구사항 완료 피드백': { bg: '#ede9fe', color: '#7c3aed' },
  '데이터 선별 진행': { bg: '#fef3c7', color: '#d97706' },
  '샘플데이터 및 피드백': { bg: '#ffedd5', color: '#ea580c' },
  '데이터 가공 진행': { bg: '#fce7f3', color: '#db2777' },
  '최종 산출물 및 피드백': { bg: '#fee2e2', color: '#dc2626' },
  작업완료: { bg: '#dcfce7', color: '#22c55e' },
}

export type TaskRow = {
  reqId: string
  client: string
  dataType: string
  detail: string
  assignee: string
  createdAt: string
  updatedAt: string
  status: TaskStatus
}

export type PractitionerDashboardData = {
  statCards: StatCard[]
  alertBannerCount: number
  warningCards: WarningCard[]
  preferredItems: RankedItem[]
  supplementItems: SupplementItem[]
  deadlineItems: DeadlineItem[]
}

const priorityColors = {
  REQUIREMENT: { bg: colors.dangerBg, color: colors.danger },
  SAMPLE: { bg: colors.warningBgAlt, color: colors.warningAlt },
  FINAL: { bg: colors.warningBg, color: colors.warning },
} as const

export const PRIORITY_LABELS: Record<PriorityCode, string> = {
  REQUIREMENT: '요구사항 분석',
  SAMPLE: '샘플 데이터',
  FINAL: '최종 산출물',
}

function deadlineUrgency(dueAt: string): { label: string; urgent: boolean } {
  const remainingHours = Math.ceil((new Date(dueAt).getTime() - Date.now()) / (60 * 60 * 1000))
  if (remainingHours <= 0) return { label: '마감 지남', urgent: true }
  if (remainingHours <= 24) return { label: `D-day · ${remainingHours}시간 남음`, urgent: true }
  return { label: `D-${Math.ceil(remainingHours / 24)}`, urgent: false }
}

function deadlineItemFromTask(item: DashboardResponse['deadline_tasks'][number]): DeadlineItem {
  const urgency = deadlineUrgency(item.due_at)
  return {
    requestNo: item.request_no,
    title: item.title,
    subtitle: `${item.request_no} · ${item.client} · 담당 ${item.assignee_name}`,
    tag: urgency.label,
    tagBg: urgency.urgent ? colors.dangerBg : colors.warningBg,
    tagColor: urgency.urgent ? colors.danger : colors.warning,
    route: `${item.detail_route}${item.detail_route.includes('?') ? '&' : '?'}requestNo=${encodeURIComponent(item.request_no)}`,
  }
}

function dashboardTasks(data: DashboardResponse): DashboardTaskItem[] {
  const uniqueItems = new Map<string, DashboardTaskItem>()
  for (const item of [...data.priority_actions, ...data.approval_tasks]) {
    uniqueItems.set(item.request_no, item)
  }
  return [...uniqueItems.values()]
}

function warningCardFromPriority(
  card: DashboardResponse['priority_cards'][number],
  actions: DashboardTaskItem[],
): WarningCard {
  const palette = priorityColors[card.priority_code]
  const action = actions.find((item) => item.priority_code === card.priority_code)
  return {
    title: card.label,
    countLabel: `${card.count}건`,
    countBg: palette.bg,
    countColor: palette.color,
    description: action?.title ?? `${card.count}건의 작업이 조치를 기다리고 있습니다.`,
    footNote: card.count > 0 ? '상세 조치가 필요합니다.' : '현재 조치 대기 작업이 없습니다.',
    actionTo: card.detail_route,
  }
}

export const EMPTY_PRACTITIONER_DASHBOARD: PractitionerDashboardData = {
  statCards: [],
  alertBannerCount: 0,
  warningCards: [],
  preferredItems: [],
  supplementItems: [],
  deadlineItems: [],
}

export async function fetchPractitionerDashboardData(): Promise<PractitionerDashboardData> {
  const data = await fetchDashboard()
  const actions = dashboardTasks(data)
  return {
    statCards: [
      ...data.priority_cards.map((card, index) => ({
        label: card.label,
        value: card.count,
        unit: '건',
        caption: `우선순위 ${index + 1}`,
        highlight: card.count > 0,
        linkTo: card.detail_route,
      })),
      {
        label: '진행 중인 전체 작업',
        value: data.active_task_count,
        unit: '건',
        caption: '전체 작업 현황',
        linkTo: '/dashboard/tasks',
      },
    ],
    alertBannerCount: actions.length,
    warningCards: data.priority_cards.map((card) => warningCardFromPriority(card, actions)),
    preferredItems: data.popular_products.map((item, index) => ({
      rank: index + 1,
      title: item.product_name,
      subtitle: `${item.request_count}건 요청`,
      tag: item.product_code,
      tagBg: colors.flowPrimaryBg,
      tagColor: colors.primary,
    })),
    supplementItems: data.popular_products.length === 0
      ? [{
          title: '인기 상품 데이터',
          note: data.popular_products_unavailable_message,
          noteColor: colors.textMuted,
          tag: '제공 불가',
          tagBg: colors.bg,
          tagColor: colors.textSecondary,
        }]
      : [],
    deadlineItems: data.deadline_tasks.slice(0, 5).map(deadlineItemFromTask),
  }
}
