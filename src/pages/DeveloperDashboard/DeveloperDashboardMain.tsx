import { useCallback, useMemo, useState } from 'react'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { statusDotGreenSrc, statusDotOrangeSrc, statusDotRedSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { formatTime } from '../../shared/datetime'
import { MainContent, PageWrapper } from '../../shared/layout.styles'
import type { AgentStatus, DashboardPeriod, TokenUsagePoint } from './dashboardData'
import { emptyDeveloperDashboard, fetchDeveloperDashboardData } from './dashboardData'
import {
  AgentCardEl,
  AgentCardsRow,
  AgentName,
  AgentSection,
  BarChart,
  BarFill,
  BarLabel,
  BarLabels,
  BarPercent,
  BarRow,
  BarTrack,
  CardHeaderMeta,
  CardHeaderRow,
  CardHeaderTitle,
  CardMeta,
  CardTop,
  ChartCanvas,
  ChartContainer,
  ChartEmpty,
  ChartLegend,
  ChartLegendDot,
  ChartSvg,
  ContentRow,
  FailureChartCard,
  FailureSection,
  LogAgentCell,
  LogCell,
  LogEmpty,
  LogRow,
  LogTableBody,
  LogTableContainer,
  LogTableHeader,
  MetaLabel,
  MetaRow,
  MetaValue,
  PeriodButton,
  PeriodSelector,
  RecentFailuresCard,
  SectionHeaderRow,
  SectionTitle,
  SeverityBadge,
  SeverityCell,
  StatusBadge,
  StatusDot,
  StatusLabel,
  SummaryCardEl,
  SummaryGrid,
  SummaryLabel,
  SummaryUnit,
  SummaryValue,
  SummaryValueGroup,
  Tag,
  TokenSection,
  TitleGroup,
  UpdatedAt,
  XAxisLabels,
} from './DeveloperDashboardMain.styles'

const statusMeta: Record<AgentStatus, { src: string; bg: string; color: string; label: string }> = {
  ok: { src: statusDotGreenSrc, bg: '#dcfce7', color: '#15803d', label: '정상 작동' },
  delayed: { src: statusDotOrangeSrc, bg: '#fef3c7', color: '#d97706', label: '응답 지연' },
  error: { src: statusDotRedSrc, bg: '#fde8e8', color: '#dc2626', label: '프로세스 오류' },
  unknown: { src: statusDotOrangeSrc, bg: '#f3f4f6', color: '#6b7280', label: '데이터 없음' },
}

const failureColors: Record<string, string> = {
  'requirement-analysis-agent': '#0f5a52',
  'data-selection-agent': '#ea580c',
  'data-processing-agent': '#dc2626',
  'delivery-pipeline': '#6b7280',
}

const severityMeta = {
  HIGH: { bg: '#fde8e8', color: '#dc2626' },
  MEDIUM: { bg: '#fef3c7', color: '#ea580c' },
  LOW: { bg: '#f8f9fa', color: '#6b7280' },
} as const

const periodOptions: Array<{ label: string; value: DashboardPeriod }> = [
  { label: '일별', value: 'daily' },
  { label: '주별', value: 'weekly' },
  { label: '월별', value: 'monthly' },
]

const integerFormatter = new Intl.NumberFormat('ko-KR')
const usdFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function formatLatency(status: AgentStatus, latencyMs: number | null): string {
  if (status === 'error' && latencyMs === null) return 'ERR (무응답)'
  if (latencyMs === null) return '-'
  if (latencyMs >= 1000) return `${(latencyMs / 1000).toFixed(1)}s (지연)`
  return `${integerFormatter.format(latencyMs)}ms (양호)`
}

function sampledLabels(points: TokenUsagePoint[]): string[] {
  if (points.length <= 7) return points.map((point) => point.label)
  const step = Math.ceil((points.length - 1) / 6)
  return points
    .filter((_, index) => index === 0 || index === points.length - 1 || index % step === 0)
    .map((point) => point.label)
}

function TokenUsageChart({ points }: { points: TokenUsagePoint[] }) {
  if (points.length === 0) {
    return <ChartEmpty>선택한 기간의 토큰 사용 데이터가 없습니다.</ChartEmpty>
  }

  const width = 720
  const height = 220
  const chartBottom = 190
  const maxTokens = Math.max(...points.map((point) => point.totalTokens), 1)
  const coordinates = points.map((point, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
    const y = chartBottom - (point.totalTokens / maxTokens) * 150
    return { x, y }
  })
  const linePoints = coordinates.map(({ x, y }) => `${x},${y}`).join(' ')
  const areaPoints = `0,${chartBottom} ${linePoints} ${width},${chartBottom}`

  return (
    <>
      <ChartCanvas>
        <ChartSvg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="기간별 토큰 사용량 추이">
          {[40, 90, 140, 190].map((y) => (
            <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#e5e7eb" strokeWidth="1" />
          ))}
          <polygon points={areaPoints} fill="rgba(15, 90, 82, 0.10)" />
          <polyline points={linePoints} fill="none" stroke="#0f5a52" strokeWidth="4" strokeLinejoin="round" />
          {coordinates.map(({ x, y }, index) => (
            <circle key={`${points[index].label}-${index}`} cx={x} cy={y} r="5" fill="#ffffff" stroke="#0f5a52" strokeWidth="3">
              <title>{`${points[index].label}: ${integerFormatter.format(points[index].totalTokens)} tokens`}</title>
            </circle>
          ))}
        </ChartSvg>
      </ChartCanvas>
      <XAxisLabels>
        {sampledLabels(points).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </XAxisLabels>
      <ChartLegend>
        <ChartLegendDot />
        DB에 기록된 입력·출력 토큰 합계
      </ChartLegend>
    </>
  )
}

export default function DeveloperDashboardMain() {
  const [period, setPeriod] = useState<DashboardPeriod>('daily')
  const fetcher = useCallback(() => fetchDeveloperDashboardData(period), [period])
  const { data, loading, error } = useAsyncData(fetcher, { intervalMs: 30_000 })
  const view = useMemo(() => data ?? emptyDeveloperDashboard(period), [data, period])

  const navigation = (
    <>
      <GNB />
      <SubNav
        activeTo="/dev-dashboard"
        items={[
          { label: '대시보드', to: '/dev-dashboard' },
          { label: '회원 관리', to: '/dev-dashboard/members' },
        ]}
      />
    </>
  )

  const summaryCards = [
    { label: '금월 누적 토큰 사용량', value: integerFormatter.format(view.summary.monthTokens), unit: 'tokens' },
    { label: '금일 토큰 사용량', value: integerFormatter.format(view.summary.todayTokens), unit: 'tokens', highlight: true },
    {
      label: '예상 비용 (USD)',
      value: `$${usdFormatter.format(view.summary.estimatedCostUsd)}`,
      unit: `≈ ${integerFormatter.format(view.summary.estimatedCostKrw)} 원`,
    },
  ]

  return (
    <PageWrapper>
      {navigation}
      <MainContent>
        <DataStateNotice loading={loading && !data} error={error} subject="개발자 대시보드 데이터" />
        <TokenSection>
          <SectionHeaderRow>
            <TitleGroup>
              <SectionTitle>LLM Token Usage (토큰 사용량 모니터링)</SectionTitle>
              <Tag>30초 자동 갱신</Tag>
              <UpdatedAt>기준 {formatTime(view.generatedAt)}</UpdatedAt>
            </TitleGroup>
            <PeriodSelector>
              {periodOptions.map((option) => (
                <PeriodButton
                  key={option.value}
                  type="button"
                  $active={option.value === period}
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </PeriodButton>
              ))}
            </PeriodSelector>
          </SectionHeaderRow>
          <ContentRow>
            <SummaryGrid>
              {summaryCards.map((card) => (
                <SummaryCardEl key={card.label}>
                  <SummaryLabel>{card.label}</SummaryLabel>
                  <SummaryValueGroup>
                    <SummaryValue $highlight={card.highlight}>{card.value}</SummaryValue>
                    <SummaryUnit>{card.unit}</SummaryUnit>
                  </SummaryValueGroup>
                </SummaryCardEl>
              ))}
            </SummaryGrid>
            <ChartContainer>
              <TokenUsageChart points={view.tokenSeries} />
            </ChartContainer>
          </ContentRow>
        </TokenSection>

        <AgentSection>
          <SectionTitle>AI Agent Pipeline Status (에이전트 최근 실행 상태)</SectionTitle>
          <AgentCardsRow>
            {view.agents.map((agent) => {
              const meta = statusMeta[agent.status]
              return (
                <AgentCardEl key={agent.agentKey}>
                  <CardTop>
                    <AgentName>{agent.name}</AgentName>
                    <StatusBadge $bg={meta.bg}>
                      <StatusDot src={meta.src} alt="" />
                      <StatusLabel $color={meta.color}>{meta.label}</StatusLabel>
                    </StatusBadge>
                  </CardTop>
                  <CardMeta>
                    <MetaRow>
                      <MetaLabel>최근 응답 시간</MetaLabel>
                      <MetaValue $color={meta.color}>{formatLatency(agent.status, agent.latencyMs)}</MetaValue>
                    </MetaRow>
                    <MetaRow>
                      <MetaLabel>금일 처리량</MetaLabel>
                      <MetaValue>{integerFormatter.format(agent.todayThroughput)}건</MetaValue>
                    </MetaRow>
                  </CardMeta>
                </AgentCardEl>
              )
            })}
          </AgentCardsRow>
        </AgentSection>

        <FailureSection>
          <FailureChartCard>
            <CardHeaderRow>
              <CardHeaderTitle>에이전트별 오류 발생 비율</CardHeaderTitle>
              <CardHeaderMeta>최근 24시간</CardHeaderMeta>
            </CardHeaderRow>
            <BarChart>
              {view.failureRates.map((bar) => {
                const color = failureColors[bar.agentKey] ?? '#6b7280'
                return (
                  <BarRow key={bar.agentKey}>
                    <BarLabels>
                      <BarLabel>{bar.label}</BarLabel>
                      <BarPercent $color={color}>
                        {bar.percent.toFixed(1)}% ({bar.failedRuns}/{bar.totalRuns})
                      </BarPercent>
                    </BarLabels>
                    <BarTrack>
                      <BarFill $percent={bar.percent} $color={color} />
                    </BarTrack>
                  </BarRow>
                )
              })}
            </BarChart>
          </FailureChartCard>

          <RecentFailuresCard>
            <CardHeaderTitle>최근 시스템 오류 로그</CardHeaderTitle>
            <LogTableContainer>
              <LogTableHeader>
                <LogCell $width={140}>시간</LogCell>
                <LogCell $width={180}>대상 에이전트</LogCell>
                <LogCell $flex>오류 유형 및 메시지</LogCell>
                <LogCell $width={100}>심각도</LogCell>
              </LogTableHeader>
              <LogTableBody>
                {view.errorLogs.length === 0 ? (
                  <LogEmpty>최근 24시간 동안 기록된 오류가 없습니다.</LogEmpty>
                ) : (
                  view.errorLogs.map((log) => {
                    const severity = severityMeta[log.severity]
                    return (
                      <LogRow key={`${log.occurredAt}-${log.agent}`}>
                        <LogCell $width={140}>{formatTime(log.occurredAt)}</LogCell>
                        <LogAgentCell $width={180}>{log.agent}</LogAgentCell>
                        <LogCell $flex>{log.message}</LogCell>
                        <SeverityCell $width={100}>
                          <SeverityBadge $bg={severity.bg} $color={severity.color}>
                            {log.severity}
                          </SeverityBadge>
                        </SeverityCell>
                      </LogRow>
                    )
                  })
                )}
              </LogTableBody>
            </LogTableContainer>
          </RecentFailuresCard>
        </FailureSection>
      </MainContent>
    </PageWrapper>
  )
}
