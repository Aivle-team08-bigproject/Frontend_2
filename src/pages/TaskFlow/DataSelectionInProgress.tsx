import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { DataNotice, FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import {
  SELECTION_STEPS,
  aggregateStepStatus,
  buildStepTimelineItems,
  stageScreenPath,
  stageStatusTone,
} from '../../shared/pipelineLabels'
import { usePipelineRunStream, type PipelineRunStreamState } from '../../shared/usePipelineRunStream'
import type { PipelineStreamItem } from '../../shared/pipelineEventStream'

function withPendingDefaults(items: PipelineStreamItem[]): PipelineStreamItem[] {
  if (items.length > 0) return items
  return SELECTION_STEPS.map((step) => ({
    item_code: step.code,
    status: 'PENDING',
    started_at: null,
    completed_at: null,
    metadata: null,
    error_message: null,
  }))
}

export default function DataSelectionInProgress() {
  const { requestNo, runId } = useParams()
  const navigate = useNavigate()
  const numericRunId = Number(runId)
  const validRoute = Boolean(requestNo) && Number.isInteger(numericRunId)

  const stream: PipelineRunStreamState = usePipelineRunStream(validRoute ? numericRunId : null, 'selection_step')

  useEffect(() => {
    if (!validRoute || !requestNo || !stream.runStatus) return
    const target = stageScreenPath(requestNo, numericRunId, stream.runStatus, stream.currentStage)
    if (target !== window.location.pathname) navigate(target, { replace: true })
  }, [validRoute, requestNo, numericRunId, stream.runStatus, stream.currentStage, navigate])

  const displayItems = withPendingDefaults(stream.items)
  const tone = stageStatusTone(aggregateStepStatus(displayItems))

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader
        title="실시간 데이터 선별 진행"
        badgeLabel="데이터 선별"
        onBack={validRoute ? () => navigate(`/tasks/${requestNo}/runs/${runId}/detail`) : undefined}
      />
      <FlowContentArea>
        {stream.errorMessage && <DataNotice $error role="alert">{stream.errorMessage}</DataNotice>}
        {stream.connectionState === 'reconnecting' && (
          <DataNotice role="status">연결이 끊어져 다시 연결하고 있습니다...</DataNotice>
        )}
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="데이터 선별 단계"
              statusLabel={tone.label}
              statusBg={tone.bg}
              statusColor={tone.color}
              items={buildStepTimelineItems(displayItems, SELECTION_STEPS, stream.stepMessages)}
            />
          </LeftPanel>
          <LiveLogPanel lines={stream.logLines} />
        </SplitGrid>
      </FlowContentArea>
      <Footer />
    </PageWrapper>
  )
}
