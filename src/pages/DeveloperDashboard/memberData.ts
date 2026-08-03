import { fetchDashboardMembers, replaceEmployeeRole, updateEmployeeStatus, type EmployeeRole } from '../../shared/api'

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

export const ROLE_OPTIONS = [
  { label: '관리자', value: 'ADMIN' as EmployeeRole },
  { label: '책임자', value: 'MANAGER' as EmployeeRole },
  { label: '선임', value: 'SENIOR' as EmployeeRole },
  { label: '일반', value: 'GENERAL' as EmployeeRole },
]

export const ROLE_VALUE_BY_LABEL = Object.fromEntries(ROLE_OPTIONS.map((role) => [role.label, role.value])) as Record<string, EmployeeRole>

export function updateMemberRole(userId: string, role: string) {
  const roleValue = ROLE_VALUE_BY_LABEL[role]
  if (!roleValue) throw new Error('지원하지 않는 역할입니다.')
  return replaceEmployeeRole(userId, roleValue)
}

export function updateMemberActiveState(userId: string, active: boolean) {
  return updateEmployeeStatus(userId, active ? 'DISABLED' : 'ACTIVE')
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

export const EMPTY_MEMBER_MANAGEMENT: MemberManagementData = {
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,
  members: [],
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
