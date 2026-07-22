import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { useAsyncData } from '../../shared/hooks'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { fetchDataProcessingInProgressData } from './dataProcessingInProgressData'

export default function DataProcessingInProgress() {
  const { data } = useAsyncData(fetchDataProcessingInProgressData)
  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 데이터 가공 진행" badgeLabel="데이터 가공" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={6} />
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="데이터 가공 프로세스"
              statusLabel="⏳ 진행중"
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
