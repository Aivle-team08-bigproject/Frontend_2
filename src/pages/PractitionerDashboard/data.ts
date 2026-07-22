export type StatCard = {
  label: string
  value: number
  unit: string
  caption: string
  highlight?: boolean
}

export type WarningCard = {
  title: string
  countLabel: string
  countBg: string
  countColor: string
  description: string
  footNote: string
}

export type RankedItem = {
  rank: number
  title: string
  subtitle: string
  tag: string
  tagBg: string
  tagColor: string
}

export type SupplementItem = {
  title: string
  note: string
  noteColor: string
  tag: string
  tagBg: string
  tagColor: string
}

export type TaskStatus = '요구사항 분석' | '진행중' | '가공중' | '완료'

export const taskStatusColors: Record<TaskStatus, { bg: string; color: string }> = {
  '요구사항 분석': { bg: '#e6f0ff', color: '#0066ff' },
  진행중: { bg: '#fef3c7', color: '#d97706' },
  가공중: { bg: '#ffedd5', color: '#ea580c' },
  완료: { bg: '#dcfce7', color: '#22c55e' },
}

export type TaskRow = {
  reqId: string
  client: string
  dataType: string
  detail: string
  assignee: string
  createdAt: string
  updatedAt: string
  status: TaskStatus
}

export type PractitionerDashboardData = {
  statCards: StatCard[]
  alertBannerCount: number
  warningCards: WarningCard[]
  preferredItems: RankedItem[]
  supplementItems: SupplementItem[]
  taskRows: TaskRow[]
  pageSize: number
}

