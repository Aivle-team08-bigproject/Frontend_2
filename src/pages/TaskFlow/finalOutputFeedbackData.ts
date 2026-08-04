import { fetchTaskView } from '../../shared/api'

export type OutputRow = {
  district: string
  neighborhood: string
  category: string
  ageGroup: string
  paymentMonth: string
  salesIndex: string
}

export type ChartBar = {
  label: string
  height: number
  highlight: boolean
}

export type InfoRow = {
  label: string
  value: string
}

export type FinalOutputFeedbackData = {
  reqId: string
  requestTitle: string
  outputRows: OutputRow[]
  reportTitle: string
  reportMeta: string
  insightSummary: string[]
  chartBars: ChartBar[]
  infoRows: InfoRow[]
  feedbackPlaceholder: string
}

export const EMPTY_FINAL_OUTPUT_FEEDBACK: FinalOutputFeedbackData = {
  reqId: '-',
  requestTitle: '조회된 요청이 없습니다.',
  outputRows: [],
  reportTitle: '-',
  reportMeta: '-',
  insightSummary: [],
  chartBars: [],
  infoRows: [],
  feedbackPlaceholder: '',
}

export function fetchFinalOutputFeedbackData(): Promise<FinalOutputFeedbackData> {
  return fetchTaskView<FinalOutputFeedbackData>('final-feedback')
}
