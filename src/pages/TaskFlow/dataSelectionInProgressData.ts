import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'
import { fetchTaskView } from '../../shared/api'

export type DataSelectionInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

export const EMPTY_DATA_SELECTION_IN_PROGRESS: DataSelectionInProgressData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  timelineItems: [],
  logLines: [],
}

export function fetchDataSelectionInProgressData(): Promise<DataSelectionInProgressData> {
  return fetchTaskView<DataSelectionInProgressData>('selection')
}
