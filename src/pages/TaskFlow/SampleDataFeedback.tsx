import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import { infoSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun, pipelineResultDownloadUrl, submitReview } from '../../shared/api'
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
  const runNotReady = !runLoading && run !== null && run.run_status !== 'WAITING_SAMPLE_REVIEW'
  const view = { ...EMPTY_SAMPLE_DATA_FEEDBACK, reqId: run?.request_no ?? EMPTY_SAMPLE_DATA_FEEDBACK.reqId, requestTitle: run?.request_title ?? EMPTY_SAMPLE_DATA_FEEDBACK.requestTitle }
  const [accordionOpen, setAccordionOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
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
            <DataStateNotice loading={runLoading} error={runError} subject="샘플 데이터" />
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
              <DownloadButton type="button" onClick={() => window.open(pipelineResultDownloadUrl(numericRunId), '_blank', 'noopener')} disabled={invalidRoute}>
                CSV 다운로드
              </DownloadButton>
              <EmailButton type="button">
                <span>✉</span>
                메일로 전송
              </EmailButton>
            </ButtonGroup>
          </PreviewHeader>
          <SampleTable>
            <SampleHeaderRow>
              <SampleCell $strong>지역(구)</SampleCell>
              <SampleCell $strong>지역(동)</SampleCell>
              <SampleCell $strong>업종</SampleCell>
              <SampleCell $strong>연령대</SampleCell>
              <SampleCell $strong>결제월</SampleCell>
              <SampleCell $strong>매출지수</SampleCell>
            </SampleHeaderRow>
            {view.sampleRows.map((row, index) => (
              <SampleRowEl key={index}>
                <SampleCell>{row.district}</SampleCell>
                <SampleCell>{row.neighborhood}</SampleCell>
                <SampleCell>{row.category}</SampleCell>
                <SampleCell>{row.ageGroup}</SampleCell>
                <SampleCell>{row.paymentMonth}</SampleCell>
                <SampleCell $strong>{row.salesIndex}</SampleCell>
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
                {view.columnInfo.map((info) => (
                  <InfoBlock key={info.title}>
                    <InfoTitle>{info.title}</InfoTitle>
                    <InfoDescription>{info.description}</InfoDescription>
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
          <ApproveButton type="button" disabled={invalidRoute || submitting || runNotReady} onClick={() => handleDecision(true)}>
            {submitting ? '제출 중...' : '샘플 승인 → 계약 체결'}
          </ApproveButton>
          <DisabledButton type="button" disabled>
            본 데이터 가공 시작
          </DisabledButton>
        </ActionsRow>
      </FlowContentArea>
    </PageWrapper>
  )
}
