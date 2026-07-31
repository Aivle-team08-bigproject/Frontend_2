import { fetchDashboardMyTasks } from '../../shared/api'
import type { TaskRow, TaskStatus } from './data'

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
  completedCount: number
  completionRate: string
  cards: MyTaskCard[]
}

type MyTaskStatusApiResponse = {
  employee_code: string
  user_name: string
  department: string
  active_count: number
  urgent_count: number
  completed_count: number
  completion_rate: number
  tasks: Array<{
    request_no: string
    client: string
    data_type: string
    detail: string
    assignee: string
    created_at: string
    updated_at: string
    status: TaskStatus | '진행중' | '가공중' | '완료' | '상태 확인 필요'
  }>
}

function normalizeTaskStatus(status: MyTaskStatusApiResponse['tasks'][number]['status']): TaskStatus {
  const legacyStatusMap: Record<string, TaskStatus> = {
    진행중: '샘플데이터 및 피드백',
    가공중: '데이터 가공 진행',
    완료: '작업완료',
    '상태 확인 필요': '요구사항 분석',
  }
  return legacyStatusMap[status] ?? status
}

function progressFor(row: TaskRow): number {
  return {
    '요구사항 분석': 15,
    '요구사항 분석 진행': 25,
    '요구사항 완료 피드백': 35,
    '데이터 선별 진행': 50,
    '샘플데이터 및 피드백': 60,
    '데이터 가공 진행': 75,
    '최종 산출물 및 피드백': 90,
    작업완료: 100,
  }[row.status]
}

export const EMPTY_MY_TASK_STATUS: MyTaskStatusData = {
  userName: '-',
  roleBadge: '-',
  activeCount: 0,
  urgentCount: 0,
  completedCount: 0,
  completionRate: '0.0%',
  cards: [],
}

export async function fetchMyTaskStatusData(): Promise<MyTaskStatusData> {
  const response = await fetchDashboardMyTasks<MyTaskStatusApiResponse>()
  const assigned: TaskRow[] = response.tasks
    .map((row) => ({ ...row, status: normalizeTaskStatus(row.status) }))
    .filter((row) => row.status !== '작업완료')
    .map((row) => ({
      reqId: row.request_no,
      client: row.client,
      dataType: row.data_type,
      detail: row.detail,
      assignee: row.assignee,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
    }))
  return {
    userName: `${response.user_name}님`,
    roleBadge: response.department,
    activeCount: response.active_count,
    urgentCount: response.urgent_count,
    completedCount: response.completed_count,
    completionRate: `${response.completion_rate.toFixed(1)}%`,
    cards: assigned.slice(0, 3).map((row, index) => {
      const urgent = ['요구사항 분석', '요구사항 분석 진행', '요구사항 완료 피드백'].includes(row.status) && index === 0
      const progress = progressFor(row)
      const route = {
        '요구사항 분석': '/tasks/review',
        '요구사항 분석 진행': '/tasks/review',
        '요구사항 완료 피드백': '/tasks/review',
        '데이터 선별 진행': '/tasks/selection',
        '샘플데이터 및 피드백': '/tasks/sample-feedback',
        '데이터 가공 진행': '/tasks/processing',
        '최종 산출물 및 피드백': '/tasks/final-feedback',
        작업완료: '/tasks/complete',
      }[row.status]
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
        dueLabel: urgent ? '마감일: 오늘 18:00' : '마감일: 데모 일정 확인 필요',
        dueColor: urgent ? '#dc2626' : '#495057',
        actionLabel: urgent ? '바로 작업하기' : '상세 보기',
        actionTo: `${route}?requestNo=${encodeURIComponent(row.reqId)}`,
      }
    }),
  }
}
