import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import SectionCard from '../../shared/SectionCard'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { formatDateTime } from '../../shared/datetime'
import { adminRecoverPipelineRun, fetchTaskDetail, openResultDownload, submitReview } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { runStatusTone, stageContentPath, stageLabel, stageScreenPath, stageStatusTone, STAGE_ORDER } from '../../shared/pipelineLabels'
import { colors } from '../../shared/theme'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import {
  ActionRow,
  ArtifactItem,
  ArtifactList,
  EmptyText,
  FailureModal,
  FailureModalText,
  FailureModalTitle,
  FailureNotice,
  FailureNoticeAction,
  FailureNoticeCopy,
  FailureNoticeText,
  FailureNoticeTitle,
  HistoryFeedback,
  HistoryList,
  HistoryMeta,
  HistoryRow,
  HistoryTop,
  MetaItem,
  MetaLabel,
  MetaRow,
  MetaValue,
  ModalActionRow,
  ModalBackdrop,
  AdminRecoveryButton,
  RecoveryOption,
  PrimaryAction,
  ProgressFill,
  ProgressLabels,
  ProgressTrack,
  ProgressValue,
  ProgressWrap,
  RetryFeedbackBlock,
  RetryFeedbackLabel,
  RetryFeedbackTextarea,
  SecondaryAction,
  StageCard,
  StageErrorText,
  StageLink,
  StageMetaRow,
  StageName,
  StageTop,
  StagesGrid,
  StatusBadge,
  SummaryCard,
  SummaryTop,
} from './TaskDetail.styles'

const ACTION_LABELS: Record<string, string> = {
  APPROVE: '검토하고 승인하기',
  REQUEST_CHANGES: '재처리 요청하기',
  RETRY: '실패 작업 재시도',
  DOWNLOAD: '산출물 다운로드',
}

/**
 * 통합 작업 상세 화면. Back의 detail_route가 가리키는 목적지이며,
 * 단계별 화면에 들어가기 전에 작업 전체 상태·단계 이력·현재 가능한 액션을 보여준다.
 * 새로고침이나 직접 URL 접근에서도 run_id의 현재 상태만으로 화면을 복원한다.
 */
