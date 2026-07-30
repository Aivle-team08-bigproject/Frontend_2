export type RequirementRegisterData = {
  reqId: string
  requestTitle: string
  placeholder: string
}

const requirementRegisterData: RequirementRegisterData = {
  reqId: '새 작업',
  requestTitle: '데이터 활용 요청 등록',
  placeholder: '예: 강남구 외식업 소비 트렌드를 2024년 1~6월 기간으로 분석하고 싶습니다.',
}

export function fetchRequirementRegisterData(): Promise<RequirementRegisterData> {
  return Promise.resolve(requirementRegisterData)
}
