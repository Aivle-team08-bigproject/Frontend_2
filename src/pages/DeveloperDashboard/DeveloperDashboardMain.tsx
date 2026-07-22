import { useState } from 'react'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { statusDotGreenSrc, statusDotOrangeSrc, statusDotRedSrc, tokenUsageChartSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import { MainContent, PageWrapper } from '../../shared/layout.styles'
import type { AgentStatus } from './dashboardData'
import { fetchDeveloperDashboardData } from './dashboardData'
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
  ChartContainer,
  ChartImage,
  ContentRow,
  FailureChartCard,
  FailureSection,
  LogAgentCell,
  LogCell,
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
  TitleGroup,
  TokenSection,
  XAxisLabels,
} from './DeveloperDashboardMain.styles'

const statusDots: Record<AgentStatus, { src: string; bg: string }> = {
  ok: { src: statusDotGreenSrc, bg: '#dcfce7' },
  delayed: { src: statusDotOrangeSrc, bg: '#fef3c7' },
  error: { src: statusDotRedSrc, bg: '#fde8e8' },
}

const statusLabelColors: Record<AgentStatus, string> = {
  ok: '#15803d',
  delayed: '#d97706',
  error: '#dc2626',
}

const periods = ['일별', '주별', '월별'] as const

export default function DeveloperDashboardMain() {
  const { data } = useAsyncData(fetchDeveloperDashboardData)
  const [period, setPeriod] = useState<(typeof periods)[number]>('일별')

  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <SubNav
        activeTo="/dev-dashboard"
        items={[
          { label: '대시보드', to: '/dev-dashboard' },
          { label: '회원 관리', to: '/dev-dashboard/members' },
        ]}
      />
      <MainContent>
        <TokenSection>
          <SectionHeaderRow>
            <TitleGroup>
              <SectionTitle>LLM Token Usage (토큰 사용량 모니터링)</SectionTitle>
              <Tag>실시간 정산</Tag>
            </TitleGroup>
            <PeriodSelector>
              {periods.map((p) => (
                <PeriodButton key={p} type="button" $active={p === period} onClick={() => setPeriod(p)}>
                  {p}
                </PeriodButton>
              ))}
            </PeriodSelector>
          </SectionHeaderRow>
          <ContentRow>
            <SummaryGrid>
              {data.summaryCards.map((card) => (
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
              <ChartImage src={tokenUsageChartSrc} alt="토큰 사용량 추이 차트" />
              <XAxisLabels>
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>24:00</span>
              </XAxisLabels>
            </ChartContainer>
          </ContentRow>
        </TokenSection>

        <AgentSection>
          <SectionTitle>AI Agent Pipeline Status (에이전트 실시간 상태)</SectionTitle>
          <AgentCardsRow>
            {data.agentCards.map((agent) => (
              <AgentCardEl key={agent.name}>
                <CardTop>
                  <AgentName>{agent.name}</AgentName>
                  <StatusBadge $bg={statusDots[agent.status].bg}>
                    <StatusDot src={statusDots[agent.status].src} alt="" />
                    <StatusLabel $color={statusLabelColors[agent.status]}>{agent.statusLabel}</StatusLabel>
                  </StatusBadge>
                </CardTop>
                <CardMeta>
                  <MetaRow>
                    <MetaLabel>최종 응답 시간</MetaLabel>
                    <MetaValue $color={agent.responseTimeColor}>{agent.responseTimeLabel}</MetaValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel>금일 처리량</MetaLabel>
                    <MetaValue>{agent.throughputLabel}</MetaValue>
                  </MetaRow>
                </CardMeta>
              </AgentCardEl>
            ))}
          </AgentCardsRow>
        </AgentSection>

        <FailureSection>
          <FailureChartCard>
            <CardHeaderRow>
              <CardHeaderTitle>에이전트별 오류 발생 비율</CardHeaderTitle>
              <CardHeaderMeta>최근 24시간</CardHeaderMeta>
            </CardHeaderRow>
            <BarChart>
              {data.failureBars.map((bar) => (
                <BarRow key={bar.label}>
                  <BarLabels>
                    <BarLabel>{bar.label}</BarLabel>
                    <BarPercent $color={bar.color}>{bar.percentLabel}</BarPercent>
                  </BarLabels>
                  <BarTrack>
                    <BarFill $percent={bar.percent} $color={bar.color} />
                  </BarTrack>
                </BarRow>
              ))}
            </BarChart>
          </FailureChartCard>

          <RecentFailuresCard>
            <CardHeaderTitle>최근 시스템 오류 로그</CardHeaderTitle>
            <LogTableContainer>
              <LogTableHeader>
                <LogCell $width={140}>시간</LogCell>
                <LogCell $width={160}>대상 에이전트</LogCell>
                <LogCell $flex>오류 유형 및 메시지</LogCell>
                <LogCell $width={120}>심각도</LogCell>
              </LogTableHeader>
              <LogTableBody>
                {data.errorLogs.map((log) => (
                  <LogRow key={`${log.time}-${log.agent}`}>
                    <LogCell $width={140}>{log.time}</LogCell>
                    <LogAgentCell $width={160}>{log.agent}</LogAgentCell>
                    <LogCell $flex>{log.message}</LogCell>
                    <SeverityCell $width={120}>
                      <SeverityBadge $bg={log.severityBg} $color={log.severityColor}>
                        {log.severity}
                      </SeverityBadge>
                    </SeverityCell>
                  </LogRow>
                ))}
              </LogTableBody>
            </LogTableContainer>
          </RecentFailuresCard>
        </FailureSection>
      </MainContent>
    </PageWrapper>
  )
}
