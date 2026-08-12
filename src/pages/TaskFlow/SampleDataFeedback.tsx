import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import { infoSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun, fetchSamplePreview, openResultDownload, submitReview } from '../../shared/api'
import EmailDeliveryModal from '../../shared/EmailDeliveryModal'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_SAMPLE_DATA_FEEDBACK } from './sampleDataFeedbackData'
import {
  AccordionCard,
  AccordionContent,
  AccordionDivider,
  AccordionTitle,
  AccordionToggle,
  ActionsRow,
  ApproveButton,
  ButtonGroup,
  ChevronText,
  DisabledButton,
  DownloadButton,
  EmailButton,
  FeedbackCard,
  FeedbackTitle,
  InfoBlock,
  InfoDescription,
  InfoTitle,
  NoticeBanner,
  NoticeIcon,
  NoticeText,
  PreviewCard,
  PreviewHeader,
  PreviewTitle,
  PromptGroup,
  PromptLabel,
  PromptTextarea,
  RequestButton,
  SampleCell,
  SampleHeaderRow,
  SampleRowEl,
  SampleTable,
} from './SampleDataFeedback.styles'

export default function SampleDataFeedback() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const invalidRoute = !requestNo || !Number.isInteger(numericRunId)
  const runFetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data: run, loading: runLoading, error: runError } = useAsyncData(runFetcher)
  const previewFetcher = useCallback(() => fetchSamplePreview(numericRunId), [numericRunId])
  const { data: preview, loading: previewLoading, error: previewError } = useAsyncData(previewFetcher)
  const runNotReady = !runLoading && run !== null && run.run_status !== 'WAITING_SAMPLE_REVIEW'
  const view = { ...EMPTY_SAMPLE_DATA_FEEDBACK, reqId: run?.request_no ?? EMPTY_SAMPLE_DATA_FEEDBACK.reqId, requestTitle: run?.request_title ?? EMPTY_SAMPLE_DATA_FEEDBACK.requestTitle }
  const [accordionOpen, setAccordionOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const navigate = useNavigate()

  async function handleDecision(approved: boolean) {
    if (invalidRoute || submitting || (!approved && !prompt.trim())) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitReview(numericRunId, {
        approved,
        feedback: approved ? null : prompt.trim(),
      })
      const target = result.next_stage ?? result.rollback_to_stage
      const route = target === 'DATA_PROCESSING' ? 'processing' : target === 'DATA_SELECTION' ? 'selection' : 'detail'
      navigate(`/tasks/${requestNo}/runs/${runId}/${route}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '검토 제출에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="샘플데이터 및 피드백" badgeLabel="샘플 검토" />
      <FlowContentArea>
        {invalidRoute ? (
          <DataNotice $error role="alert">잘못된 실행 경로입니다. 요청번호와 실행 ID를 확인해주세요.</DataNotice>
        ) : (
          <>
            <DataStateNotice loading={runLoading || previewLoading} error={runError ?? previewError} subject="샘플 데이터" />
            {runNotReady && <DataNotice $error role="alert">이 작업은 현재 샘플 검토 대기 상태가 아닙니다 ({run?.run_status}).</DataNotice>}
            {submitError && <DataNotice $error role="alert">{submitError}</DataNotice>}
          </>
        )}
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={2} />

        <PreviewCard>
          <PreviewHeader>
            <PreviewTitle>샘플 데이터 미리보기 (Top 5)</PreviewTitle>
            <ButtonGroup>
              <DownloadButton type="button" onClick={() => void openResultDownload(numericRunId)} disabled={invalidRoute}>
                CSV 다운로드
              </DownloadButton>
              <EmailButton type="button" onClick={() => setEmailModalOpen(true)} disabled={invalidRoute || runNotReady}>
                <span>✉</span>
                메일로 전송
              </EmailButton>
            </ButtonGroup>
          </PreviewHeader>
          <SampleTable>
            <SampleHeaderRow>
              {(preview?.columns ?? []).map((column) => (
                <SampleCell key={column.name} $strong>{column.name}</SampleCell>
              ))}
            </SampleHeaderRow>
            {(preview?.rows ?? []).map((row, index) => (
              <SampleRowEl key={index}>
                {(preview?.columns ?? []).map((column) => (
                  <SampleCell key={column.name}>{String(row[column.name] ?? '-')}</SampleCell>
                ))}
              </SampleRowEl>
            ))}
          </SampleTable>
        </PreviewCard>

        <AccordionCard>
          <AccordionToggle type="button" onClick={() => setAccordionOpen((v) => !v)}>
            <ChevronText $open={accordionOpen}>▼</ChevronText>
            <AccordionTitle>컬럼 선정 기준 및 산출 방법</AccordionTitle>
          </AccordionToggle>
          {accordionOpen && (
            <>
              <AccordionDivider />
              <AccordionContent>
                {(preview?.columns ?? []).map((column) => (
                  <InfoBlock key={column.name}>
                    <InfoTitle>{column.name} ({column.data_type})</InfoTitle>
                    <InfoDescription>{column.description || '선별된 컬럼'}</InfoDescription>
                  </InfoBlock>
                ))}
              </AccordionContent>
            </>
          )}
        </AccordionCard>

        <FeedbackCard>
          <FeedbackTitle>피드백 제출</FeedbackTitle>
          <PromptGroup>
            <PromptLabel>프롬프트 추가 (재가공 필요 시)</PromptLabel>
            <PromptTextarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={view.feedbackPlaceholder}
            />
          </PromptGroup>
          <NoticeBanner>
            <NoticeIcon src={infoSrc} alt="" />
            <NoticeText>샘플 승인 후 계약 체결 시 본 데이터 가공으로 진행됩니다</NoticeText>
          </NoticeBanner>
        </FeedbackCard>

        <ActionsRow>
          <RequestButton type="button" disabled={!prompt.trim() || invalidRoute || submitting || runNotReady} onClick={() => handleDecision(false)}>
            재가공 요청
          </RequestButton>
          <RequestButton type="button" onClick={() => navigate(`/tasks/${requestNo}/runs/${runId}/review`)}>
            요구사항 분석 다시 보기
          </RequestButton>
          <ApproveButton type="button" disabled={invalidRoute || submitting || runNotReady} onClick={() => handleDecision(true)}>
            {submitting ? '제출 중...' : '샘플 승인 → 계약 체결'}
          </ApproveButton>
          <DisabledButton type="button" disabled>
            본 데이터 가공 시작
          </DisabledButton>
        </ActionsRow>
      </FlowContentArea>
      <EmailDeliveryModal
        runId={numericRunId}
        deliveryType="SELECTION_SAMPLE"
        title="샘플 데이터 메일 발송"
        hint="본인 계정 이메일이 자동으로 채워집니다. 필요하면 수정 후 발송하세요."
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    <Footer />
    </PageWrapper>
  )
}