const mockData: PractitionerDashboardData = {
  statCards: [
    { label: '전체 활성 작업', value: 24, unit: '건', caption: '대기 5 / 진행 13 / 완료 6', highlight: true },
    { label: '요구사항 분석 단계', value: 5, unit: '건', caption: '평균 소요 1.2일' },
    { label: '데이터 선별 단계', value: 3, unit: '건', caption: '평균 소요 2.4일' },
    { label: '데이터 가공 단계', value: 10, unit: '건', caption: '평균 소요 3.5일' },
  ],
  alertBannerCount: 6,
  warningCards: [
    {
      title: '요구사항 가이드 미확정',
      countLabel: '2건',
      countBg: '#fde8e8',
      countColor: '#dc2626',
      description: 'ABC마케팅 가이드 미달성 오류 피드백 지연',
      footNote: '대기 3일 경과',
    },
    {
      title: '데이터 포맷 불일치 오류',
      countLabel: '1건',
      countBg: '#fef3c7',
      countColor: '#d97706',
      description: '스타벅스 코리아 위치 데이터 위경도 누락건',
      footNote: '조치 필요',
    },
    {
      title: '가공 품질 신뢰도 임계치 미달',
      countLabel: '3건',
      countBg: '#fef3c7',
      countColor: '#d97706',
      description: '넷마블 게임데이터 머징 결측치 발생률 12% 초과',
      footNote: '재작업 권장',
    },
  ],
  preferredItems: [
    { rank: 1, title: '2030대 소비 구매 인덱스', subtitle: '카드 결제', tag: '인기', tagBg: '#dcfce7', tagColor: '#22c55e' },
    { rank: 2, title: '전국 스타벅스 상권 유동인구', subtitle: '위치정보', tag: '상승', tagBg: '#e6f0ff', tagColor: '#0066ff' },
    { rank: 3, title: '모바일 게임 주간 리텐션 통계', subtitle: '가공데이터', tag: '인기', tagBg: '#dcfce7', tagColor: '#22c55e' },
    { rank: 4, title: '수도권 아파트 대출 신용 평가 데이터', subtitle: '금융 통계', tag: '유지', tagBg: '#e6f0ff', tagColor: '#0066ff' },
  ],
  supplementItems: [
    {
      title: '골프장 법인카드 정밀 소비 데이터',
      note: '상세 분석 가이드 부재',
      noteColor: '#d97706',
      tag: '가이드 보완 필요',
      tagBg: '#fde8e8',
      tagColor: '#dc2626',
    },
    {
      title: '전국 공항 항공편 지연 시간 예측 세트',
      note: '최신성 결여 (2024년 6월 이후 중단)',
      noteColor: '#d97706',
      tag: '업데이트 필요',
      tagBg: '#fde8e8',
      tagColor: '#dc2626',
    },
    {
      title: '온라인 유통 장바구니 카테고리 매핑',
      note: '소분류 정확도 저하 (임계치 85% 미만)',
      noteColor: '#d97706',
      tag: '품질 보완 필요',
      tagBg: '#fde8e8',
      tagColor: '#dc2626',
    },
  ],
  pageSize: 4,
  taskRows: [
    { reqId: 'REQ-2024-0847', client: '(주)ABC마케팅', dataType: '소비 트렌드 분석', detail: '가공 완료 - 배포 대기', assignee: '홍길동 책임', createdAt: '2024.11.12', updatedAt: '2024.11.12', status: '요구사항 분석' },
    { reqId: 'REQ-2024-0846', client: '하나은행 미래금융팀', dataType: '부동산 신용 대출 흐름', detail: '데이터 이관 검토 중', assignee: '김민수 선임', createdAt: '2024.11.11', updatedAt: '2024.11.12', status: '진행중' },
    { reqId: 'REQ-2024-0845', client: '스타벅스 코리아', dataType: '상권 활성화 점수 산출', detail: 'GIS 지오코딩 작업 완료', assignee: '이지은 선임', createdAt: '2024.11.10', updatedAt: '2024.11.11', status: '가공중' },
    { reqId: 'REQ-2024-0844', client: 'SK텔레콤 AI혁신본부', dataType: '유동인구 기반 매출 분석', detail: '고객사 최종 승인 대기', assignee: '박준영 책임', createdAt: '2024.11.08', updatedAt: '2024.11.10', status: '완료' },
    { reqId: 'REQ-2024-0843', client: '올리브영 신상품파트', dataType: '화장품 구매 선호도 조사', detail: '요구사항 정의서 작성 중', assignee: '홍길동 책임', createdAt: '2024.11.08', updatedAt: '2024.11.08', status: '요구사항 분석' },
    { reqId: 'REQ-2024-0842', client: '넷마블 신작기획팀', dataType: '모바일 게임 리텐션 분석', detail: '데이터셋 매칭 진행 중', assignee: '김민수 선임', createdAt: '2024.11.07', updatedAt: '2024.11.08', status: '진행중' },
    { reqId: 'REQ-2024-0841', client: '대한항공 종합전략부', dataType: '항공편 수요 예측 통계', detail: '집계/가공 단계 진행', assignee: '이지은 선임', createdAt: '2024.11.05', updatedAt: '2024.11.07', status: '가공중' },
    { reqId: 'REQ-2024-0840', client: '네이버 쇼핑전략팀', dataType: '온라인 소비 장바구니 매핑', detail: '최종 산출물 배포 완료', assignee: '박준영 책임', createdAt: '2024.11.04', updatedAt: '2024.11.05', status: '완료' },
    { reqId: 'REQ-2024-0839', client: '현대카드 마케팅팀', dataType: '신용카드 소비패턴 분석', detail: '요건 파싱 대기', assignee: '홍길동 책임', createdAt: '2024.11.03', updatedAt: '2024.11.04', status: '요구사항 분석' },
    { reqId: 'REQ-2024-0838', client: '쿠팡 물류기획부', dataType: '물류센터 배송동선 최적화', detail: '실현가능성 검증 중', assignee: '김민수 선임', createdAt: '2024.11.02', updatedAt: '2024.11.03', status: '진행중' },
    { reqId: 'REQ-2024-0837', client: 'CJ제일제당 브랜드전략팀', dataType: '식품 구매 트렌드 분석', detail: '데이터 정제 진행 중', assignee: '이지은 선임', createdAt: '2024.11.01', updatedAt: '2024.11.01', status: '가공중' },
    { reqId: 'REQ-2024-0836', client: '롯데마트 상품기획팀', dataType: '유통채널별 매출 비교', detail: 'QA 검증 완료', assignee: '박준영 책임', createdAt: '2024.10.31', updatedAt: '2024.11.02', status: '완료' },
  ],
}

export function fetchPractitionerDashboardData(): Promise<PractitionerDashboardData> {
  return Promise.resolve(mockData)
}
