import { fetchTaskView } from '../../shared/api'

export type SampleRow = {
  district: string
  neighborhood: string
  category: string
  ageGroup: string
  paymentMonth: string
  salesIndex: string
}

export type ColumnInfo = {
  title: string
  description: string
}

export type SampleDataFeedbackData = {
  reqId: string
  requestTitle: string
  sampleRows: SampleRow[]
  columnInfo: ColumnInfo[]
  feedbackPlaceholder: string
}

export const EMPTY_SAMPLE_DATA_FEEDBACK: SampleDataFeedbackData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  sampleRows: [],
  columnInfo: [],
  feedbackPlaceholder: '',
}

export function fetchSampleDataFeedbackData(): Promise<SampleDataFeedbackData> {
  return fetchTaskView<SampleDataFeedbackData>('sample-feedback')
}
