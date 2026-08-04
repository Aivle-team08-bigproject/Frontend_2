import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { EMPTY_DATA_SELECTION_IN_PROGRESS, fetchDataSelectionInProgressData } from './dataSelectionInProgressData'

export default function DataSelectionInProgress() {
  const { data, loading, error } = useAsyncData(fetchDataSelectionInProgressData)
  const view = data ?? EMPTY_DATA_SELECTION_IN_PROGRESS

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 데이터 선별 진행" badgeLabel="데이터 선별" />
      <FlowContentArea>
        <DataStateNotice loading={loading} error={error} subject="데이터 선별 정보" />
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={2} />
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="데이터 선별 프로세스"
              statusLabel="⏳ 진행중"
              statusBg="#dcfce7"
              statusColor="#22c55e"
              items={view.timelineItems}
            />
          </LeftPanel>
          <LiveLogPanel lines={view.logLines} />
        </SplitGrid>
      </FlowContentArea>
    </PageWrapper>
  )
}
