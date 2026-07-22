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

const mockData: FinalOutputFeedbackData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  outputRows: [
    { district: '강남구', neighborhood: '역삼동', category: '한식', ageGroup: '30대', paymentMonth: '2024-01', salesIndex: '142.5' },
    { district: '강남구', neighborhood: '신사동', category: '일식', ageGroup: '20대', paymentMonth: '2024-02', salesIndex: '156.8' },
    { district: '강남구', neighborhood: '청담동', category: '양식', ageGroup: '40대', paymentMonth: '2024-03', salesIndex: '128.4' },
    { district: '강남구', neighborhood: '논현동', category: '카페', ageGroup: '30대', paymentMonth: '2024-04', salesIndex: '165.2' },
    { district: '강남구', neighborhood: '삼성동', category: '중식', ageGroup: '20대', paymentMonth: '2024-05', salesIndex: '119.7' },
  ],
  reportTitle: '강남구 외식업 소비 트렌드 분석 보고서',
  reportMeta: 'Lumen AI Generated Report • 2024년 12월',
  insightSummary: [
    '1. 강남구 역삼동 및 신사동 지역의 한식 및 일식 소비 지수가 전월 대비 평균 12.4% 상승하였습니다.',
    '2. 특히 30대 연령층의 결제 비중이 38.5%로 가장 높았으며, 평일 퇴근 시간대(18시~21시) 배달 앱 매출 지수가 지속적으로 강세를 보입니다.',
  ],
  chartBars: [
    { label: '한식', height: 48, highlight: false },
    { label: '일식', height: 78, highlight: true },
    { label: '양식', height: 60, highlight: false },
    { label: '카페', height: 102, highlight: true },
    { label: '중식', height: 36, highlight: false },
  ],
  infoRows: [
    { label: '산출물 형식', value: 'CSV + 보고서' },
    { label: '데이터 건수', value: '254,320건' },
    { label: '전달 매체', value: 'API' },
    { label: '생성 일시', value: '2024-12-15 16:30' },
  ],
  feedbackPlaceholder: '산출물에 대한 수정 사항을 자유롭게 입력해주세요. 예: 매출지수 상위 20개 매장만 필터링해주세요.',
}

export function fetchFinalOutputFeedbackData(): Promise<FinalOutputFeedbackData> {
  return Promise.resolve(mockData)
}
