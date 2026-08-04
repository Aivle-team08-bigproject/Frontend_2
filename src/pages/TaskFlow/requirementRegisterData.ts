export type RequirementRegisterData = {
  reqId: string
  requestTitle: string
  placeholder: string
}

// 신규 등록 화면은 아직 생성되지 않은 요청을 다루므로 조회할 requestNo가 없다.
// 화면 문구는 백엔드 task view가 아니라 고정 상수로 유지한다.
export const REQUIREMENT_REGISTER_FORM: RequirementRegisterData = {
  reqId: '신규 요청',
  requestTitle: '데이터 가공 요구사항 등록',
  placeholder:
    '예: 강남구 외식업 소비 트렌드를 2024년 1~6월 기간으로 분석하고 싶습니다. 30대 여성 고객의 결제 패턴과 업종별 매출 추이를 CSV 형식으로 제공해주세요.',
}
