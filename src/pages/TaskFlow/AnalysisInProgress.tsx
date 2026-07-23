import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { useAsyncData } from '../../shared/hooks'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { fetchAnalysisInProgressData } from './analysisInProgressData'

export default function AnalysisInProgress() {
  const { data } = useAsyncData(fetchAnalysisInProgressData)
  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 요구사항 분석 진행" badgeLabel="분석 진행" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={1} />
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="요구사항 분석 프로세스"
              statusLabel="✅ 완료"
              statusBg="#dcfce7"
              statusColor="#22c55e"
              items={data.timelineItems}
            />
          </LeftPanel>
          <LiveLogPanel lines={data.logLines} />
        </SplitGrid>
      </FlowContentArea>
    </PageWrapper>
  )
}
