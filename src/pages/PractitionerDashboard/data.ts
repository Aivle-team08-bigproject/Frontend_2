import { fetchDashboard } from '../../shared/api'

export type StatCard = {
  label: string
  value: number
  unit: string
  caption: string
  highlight?: boolean
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

export type TaskStatus = '요구사항 분석' | '진행중' | '가공중' | '완료'

export const taskStatusColors: Record<TaskStatus, { bg: string; color: string }> = {
  '요구사항 분석': { bg: '#e6f0ff', color: '#0066ff' },
  진행중: { bg: '#fef3c7', color: '#d97706' },
  가공중: { bg: '#ffedd5', color: '#ea580c' },
  완료: { bg: '#dcfce7', color: '#22c55e' },
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
  taskRows: TaskRow[]
  pageSize: number
}

type DashboardApiResponse = {
  stat_cards: StatCard[]
  alert_banner_count: number
  warning_cards: Array<Omit<WarningCard, 'countLabel' | 'countBg' | 'countColor' | 'footNote' | 'actionTo'> & {
    count_label: string
    count_bg: string
    count_color: string
    foot_note: string
    action_to: string
  }>
  preferred_items: Array<Omit<RankedItem, 'tagBg' | 'tagColor'> & { tag_bg: string; tag_color: string }>
  supplement_items: Array<Omit<SupplementItem, 'noteColor' | 'tagBg' | 'tagColor'> & { note_color: string; tag_bg: string; tag_color: string }>
  task_rows: Array<{
    request_no: string
    client: string
    data_type: string
    detail: string
    assignee: string
    created_at: string
    updated_at: string
    status: TaskStatus
  }>
  page_size: number
}

export async function fetchPractitionerDashboardData(): Promise<PractitionerDashboardData> {
  const data = await fetchDashboard<DashboardApiResponse>()
  return {
    statCards: data.stat_cards,
    alertBannerCount: data.alert_banner_count,
    warningCards: data.warning_cards.map((item) => ({
      title: item.title,
      countLabel: item.count_label,
      countBg: item.count_bg,
      countColor: item.count_color,
      description: item.description,
      footNote: item.foot_note,
      actionTo: item.action_to,
    })),
    preferredItems: data.preferred_items.map((item) => ({
      rank: item.rank,
      title: item.title,
      subtitle: item.subtitle,
      tag: item.tag,
      tagBg: item.tag_bg,
      tagColor: item.tag_color,
    })),
    supplementItems: data.supplement_items.map((item) => ({
      title: item.title,
      note: item.note,
      noteColor: item.note_color,
      tag: item.tag,
      tagBg: item.tag_bg,
      tagColor: item.tag_color,
    })),
    taskRows: data.task_rows.map((item) => ({
      reqId: item.request_no,
      client: item.client,
      dataType: item.data_type,
      detail: item.detail,
      assignee: item.assignee,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      status: item.status,
    })),
    pageSize: data.page_size,
  }
}
