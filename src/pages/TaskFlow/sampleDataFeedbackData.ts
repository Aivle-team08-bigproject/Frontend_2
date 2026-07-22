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

const mockData: SampleDataFeedbackData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  sampleRows: Array.from({ length: 5 }, () => ({
    district: '강남구',
    neighborhood: '역삼동',
    category: '한식',
    ageGroup: '30대',
    paymentMonth: '2024-10',
    salesIndex: '142.5',
  })),
  columnInfo: [
    {
      title: '지역(구) / 지역(동)',
      description:
        '서울시 행정구역 기준으로 구(區)와 동(洞) 단위를 사용합니다. 상권 분석의 최소 공간 단위로, 소비 패턴의 지역별 차이를 파악하기 위해 선정했습니다.',
    },
    {
      title: '업종',
      description:
        '소상공인시장진흥공단의 업종 분류 체계(대분류)를 기준으로 합니다. 한식, 카페, 편의점 등 소비자 접점이 높은 업종을 중심으로 분류하여, 업종별 매출 트렌드를 비교할 수 있도록 했습니다.',
    },
    {
      title: '연령대',
      description:
        '결제 데이터의 카드 소지자 연령 정보를 10세 단위로 그룹화(20대, 30대, 40대 등)하여 산출합니다. 세대별 소비 성향 차이를 분석하기 위한 핵심 세그먼트입니다.',
    },
    {
      title: '결제월',
      description:
        '카드 결제 승인 일자를 월(YYYY-MM) 단위로 집계한 값입니다. 월별 매출 추이와 계절적 변동을 관찰하기 위해 월 단위를 기본 시간 축으로 설정했습니다.',
    },
    {
      title: '매출지수',
      description:
        '해당 지역·업종·연령대·월 조합의 실제 매출액을 전체 평균 대비 상대값으로 변환한 지표입니다(평균 = 100). 절대 금액 대신 지수를 사용하여 업종 간 규모 차이를 표준화하고, 상대적 매출 강도를 직관적으로 비교할 수 있습니다.',
    },
  ],
  feedbackPlaceholder: '특이치(Outlier) 제거 로직을 강화해주세요.',
}

export function fetchSampleDataFeedbackData(): Promise<SampleDataFeedbackData> {
  return Promise.resolve(mockData)
}
