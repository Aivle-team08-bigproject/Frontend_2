import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'
import { fetchTaskView } from '../../shared/api'

export type DataSelectionInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

export function fetchDataSelectionInProgressData(): Promise<DataSelectionInProgressData> {
  return fetchTaskView<DataSelectionInProgressData>('selection')
}
