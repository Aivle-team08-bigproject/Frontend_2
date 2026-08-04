import { fetchDeveloperDashboard } from '../../shared/api'

export type DashboardPeriod = 'daily' | 'weekly' | 'monthly'

export type TokenUsageSummary = {
  monthTokens: number
  todayTokens: number
  estimatedCostUsd: number
  estimatedCostKrw: number
}

export type TokenUsagePoint = {
  label: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  costUsd: number
}

export type AgentStatus = 'ok' | 'delayed' | 'error' | 'unknown'

export type AgentCard = {
  agentKey: string
  name: string
  status: AgentStatus
  lastResponseAt: string | null
  latencyMs: number | null
  todayThroughput: number
}

export type FailureBar = {
  agentKey: string
  label: string
  failedRuns: number
  totalRuns: number
  percent: number
}

export type ErrorLogRow = {
  occurredAt: string
  agent: string
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}

export type DeveloperDashboardData = {
  period: DashboardPeriod
  generatedAt: string
  summary: TokenUsageSummary
  tokenSeries: TokenUsagePoint[]
  agents: AgentCard[]
  failureRates: FailureBar[]
  errorLogs: ErrorLogRow[]
}

export function emptyDeveloperDashboard(period: DashboardPeriod): DeveloperDashboardData {
  return {
    period,
    generatedAt: new Date().toISOString(),
    summary: { monthTokens: 0, todayTokens: 0, estimatedCostUsd: 0, estimatedCostKrw: 0 },
    tokenSeries: [],
    agents: [],
    failureRates: [],
    errorLogs: [],
  }
}

export function fetchDeveloperDashboardData(period: DashboardPeriod): Promise<DeveloperDashboardData> {
  return fetchDeveloperDashboard<DeveloperDashboardData>(period)
}
