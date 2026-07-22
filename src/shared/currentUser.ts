import { fetchCurrentEmployee } from './api'

export type CurrentUser = {
  name: string
  role: string
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const employee = await fetchCurrentEmployee()
  return { name: employee.name, role: employee.department }
}
