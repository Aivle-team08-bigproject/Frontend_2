import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import UnimplementedProgressModal from '../../shared/UnimplementedProgressModal'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { useParams } from 'react-router-dom'

export default function DataProcessingInProgress() {
  const { requestNo, runId } = useParams()

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 데이터 가공 진행" badgeLabel="데이터 가공" />
      <FlowContentArea><UnimplementedProgressModal stageLabel="데이터 가공" requestNo={requestNo} runId={runId} /></FlowContentArea>
    <Footer />
    </PageWrapper>
  )
}
