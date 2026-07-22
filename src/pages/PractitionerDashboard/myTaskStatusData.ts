export type TaskCardStatus = 'urgent' | 'normal'

export type MyTaskCard = {
  reqId: string
  client: string
  summary: string
  status: TaskCardStatus
  badges: { label: string; bg: string; color: string }[]
  progress: number
  progressLabel: string
  progressLabelColor: string
  registeredAt: string
  dueLabel: string
  dueColor: string
  actionLabel: string
}

export type MyTaskStatusData = {
  userName: string
  roleBadge: string
  activeCount: number
  urgentCount: number
  monthlyCompleted: number
  qualityScore: string
  cards: MyTaskCard[]
}

const mockData: MyTaskStatusData = {
  userName: '홍길동 책임님',
  roleBadge: 'Senior Operator',
  activeCount: 3,
  urgentCount: 1,
  monthlyCompleted: 14,
  qualityScore: '98.2%',
  cards: [
    {
      reqId: 'REQ-2024-0847',
      client: '(주)AI산업혁신원',
      summary: '의료 영상 분석 가공 데이터 세트',
      status: 'urgent',
      badges: [
        { label: '마감 임박', bg: '#fde8e8', color: '#dc2626' },
        { label: '요구사항 분석', bg: '#e6f0ff', color: '#0066ff' },
      ],
      progress: 15,
      progressLabel: '15% (요구사항 미확정)',
      progressLabelColor: '#dc2626',
      registeredAt: '등록일: 2024.11.12',
      dueLabel: '마감일: 오늘 18:00 (초과 시 패널티)',
      dueColor: '#dc2626',
      actionLabel: '바로 작업하기',
    },
    {
      reqId: 'REQ-2024-0845',
      client: '스타벅스 코리아',
      summary: '서울지역 핵심 상권 유동인구 모델 정보',
      status: 'normal',
      badges: [{ label: '가공중', bg: '#ffedd5', color: '#ea580c' }],
      progress: 65,
      progressLabel: '65% (가공 파일 배포중)',
      progressLabelColor: '#0f5a52',
      registeredAt: '등록일: 2024.11.10',
      dueLabel: '마감일: 2024.11.20 (4일 남음)',
      dueColor: '#495057',
      actionLabel: '상세 보기',
    },
  ],
}

export function fetchMyTaskStatusData(): Promise<MyTaskStatusData> {
  return Promise.resolve(mockData)
}
