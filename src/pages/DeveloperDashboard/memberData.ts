import { fetchDashboardMembers } from '../../shared/api'

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

type MemberManagementApiResponse = {
  total_count: number
  active_count: number
  inactive_count: number
  members: Array<{
    name: string
    user_id: string
    role: string
    role_bg: string
    role_color: string
    part: string
    last_login_at: string
    status: MemberStatus
  }>
}

export async function fetchMemberManagementData(): Promise<MemberManagementData> {
  const data = await fetchDashboardMembers<MemberManagementApiResponse>()
  return {
    totalCount: data.total_count,
    activeCount: data.active_count,
    inactiveCount: data.inactive_count,
    members: data.members.map((member) => ({
      name: member.name,
      userId: member.user_id,
      role: member.role,
      roleBg: member.role_bg,
      roleColor: member.role_color,
      part: member.part,
      lastLoginAt: member.last_login_at,
      status: member.status,
    })),
  }
}
