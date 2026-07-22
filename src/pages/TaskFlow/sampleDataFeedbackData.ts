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

export function fetchSampleDataFeedbackData(): Promise<SampleDataFeedbackData> {
  return fetchTaskView<SampleDataFeedbackData>('sample-feedback')
}
