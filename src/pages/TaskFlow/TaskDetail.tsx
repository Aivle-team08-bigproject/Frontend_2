import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import SectionCard from '../../shared/SectionCard'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { formatDateTime } from '../../shared/datetime'
import { fetchTaskDetail, pipelineResultDownloadUrl } from '../../shared/api'
import { runStatusTone, stageContentPath, stageLabel, stageScreenPath, stageStatusTone } from '../../shared/pipelineLabels'
import { colors } from '../../shared/theme'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import {
  ActionRow,
  ArtifactItem,
  ArtifactList,
  EmptyText,
  HistoryFeedback,
  HistoryList,
  HistoryMeta,
  HistoryRow,
  HistoryTop,
  MetaItem,
  MetaLabel,
  MetaRow,
  MetaValue,
  PrimaryAction,
  ProgressFill,
  ProgressLabels,
  ProgressTrack,
  ProgressValue,
  ProgressWrap,
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

  const tone = runStatusTone(data?.run_status)
  const canReview = (data?.available_actions ?? []).some(
    (action) => action === 'APPROVE' || action === 'REQUEST_CHANGES',
  )
  const canDownload = (data?.available_actions ?? []).includes('DOWNLOAD')

  function goToStageScreen() {
    if (!data || !requestNo) return
    navigate(stageScreenPath(requestNo, data.run_id, data.run_status, data.current_stage))
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
              {data.error_message && <StageErrorText>{data.error_message}</StageErrorText>}

              <ActionRow>
                {canReview && (
                  <PrimaryAction type="button" onClick={goToStageScreen}>
                    {ACTION_LABELS.APPROVE}
                  </PrimaryAction>
                )}
                {canDownload && (
                  <PrimaryAction type="button" onClick={() => window.open(pipelineResultDownloadUrl(data.run_id), '_blank', 'noopener')}>
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
                {data.stages.length === 0 && <EmptyText>표시할 단계 정보가 없습니다.</EmptyText>}
                {data.stages.map((stage) => {
                  const stageTone = stageStatusTone(stage.status)
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
                          type="button"
                          onClick={() => navigate(
                            stage.status === 'COMPLETED'
                              ? stageContentPath(requestNo, data.run_id, stage.stage_code)
                              : stageScreenPath(requestNo, data.run_id, data.run_status, stage.stage_code),
                          )}
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
    </PageWrapper>
  )
}
