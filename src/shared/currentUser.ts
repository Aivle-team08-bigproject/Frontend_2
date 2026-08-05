import { fetchCurrentEmployee, type EmployeePermissionCode } from './api'

export type CurrentUser = {
  name: string
  role: string
  employeeCode: string
  permissions: EmployeePermissionCode[]
}

export const EMPTY_CURRENT_USER: CurrentUser = {
  name: '사용자 정보 없음',
  role: '-',
  employeeCode: '',
  permissions: [],
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const employee = await fetchCurrentEmployee()
  return {
    name: employee.name,
    role: employee.department_name ?? '소속 미지정',
    employeeCode: employee.employee_code,
    permissions: employee.permissions,
  }
}
