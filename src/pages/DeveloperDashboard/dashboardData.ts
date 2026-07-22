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

const mockData: DeveloperDashboardData = {
  summaryCards: [
    { label: '금월 누적 토큰 사용량', value: '42,819,401', unit: 'tokens' },
    { label: '금일 토큰 사용량', value: '1,452,091', unit: 'tokens', highlight: true },
    { label: '예상 비용 (USD)', value: '$324.50', unit: '≈ 431,200 원' },
  ],
  agentCards: [
    {
      name: '요구사항 분석 에이전트',
      status: 'ok',
      statusLabel: '정상 작동',
      responseTimeLabel: '14ms (양호)',
      responseTimeColor: '#1a1a1b',
      throughputLabel: '124건',
    },
    {
      name: '데이터 선별 에이전트',
      status: 'delayed',
      statusLabel: '응답 지연',
      responseTimeLabel: '2.4s (지연)',
      responseTimeColor: '#ea580c',
      throughputLabel: '89건',
    },
    {
      name: '데이터 가공 에이전트',
      status: 'error',
      statusLabel: '프로세스 오류',
      responseTimeLabel: 'ERR (무응답)',
      responseTimeColor: '#dc2626',
      throughputLabel: '42건',
    },
  ],
  failureBars: [
    { label: '요구사항 분석', percentLabel: '3.4%', percent: 3.4, color: '#0f5a52' },
    { label: '데이터 선별', percentLabel: '12.8%', percent: 12.8, color: '#ea580c' },
    { label: '데이터 가공', percentLabel: '24.1%', percent: 24.1, color: '#dc2626' },
    { label: '배포 파이프라인', percentLabel: '1.2%', percent: 1.2, color: '#6b7280' },
  ],
  errorLogs: [
    {
      time: '14:24:01',
      agent: '데이터 가공 에이전트',
      message: 'ERR-500: 머징 결측치 비율 임계치 초과 (12.4%)',
      severity: 'HIGH',
      severityBg: '#fde8e8',
      severityColor: '#dc2626',
    },
    {
      time: '14:15:32',
      agent: '데이터 선별 에이전트',
      message: 'TIMEOUT: DICOM 헤더 가이드 확인 요청 타임아웃',
      severity: 'MEDIUM',
      severityBg: '#fef3c7',
      severityColor: '#ea580c',
    },
    {
      time: '13:02:11',
      agent: '배포 에이전트',
      message: 'JWT: 보안 토큰 갱신 지연 에러 발생',
      severity: 'LOW',
      severityBg: '#f8f9fa',
      severityColor: '#6b7280',
    },
  ],
}

export function fetchDeveloperDashboardData(): Promise<DeveloperDashboardData> {
  return Promise.resolve(mockData)
}
