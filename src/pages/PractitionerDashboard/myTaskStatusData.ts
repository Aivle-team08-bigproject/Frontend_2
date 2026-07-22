import { fetchPractitionerDashboardData, type TaskRow } from './data'

export type TaskCardStatus = 'urgent' | 'normal'

export type MyTaskCard = {
  reqId: string
  client: string
  summary: string
  status: TaskCardStatus
  badges: { label: string; bg: string; color: string }[]
  progress: number
  progressLabel: string
  progressLabelColor: string
  registeredAt: string
  dueLabel: string
  dueColor: string
  actionLabel: string
  actionTo: string
}

export type MyTaskStatusData = {
  userName: string
  roleBadge: string
  activeCount: number
  urgentCount: number
  monthlyCompleted: number
  qualityScore: string
  cards: MyTaskCard[]
}

function progressFor(row: TaskRow): number {
  return { '요구사항 분석': 15, 진행중: 40, 가공중: 65, 완료: 100 }[row.status]
}

export async function fetchMyTaskStatusData(): Promise<MyTaskStatusData> {
  const dashboard = await fetchPractitionerDashboardData()
  const assigned = dashboard.taskRows.filter((row) => row.assignee === '홍길동 책임' && row.status !== '완료')
  const completed = dashboard.taskRows.filter((row) => row.assignee === '홍길동 책임' && row.status === '완료')
  return {
    userName: '홍길동 책임님',
    roleBadge: 'Senior Operator',
    activeCount: assigned.length,
    urgentCount: assigned.filter((row) => row.status === '요구사항 분석').length,
    monthlyCompleted: completed.length,
    qualityScore: '98.2%',
    cards: assigned.slice(0, 3).map((row, index) => {
      const urgent = row.status === '요구사항 분석' && index === 0
      const progress = progressFor(row)
      const route = { '요구사항 분석': '/tasks/review', 진행중: '/tasks/selection', 가공중: '/tasks/processing', 완료: '/tasks/complete' }[row.status]
      return {
        reqId: row.reqId,
        client: row.client,
        summary: row.dataType,
        status: urgent ? 'urgent' : 'normal',
        badges: urgent
          ? [{ label: '마감 임박', bg: '#fde8e8', color: '#dc2626' }, { label: row.status, bg: '#e6f0ff', color: '#0066ff' }]
          : [{ label: row.status, bg: '#ffedd5', color: '#ea580c' }],
        progress,
        progressLabel: `${progress}% (${row.detail})`,
        progressLabelColor: urgent ? '#dc2626' : '#0f5a52',
        registeredAt: `등록일: ${row.createdAt}`,
        dueLabel: urgent ? '마감일: 오늘 18:00 (초과 시 패널티)' : '마감일: 데모 일정 확인 필요',
        dueColor: urgent ? '#dc2626' : '#495057',
        actionLabel: urgent ? '바로 작업하기' : '상세 보기',
        actionTo: `${route}?requestNo=${encodeURIComponent(row.reqId)}`,
      }
    }),
  }
}
