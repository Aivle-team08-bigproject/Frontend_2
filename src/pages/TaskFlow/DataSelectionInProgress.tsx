import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { useAsyncData } from '../../shared/hooks'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { fetchDataSelectionInProgressData } from './dataSelectionInProgressData'

export default function DataSelectionInProgress() {
  const { data } = useAsyncData(fetchDataSelectionInProgressData)
  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 데이터 선별 진행" badgeLabel="데이터 선별" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={2} />
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="데이터 선별 프로세스"
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
