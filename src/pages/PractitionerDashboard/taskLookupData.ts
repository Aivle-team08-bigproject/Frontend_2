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
    status: TaskStatus
  }>
}

export { taskStatusColors }

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
      status: row.status,
    })),
  }
}
