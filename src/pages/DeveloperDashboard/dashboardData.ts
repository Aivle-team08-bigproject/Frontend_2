import { fetchDeveloperDashboard } from '../../shared/api'

export type SummaryCard = {
  label: string
  value: string
  unit: string
  highlight?: boolean
}

export type AgentStatus = 'ok' | 'delayed' | 'error'

export type AgentCard = {
  name: string
  status: AgentStatus
  statusLabel: string
  responseTimeLabel: string
  responseTimeColor: string
  throughputLabel: string
}

export type FailureBar = {
  label: string
  percentLabel: string
  percent: number
  color: string
}

export type ErrorLogRow = {
  time: string
  agent: string
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  severityBg: string
  severityColor: string
}

export type DeveloperDashboardData = {
  summaryCards: SummaryCard[]
  agentCards: AgentCard[]
  failureBars: FailureBar[]
  errorLogs: ErrorLogRow[]
}

export function fetchDeveloperDashboardData(): Promise<DeveloperDashboardData> {
  return fetchDeveloperDashboard<DeveloperDashboardData>()
}
