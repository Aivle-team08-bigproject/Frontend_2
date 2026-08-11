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
  feedbackPlaceholder: string
}

export const EMPTY_REVIEW_FEEDBACK: ReviewFeedbackData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  usagePurpose: '-',
  dataDescription: '-',
  columns: [],
  feedbackPlaceholder: '',
}

export function fetchReviewFeedbackData(requestNo: string): Promise<ReviewFeedbackData> {
  return fetchTaskView<ReviewFeedbackData>('review', requestNo)
}
