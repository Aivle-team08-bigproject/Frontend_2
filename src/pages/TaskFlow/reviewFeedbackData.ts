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

const mockData: ReviewFeedbackData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  usagePurpose: '강남구 외식업 소비 트렌드 분석',
  dataDescription: '2024년 1~6월 강남구 외식업 매장별 결제 데이터 및 소비 패턴',
  columns: [
    { name: 'store_id', type: 'VARCHAR', description: '매장 고유 ID' },
    { name: 'transaction_date', type: 'DATETIME', description: '결제 일시' },
    { name: 'amount', type: 'INTEGER', description: '결제 금액' },
    { name: 'category', type: 'VARCHAR', description: '업종 분류' },
    { name: 'gender', type: 'VARCHAR', description: '성별' },
    { name: 'age_group', type: 'VARCHAR', description: '연령대' },
    { name: 'payment_type', type: 'VARCHAR', description: '결제 수단' },
  ],
  estimatedCount: '약 254,320건',
  deliveryMedium: 'API',
  outputFormat: 'CSV',
  feedbackPlaceholder: '수정이 필요한 사항을 자유롭게 입력해주세요. 예: 연령대 컬럼을 10대 단위로 세분화해주세요.',
}

export function fetchReviewFeedbackData(): Promise<ReviewFeedbackData> {
  return Promise.resolve(mockData)
}
