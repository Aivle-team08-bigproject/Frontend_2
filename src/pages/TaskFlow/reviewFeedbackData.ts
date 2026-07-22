import { fetchTaskView } from '../../shared/api'

export type DataColumn = {
  name: string
  type: string
  description: string
}

export type ReviewFeedbackData = {
  reqId: string
  requestTitle: string
  usagePurpose: string
  dataDescription: string
  columns: DataColumn[]
  estimatedCount: string
  deliveryMedium: string
  outputFormat: string
  feedbackPlaceholder: string
}

export function fetchReviewFeedbackData(): Promise<ReviewFeedbackData> {
  return fetchTaskView<ReviewFeedbackData>('review')
}
