import { fetchCurrentEmployee, type EmployeePermissionCode, type EmployeeRole } from './api'

export type CurrentUser = {
  name: string
  role: string
  roleCode: EmployeeRole | null
  employeeCode: string
  permissions: EmployeePermissionCode[]
}

export const EMPTY_CURRENT_USER: CurrentUser = {
  name: '사용자 정보 없음',
  role: '-',
  roleCode: null,
  employeeCode: '',
  permissions: [],
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const employee = await fetchCurrentEmployee()
  return {
    name: employee.name,
    role: employee.department_name ?? '소속 미지정',
    roleCode: employee.role,
    employeeCode: employee.employee_code,
    permissions: employee.permissions,
  }
}
