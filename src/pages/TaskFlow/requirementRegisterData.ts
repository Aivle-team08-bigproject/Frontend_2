import { fetchTaskView } from '../../shared/api'

export type RequirementRegisterData = {
  reqId: string
  requestTitle: string
  placeholder: string
}

export function fetchRequirementRegisterData(): Promise<RequirementRegisterData> {
  return fetchTaskView<RequirementRegisterData>('register')
}
