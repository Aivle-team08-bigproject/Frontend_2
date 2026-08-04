import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import UnimplementedProgressModal from '../../shared/UnimplementedProgressModal'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'

export default function DataProcessingInProgress() {
  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 데이터 가공 진행" badgeLabel="데이터 가공" />
      <FlowContentArea><UnimplementedProgressModal stageLabel="데이터 가공" /></FlowContentArea>
    </PageWrapper>
  )
}
