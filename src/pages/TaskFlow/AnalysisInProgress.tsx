import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import UnimplementedProgressModal from '../../shared/UnimplementedProgressModal'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'

export default function AnalysisInProgress() {
  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 요구사항 분석 진행" badgeLabel="분석 진행" />
      <FlowContentArea><UnimplementedProgressModal stageLabel="요구사항 분석" /></FlowContentArea>
    </PageWrapper>
  )
}
