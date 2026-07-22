import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { useAsyncData } from '../../shared/hooks'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { fetchPipelineRun } from '../../shared/api'
import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'

const STAGE_LABELS: Record<string, string> = {
  REQUIREMENT_ANALYSIS: '요구사항 분석',
  DATA_SELECTION: '데이터 선별',
  DATA_PROCESSING: '데이터 가공',
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('ko-KR', { hour12: false })
}

export default function AnalysisInProgress() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const fetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data, loading, error } = useAsyncData(fetcher, { intervalMs: 3000 })
  if (!requestNo || !Number.isInteger(numericRunId)) return <p>잘못된 실행 경로입니다.</p>
  if (loading && !data) return <p>실행 상태를 불러오는 중입니다...</p>
  if (error || !data) return <p>실행 상태를 불러오지 못했습니다.</p>

  const timelineItems: TimelineItem[] = data.stages.map((stage) => ({
    title: STAGE_LABELS[stage.stage_code] ?? stage.stage_code,
    time: formatTime(stage.created_at),
    description: `${stage.executor} 실행기 · ${stage.status}`,
    state: stage.status === 'COMPLETED' ? 'done' : stage.status === 'RUNNING' || stage.status === 'PENDING' ? 'active' : 'pending',
  }))
  const logLines: LiveLogLine[] = data.events.map((event) => ({
    time: formatTime(event.occurred_at),
    agent: event.event_type,
    agentColor: event.severity === 'ERROR' ? '#dc2626' : '#008485',
    message: event.message,
  }))
  const completed = data.run_status === 'COMPLETED'

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="실시간 요구사항 분석 진행" badgeLabel="분석 진행" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.request_no} title={data.request_title} />
        <StepProgressBar currentStep={2} />
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="요구사항 분석 프로세스"
              statusLabel={completed ? '✅ 완료' : `${data.progress_percent}% · ${data.run_status}`}
              statusBg={completed ? '#dcfce7' : '#e0f2fe'}
              statusColor={completed ? '#22c55e' : '#0369a1'}
              items={timelineItems}
            />
          </LeftPanel>
          <LiveLogPanel lines={logLines} refreshNotice="3초마다 실행 상태 확인 중" />
        </SplitGrid>
      </FlowContentArea>
    </PageWrapper>
  )
}
