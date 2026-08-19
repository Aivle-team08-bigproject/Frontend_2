import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { DataNotice, FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import {
  ANALYSIS_STEPS,
  aggregateStepStatus,
  buildStepTimelineItems,
  stageScreenPath,
  stageStatusTone,
} from '../../shared/pipelineLabels'
import { usePipelineRunStream, type PipelineRunStreamState } from '../../shared/usePipelineRunStream'
import type { PipelineStreamItem } from '../../shared/pipelineEventStream'

function withPendingDefaults(items: PipelineStreamItem[]): PipelineStreamItem[] {
  if (items.length > 0) return items
  return ANALYSIS_STEPS.map((step) => ({
    item_code: step.code,
    status: 'PENDING',
    started_at: null,
    completed_at: null,
    metadata: null,
    error_message: null,
  }))
}

export default function AnalysisInProgress() {
  const { requestNo, runId } = useParams()
  const navigate = useNavigate()
  const numericRunId = Number(runId)
  const validRoute = Boolean(requestNo) && Number.isInteger(numericRunId)

  const stream: PipelineRunStreamState = usePipelineRunStream(validRoute ? numericRunId : null, 'analysis_step')

  useEffect(() => {
    if (!validRoute || !requestNo || !stream.runStatus) return
    const target = stageScreenPath(requestNo, numericRunId, stream.runStatus, stream.currentStage)
    if (target !== window.location.pathname) navigate(target, { replace: true })
  }, [validRoute, requestNo, numericRunId, stream.runStatus, stream.currentStage, navigate])

  const displayItems = withPendingDefaults(stream.items)
  const tone = stageStatusTone(aggregateStepStatus(displayItems, stream.runStatus))

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader
        title="실시간 요구사항 분석 진행"
        badgeLabel="분석 진행"
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
              sectionTitle="요구사항 분석 단계"
              statusLabel={tone.label}
              statusBg={tone.bg}
              statusColor={tone.color}
              items={buildStepTimelineItems(displayItems, ANALYSIS_STEPS, stream.stepMessages, stream.runStatus)}
            />
          </LeftPanel>
          <LiveLogPanel lines={stream.logLines} />
        </SplitGrid>
      </FlowContentArea>
      <Footer />
    </PageWrapper>
  )
}
