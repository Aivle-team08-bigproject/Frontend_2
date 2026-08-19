import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import Timeline from '../../shared/Timeline'
import LiveLogPanel from '../../shared/LiveLogPanel'
import { fetchTaskDetail } from '../../shared/api'
import { DataNotice, FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import {
  SELECTION_STEPS,
  aggregateStepStatus,
  buildStepTimelineItems,
  stageScreenPath,
  stageStatusTone,
} from '../../shared/pipelineLabels'
import {
  FailureModal,
  FailureModalText,
  FailureModalTitle,
  ModalActionRow,
  ModalBackdrop,
  PrimaryAction,
  SecondaryAction,
} from './TaskDetail.styles'
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
  const [showInsufficientDataModal, setShowInsufficientDataModal] = useState(false)
  const [returningToRequirement, setReturningToRequirement] = useState(false)

  useEffect(() => {
    if (stream.failureCode === 'INSUFFICIENT_DATA') setShowInsufficientDataModal(true)
  }, [stream.failureCode])

  useEffect(() => {
    if (!validRoute || !requestNo || !stream.runStatus) return
    const target = stageScreenPath(requestNo, numericRunId, stream.runStatus, stream.currentStage)
    if (target !== window.location.pathname) navigate(target, { replace: true })
  }, [validRoute, requestNo, numericRunId, stream.runStatus, stream.currentStage, navigate])

  const displayItems = withPendingDefaults(stream.items)
  const tone = stageStatusTone(aggregateStepStatus(displayItems, stream.runStatus))

  const returnToRequirementEdit = useCallback(async () => {
    if (!requestNo || !Number.isInteger(numericRunId) || returningToRequirement) return
    setReturningToRequirement(true)
    try {
      const detail = await fetchTaskDetail(requestNo, numericRunId)
      navigate('/tasks/register', { state: { prefill: detail.requirement_draft, fromFailure: true } })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '요구사항 정보를 불러오지 못했습니다.')
      setReturningToRequirement(false)
    }
  }, [navigate, numericRunId, requestNo, returningToRequirement])

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
          <DataNotice role="status">실시간 연결이 끊어졌습니다. 최신 상태를 확인하며 자동으로 다시 연결하고 있습니다...</DataNotice>
        )}
        {stream.connectionState === 'error' && (
          <DataNotice $error role="alert">실시간 연결에 실패했습니다. 잠시 후 자동으로 다시 연결을 시도합니다.</DataNotice>
        )}
        <SplitGrid>
          <LeftPanel>
            <Timeline
              sectionTitle="데이터 선별 단계"
              statusLabel={tone.label}
              statusBg={tone.bg}
              statusColor={tone.color}
              items={buildStepTimelineItems(displayItems, SELECTION_STEPS, stream.stepMessages, stream.runStatus)}
            />
          </LeftPanel>
          <LiveLogPanel lines={stream.logLines} />
        </SplitGrid>
      </FlowContentArea>
      <Footer />
      {showInsufficientDataModal && (
        <ModalBackdrop role="presentation" onClick={() => setShowInsufficientDataModal(false)}>
          <FailureModal role="dialog" aria-modal="true" aria-labelledby="selection-insufficient-data-title" onClick={(event) => event.stopPropagation()}>
            <FailureModalTitle id="selection-insufficient-data-title">조건에 맞는 데이터가 없습니다</FailureModalTitle>
            <FailureModalText>
              현재 요구사항의 필터 조건으로 조회되는 데이터가 없어 다음 단계로 진행할 수 없습니다.
              기존 입력 내용을 불러와 요구사항을 수정한 뒤 다시 제출할 수 있습니다.
            </FailureModalText>
            <ModalActionRow>
              <SecondaryAction type="button" onClick={() => setShowInsufficientDataModal(false)}>닫기</SecondaryAction>
              <PrimaryAction type="button" onClick={() => void returnToRequirementEdit()} disabled={returningToRequirement}>
                {returningToRequirement ? '불러오는 중...' : '요구사항 수정으로 돌아가기'}
              </PrimaryAction>
            </ModalActionRow>
          </FailureModal>
        </ModalBackdrop>
      )}
    </PageWrapper>
  )
}
