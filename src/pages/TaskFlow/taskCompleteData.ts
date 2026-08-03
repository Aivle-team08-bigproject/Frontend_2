import { fetchTaskView } from '../../shared/api'

export type MilestoneItem = {
  title: string
  time: string
  description: string
}

export type OutputFile = {
  name: string
  size: string
  kind: 'csv' | 'xlsx'
}

export type TaskCompleteData = {
  reqId: string
  requestTitle: string
  milestones: MilestoneItem[]
  files: OutputFile[]
  endpointUrl: string
  apiKeyMasked: string
  recipientEmail: string
  emailSubject: string
}

export const EMPTY_TASK_COMPLETE: TaskCompleteData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  milestones: [],
  files: [],
  endpointUrl: '-',
  apiKeyMasked: '-',
  recipientEmail: '-',
  emailSubject: '-',
}

export function fetchTaskCompleteData(): Promise<TaskCompleteData> {
  return fetchTaskView<TaskCompleteData>('complete')
}
