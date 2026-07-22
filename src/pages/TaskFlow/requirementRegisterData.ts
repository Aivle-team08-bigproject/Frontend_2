export type RequirementRegisterData = {
  reqId: string
  requestTitle: string
  placeholder: string
}

const mockData: RequirementRegisterData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  placeholder:
    '예: 강남구 외식업 소비 트렌드를 2024년 1~6월 기간으로 분석하고 싶습니다. 30대 여성 고객의 결제 패턴과 업종별 매출 추이를 CSV 형식으로 제공해주세요.',
}

export function fetchRequirementRegisterData(): Promise<RequirementRegisterData> {
  return Promise.resolve(mockData)
}
