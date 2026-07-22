export type MemberStatus = '활성' | '비활성'

export type Member = {
  name: string
  userId: string
  role: string
  roleBg: string
  roleColor: string
  part: string
  lastLoginAt: string
  status: MemberStatus
}

export type MemberManagementData = {
  totalCount: number
  activeCount: number
  inactiveCount: number
  members: Member[]
}

const mockData: MemberManagementData = {
  totalCount: 8,
  activeCount: 7,
  inactiveCount: 1,
  members: [
    { name: '홍길동', userId: 'kdhong_manager', role: '관리자', roleBg: '#e6f3f3', roleColor: '#0f5a52', part: '시스템 관리 파트', lastLoginAt: '2024.11.12 14:10', status: '활성' },
    { name: '김민수', userId: 'mskim_senior', role: '책임자', roleBg: '#e6f0ff', roleColor: '#0066ff', part: '데이터 가공 파트', lastLoginAt: '2024.11.12 13:50', status: '활성' },
    { name: '이지은', userId: 'jelee_operator', role: '선임', roleBg: '#f3e8ff', roleColor: '#8b5cf6', part: '요구사항 분석 파트', lastLoginAt: '2024.11.12 11:22', status: '활성' },
    { name: '박준영', userId: 'jypark_member', role: '일반', roleBg: '#f8f9fa', roleColor: '#6b7280', part: '데이터 선별 파트', lastLoginAt: '2024.11.11 18:02', status: '활성' },
    { name: '최수민', userId: 'smchoi_temp', role: '일반', roleBg: '#f8f9fa', roleColor: '#6b7280', part: '외부 협력 파트', lastLoginAt: '2024.11.02 09:12', status: '비활성' },
  ],
}

export function fetchMemberManagementData(): Promise<MemberManagementData> {
  return Promise.resolve(mockData)
}
