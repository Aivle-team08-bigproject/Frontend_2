import type { TaskStatus } from './data'
import { taskStatusColors } from './data'
import { fetchDashboardTaskLookup } from '../../shared/api'

export type LookupRow = {
  reqId: string
  client: string
  dataType: string
  detail: string
  assignee: string
  createdAt: string
  updatedAt: string
  status: TaskStatus
}

export type TaskLookupData = {
  bannerTitle: string
  bannerDescription: string
  rows: LookupRow[]
}

type TaskLookupApiResponse = {
  banner_title: string
  banner_description: string
  rows: Array<{
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

function normalizeTaskStatus(status: TaskLookupApiResponse['rows'][number]['status']): TaskStatus {
  const legacyStatusMap: Record<string, TaskStatus> = {
    진행중: '샘플데이터 및 피드백',
    가공중: '데이터 가공 진행',
    완료: '작업완료',
    '상태 확인 필요': '요구사항 분석',
  }
  return legacyStatusMap[status] ?? status
}

export { taskStatusColors }

export const EMPTY_TASK_LOOKUP: TaskLookupData = {
  bannerTitle: '조회된 작업이 없습니다.',
  bannerDescription: '표시할 작업 데이터가 없습니다.',
  rows: [],
}

export async function fetchTaskLookupData(): Promise<TaskLookupData> {
  const data = await fetchDashboardTaskLookup<TaskLookupApiResponse>()
  return {
    bannerTitle: data.banner_title,
    bannerDescription: data.banner_description,
    rows: data.rows.map((row) => ({
      reqId: row.request_no,
      client: row.client,
      dataType: row.data_type,
      detail: row.detail,
      assignee: row.assignee,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: normalizeTaskStatus(row.status),
    })),
  }
}
