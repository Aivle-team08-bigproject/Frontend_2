import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'
import { fetchTaskView } from '../../shared/api'

export type DataProcessingInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

export const EMPTY_DATA_PROCESSING_IN_PROGRESS: DataProcessingInProgressData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  timelineItems: [],
  logLines: [],
}

export function fetchDataProcessingInProgressData(): Promise<DataProcessingInProgressData> {
  return fetchTaskView<DataProcessingInProgressData>('processing')
}
