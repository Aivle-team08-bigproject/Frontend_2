import { fetchTaskView } from '../../shared/api'

export type MilestoneItem = {
  title: string
  time: string
  description: string
}

export type TaskCompleteData = {
  reqId: string
  requestTitle: string
  milestones: MilestoneItem[]
}

export const EMPTY_TASK_COMPLETE: TaskCompleteData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  milestones: [],
}

export function fetchTaskCompleteData(): Promise<TaskCompleteData> {
  return fetchTaskView<TaskCompleteData>('complete')
}
