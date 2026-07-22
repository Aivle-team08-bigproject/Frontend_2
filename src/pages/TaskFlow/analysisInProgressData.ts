import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'
import { fetchTaskView } from '../../shared/api'

export type AnalysisInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

export function fetchAnalysisInProgressData(): Promise<AnalysisInProgressData> {
  return fetchTaskView<AnalysisInProgressData>('analysis')
}
