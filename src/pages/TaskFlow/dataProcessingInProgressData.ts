import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'
import { fetchTaskView } from '../../shared/api'

export type DataProcessingInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

export function fetchDataProcessingInProgressData(): Promise<DataProcessingInProgressData> {
  return fetchTaskView<DataProcessingInProgressData>('processing')
}