export default function TaskDetail() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const invalidRoute = !requestNo || !Number.isInteger(numericRunId)
  const navigate = useNavigate()

  const fetcher = useCallback(() => fetchTaskDetail(requestNo!, numericRunId), [requestNo, numericRunId])
  const { data, loading, error } = useAsyncData(fetcher, { intervalMs: 10_000 })
  const [retrying, setRetrying] = useState(false)
  const [retryFeedback, setRetryFeedback] = useState('')
  const [showInsufficientDataModal, setShowInsufficientDataModal] = useState(false)
  const [showAdminRecoveryModal, setShowAdminRecoveryModal] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const { data: currentUser } = useAsyncData(fetchCurrentUser)
  const isAdmin = currentUser?.roleCode === 'ADMIN'

  const isInsufficientData = data?.failure_code === 'INSUFFICIENT_DATA'
    || data?.error_message?.includes('선택한 조건에 해당하는 데이터가 없습니다')
    || data?.error_message?.includes('필터 조건이나 대상 컬럼을 조정해야 합니다')

  useEffect(() => {
    if (isInsufficientData) setShowInsufficientDataModal(true)
  }, [isInsufficientData])

  const tone = runStatusTone(data?.run_status)
  const canReview = (data?.available_actions ?? []).some(
    (action) => action === 'APPROVE' || action === 'REQUEST_CHANGES',
  )
  const canRetry = (data?.available_actions ?? []).includes('RETRY')
  const canDownload = (data?.available_actions ?? []).includes('DOWNLOAD')
  // 실행 전 단계는 아직 작업 이력이 아니다. 현재 단계와 이미 시작/종료된 단계만
  // 보여야 진행 중인 요구사항 분석 화면에 선별·가공 카드가 섞이지 않는다.
  const currentStageIndex = data?.current_stage ? STAGE_ORDER.indexOf(data.current_stage as typeof STAGE_ORDER[number]) : -1
  const visibleStages = data?.stages.filter((stage) => {
    const stageIndex = STAGE_ORDER.indexOf(stage.stage_code as typeof STAGE_ORDER[number])
    return currentStageIndex < 0 || stageIndex <= currentStageIndex
  }) ?? []

  function goToStageScreen() {
    if (!data || !requestNo) return
    navigate(stageScreenPath(requestNo, data.run_id, data.run_status, data.current_stage))
  }

  async function retryFailedRun() {
    if (!data || !requestNo || retrying) return
    setRetrying(true)
    try {
      const response = await submitReview(data.run_id, {
        approved: false,
        retry: true,
        feedback: retryFeedback.trim() || null,
      })
      setRetryFeedback('')
      navigate(stageScreenPath(requestNo, data.run_id, response.run_status, response.next_stage))
    } catch (retryError) {
      window.alert(retryError instanceof Error ? retryError.message : '실패 작업 재시도에 실패했습니다.')
    } finally {
      setRetrying(false)
    }
  }

  function returnToRequirementEdit() {
    if (!data) return
    navigate('/tasks/register', { state: { prefill: data.requirement_draft, fromFailure: true } })
  }

  async function recoverAsAdmin(mode: 'RESTART' | 'REQUIREMENT_ANALYSIS') {
    if (!data || recovering) return
    setRecovering(true)
    try {
      const response = await adminRecoverPipelineRun(data.run_id, mode)
      setShowAdminRecoveryModal(false)
      navigate(stageScreenPath(requestNo!, data.run_id, response.run_status, response.next_stage))
    } catch (recoveryError) {
      window.alert(recoveryError instanceof Error ? recoveryError.message : '관리자 재실행에 실패했습니다.')
    } finally {
      setRecovering(false)
    }
  }

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="작업 상세" badgeLabel={tone.label} badgeBg={tone.color} />
      <FlowContentArea>
        {invalidRoute ? (
          <DataNotice $error role="alert">잘못된 실행 경로입니다. 요청번호와 실행 ID를 확인해주세요.</DataNotice>
        ) : (
          <DataStateNotice loading={loading && !data} error={error} subject="작업 상세" />
        )}

        {data && (
          <>
            <SummaryCard>
              <SummaryTop>
                <MetaRow>
                  <MetaItem>
                    <MetaLabel>요청번호</MetaLabel>
                    <MetaValue>{data.request_no}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>작업명</MetaLabel>
                    <MetaValue>{data.title}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>담당자</MetaLabel>
                    <MetaValue>{data.assignee_name}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>현재 단계</MetaLabel>
                    <MetaValue>{stageLabel(data.current_stage)}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>시도 회차</MetaLabel>
                    <MetaValue>{data.attempt_no ?? '-'}</MetaValue>
                  </MetaItem>
                </MetaRow>
                <StatusBadge $bg={tone.bg} $color={tone.color}>
                  {tone.label}
                </StatusBadge>
              </SummaryTop>

              <ProgressWrap>
                <ProgressLabels>
                  <span>전체 진행률</span>
                  <ProgressValue>{data.progress_percent}%</ProgressValue>
                </ProgressLabels>
                <ProgressTrack>
                  <ProgressFill $percent={data.progress_percent} />
                </ProgressTrack>
              </ProgressWrap>

              {data.rollback_to_stage && (
                <DataNotice role="status">
                  {stageLabel(data.rollback_to_stage)} 단계로 롤백되어 재실행 중입니다.
                </DataNotice>
              )}
              {isInsufficientData ? (
                <FailureNotice role="alert">
                  <FailureNoticeCopy>
                    <FailureNoticeTitle>현재 조건에 맞는 데이터가 없습니다</FailureNoticeTitle>
                    <FailureNoticeText>기존 입력값을 불러와 요구사항을 수정할 수 있습니다.</FailureNoticeText>
                  </FailureNoticeCopy>
                  <FailureNoticeAction type="button" onClick={returnToRequirementEdit}>
                    요구사항 재입력
                  </FailureNoticeAction>
                </FailureNotice>
              ) : data.error_message ? <StageErrorText>{data.error_message}</StageErrorText> : null}

              {canRetry && (
                <RetryFeedbackBlock>
                  <RetryFeedbackLabel>재시도 시 에이전트에 전달할 의견 (선택)</RetryFeedbackLabel>
                  <RetryFeedbackTextarea
                    value={retryFeedback}
                    onChange={(event) => setRetryFeedback(event.target.value)}
                    placeholder="예: merchant_id가 없는 거래는 지역 집계에서 제외하고 다시 가공해주세요."
                    disabled={retrying}
                  />
                </RetryFeedbackBlock>
              )}

              <ActionRow>
                {isAdmin && (
                  <AdminRecoveryButton type="button" onClick={() => setShowAdminRecoveryModal(true)}>
                    관리자 재실행
                  </AdminRecoveryButton>
                )}
                {canReview && (
                  <PrimaryAction type="button" onClick={goToStageScreen}>
                    {ACTION_LABELS.APPROVE}
                  </PrimaryAction>
                )}
                {canRetry && (
                  <PrimaryAction type="button" onClick={retryFailedRun} disabled={retrying}>
                    {retrying ? '재시도 중...' : ACTION_LABELS.RETRY}
                  </PrimaryAction>
                )}
                {canDownload && (
                  <PrimaryAction type="button" onClick={() => void openResultDownload(data.run_id)}>
                    {ACTION_LABELS.DOWNLOAD}
                  </PrimaryAction>
                )}
                <SecondaryAction type="button" onClick={goToStageScreen}>
                  현재 단계 화면으로 이동
                </SecondaryAction>
                <SecondaryAction type="button" onClick={() => navigate('/dashboard/tasks')}>
                  작업 리스트로
                </SecondaryAction>
              </ActionRow>
            </SummaryCard>

            <SectionCard title="파이프라인 단계별 상태">
              <StagesGrid>
                {visibleStages.length === 0 && <EmptyText>표시할 단계 정보가 없습니다.</EmptyText>}
                {visibleStages.map((stage) => {
                  const stageTone = stageStatusTone(stage.status)
                  const stagePath = stage.status === 'COMPLETED'
                    ? stageContentPath(requestNo!, data.run_id, stage.stage_code)
                    : stageScreenPath(requestNo!, data.run_id, data.run_status, stage.stage_code)
                  return (
                    <StageCard key={`${stage.stage_code}-${stage.attempt_no}`} $current={stage.stage_code === data.current_stage}>
                      <StageTop>
                        <StageName>{stageLabel(stage.stage_code)}</StageName>
                        <StatusBadge $bg={stageTone.bg} $color={stageTone.color}>
                          {stageTone.label}
                        </StatusBadge>
                      </StageTop>
                      <StageMetaRow>
                        <span>시도 회차</span>
                        <MetaValue>{stage.attempt_no}</MetaValue>
                      </StageMetaRow>
                      <StageMetaRow>
                        <span>진행률</span>
                        <MetaValue>{stage.progress_percent}%</MetaValue>
                      </StageMetaRow>
                      {stage.review_status && (
                        <StageMetaRow>
                          <span>검토 결과</span>
                          <MetaValue>{stage.review_status === 'APPROVED' ? '승인' : '재처리 요청'}</MetaValue>
                        </StageMetaRow>
                      )}
                      <StageMetaRow>
                        <span>시작</span>
                        <MetaValue>{stage.started_at ? formatDateTime(stage.started_at) : '-'}</MetaValue>
                      </StageMetaRow>
                      {stage.artifacts.length > 0 && (
                        <ArtifactList>
                          {stage.artifacts.map((artifact) => (
                            <ArtifactItem key={artifact.artifact_id}>
                              <span>{artifact.artifact_type}</span>
                              <span>{artifact.pii_scan_status}</span>
                            </ArtifactItem>
                          ))}
                        </ArtifactList>
                      )}
                      {stage.error_message && <StageErrorText>{stage.error_message}</StageErrorText>}
                      {requestNo && (
                        <StageLink
                          to={stagePath}
                        >
                          단계 화면 열기 &gt;
                        </StageLink>
                      )}
                    </StageCard>
                  )
                })}
              </StagesGrid>
            </SectionCard>

            <SectionCard title="검토 이력">
              <HistoryList>
                {data.history.length === 0 && <EmptyText>아직 검토 이력이 없습니다.</EmptyText>}
                {data.history.map((entry, index) => (
                  <HistoryRow
                    key={`${entry.created_at}-${index}`}
                    $stripe={entry.decision === 'APPROVED' ? colors.success : colors.warning}
                  >
                    <HistoryTop>
                      <span>
                        {stageLabel(entry.review_type)} · {entry.decision === 'APPROVED' ? '승인' : '재처리 요청'}
                      </span>
                      <HistoryMeta>
                        {entry.reviewer_name ?? '-'} · {formatDateTime(entry.created_at)}
                      </HistoryMeta>
                    </HistoryTop>
                    {entry.feedback && <HistoryFeedback>{entry.feedback}</HistoryFeedback>}
                  </HistoryRow>
                ))}
              </HistoryList>
            </SectionCard>
          </>
        )}
      </FlowContentArea>
      <Footer />
      {showInsufficientDataModal && data && (
        <ModalBackdrop role="presentation" onClick={() => setShowInsufficientDataModal(false)}>
          <FailureModal role="dialog" aria-modal="true" aria-labelledby="insufficient-data-title" onClick={(event) => event.stopPropagation()}>
            <FailureModalTitle id="insufficient-data-title">조건에 맞는 데이터가 없습니다</FailureModalTitle>
            <FailureModalText>
              현재 요구사항의 필터 조건으로 조회되는 데이터가 없어 다음 단계로 진행할 수 없습니다.
              요구사항을 수정하면 기존 입력 내용을 불러온 상태에서 다시 제출할 수 있습니다.
            </FailureModalText>
            <ModalActionRow>
              <SecondaryAction type="button" onClick={() => setShowInsufficientDataModal(false)}>닫기</SecondaryAction>
              <PrimaryAction type="button" onClick={returnToRequirementEdit}>요구사항 수정으로 돌아가기</PrimaryAction>
            </ModalActionRow>
          </FailureModal>
        </ModalBackdrop>
      )}
      {showAdminRecoveryModal && data && (
        <ModalBackdrop role="presentation" onClick={() => setShowAdminRecoveryModal(false)}>
          <FailureModal role="dialog" aria-modal="true" aria-labelledby="admin-recovery-title" onClick={(event) => event.stopPropagation()}>
            <FailureModalTitle id="admin-recovery-title">시연용 작업 재실행</FailureModalTitle>
            <FailureModalText>
              현재 단계 상태만 남아 있거나 실행이 멈춘 더미 작업을 관리자 권한으로 복구합니다. 기존 자연어 요구사항은 유지됩니다.
            </FailureModalText>
            <RecoveryOption type="button" onClick={() => void recoverAsAdmin('RESTART')} disabled={recovering}>
              <strong>처음부터 다시 실행</strong>
              <span>전체 파이프라인 단계를 초기화하고 요구사항 분석부터 다시 시작합니다.</span>
            </RecoveryOption>
            <RecoveryOption type="button" onClick={() => void recoverAsAdmin('REQUIREMENT_ANALYSIS')} disabled={recovering}>
              <strong>요구사항 분석부터 실행</strong>
              <span>기존 입력 내용을 기준으로 요구사항 분석 단계부터 다시 실행합니다.</span>
            </RecoveryOption>
            <ModalActionRow>
              <SecondaryAction type="button" onClick={() => setShowAdminRecoveryModal(false)} disabled={recovering}>취소</SecondaryAction>
            </ModalActionRow>
          </FailureModal>
        </ModalBackdrop>
      )}
    </PageWrapper>
  )
}
