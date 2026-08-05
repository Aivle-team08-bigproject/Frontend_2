import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import SectionCard from '../../shared/SectionCard'
import { radioSelectedSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun, submitReview } from '../../shared/api'
import { DataNotice, FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { EMPTY_REVIEW_FEEDBACK } from './reviewFeedbackData'
import {
  ApproveButton,
  BackButton,
  ColumnDescription,
  ColumnItem,
  ColumnList,
  ColumnName,
  ColumnTop,
  ColumnType,
  FeedbackActions,
  FeedbackTextarea,
  OptionGroup,
  OptionGroupLabel,
  OptionLabel,
  OptionList,
  OptionRow,
  RadioEmpty,
  RadioIcon,
  ResubmitButton,
  ReviewActions,
  RightCol,
  Row,
  RowLabel,
  RowValue,
  ScaleLabel,
  ScaleRow,
  ScaleValue,
  SummaryGrid,
} from './ReviewFeedback.styles'

/** 승인/반려 응답의 next_stage 또는 rollback_to_stage를 진행 화면 경로로 매핑한다. */
const STAGE_PROGRESS_ROUTE: Record<string, string> = {
  REQUIREMENT_ANALYSIS: 'analyzing',
  DATA_SELECTION: 'selection',
  DATA_PROCESSING: 'processing',
}

export default function ReviewFeedback() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const invalidRoute = !requestNo || !Number.isInteger(numericRunId)
  const navigate = useNavigate()

  const runFetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data: run, loading: runLoading, error: runError } = useAsyncData(runFetcher)
  const analysis = run?.requirement_analysis
  const analysisColumns = analysis
    ? Object.entries(analysis.categories).map(([name, value]) => ({
      name,
      type: '요청 조건',
      description: Array.isArray(value) ? value.join(', ') : String(value),
    }))
    : []
  const view = {
    ...EMPTY_REVIEW_FEEDBACK,
    reqId: run?.request_no ?? EMPTY_REVIEW_FEEDBACK.reqId,
    requestTitle: run?.request_title ?? EMPTY_REVIEW_FEEDBACK.requestTitle,
    usagePurpose: analysis?.usage_purpose ?? EMPTY_REVIEW_FEEDBACK.usagePurpose,
    dataDescription: analysis?.requested_data_sentence ?? EMPTY_REVIEW_FEEDBACK.dataDescription,
    columns: analysisColumns,
    deliveryMedium: analysis?.delivery_channel ?? EMPTY_REVIEW_FEEDBACK.deliveryMedium,
    outputFormat: analysis?.output_formats.join(', ') ?? EMPTY_REVIEW_FEEDBACK.outputFormat,
  }
  const runNotReady = !runLoading && run !== null && run.run_status !== 'WAITING_REQUIREMENT_REVIEW'

  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleDecision(approved: boolean) {
    if (invalidRoute || submitting) return
    if (!approved && !feedback.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitReview(numericRunId, {
        approved,
        feedback: approved ? null : feedback.trim(),
      })
      const targetStage = result.next_stage ?? result.rollback_to_stage
      if (result.run_status === 'COMPLETED') {
        navigate(`/tasks/${requestNo}/runs/${runId}/complete`)
      } else if (targetStage && STAGE_PROGRESS_ROUTE[targetStage]) {
        navigate(`/tasks/${requestNo}/runs/${runId}/${STAGE_PROGRESS_ROUTE[targetStage]}`)
      } else {
        navigate(`/tasks/${requestNo}/runs/${runId}/analyzing`)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '제출에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="요구사항 완료 피드백" badgeLabel="피드백 대기" badgeBg="#d97706" />
      <FlowContentArea>
        {invalidRoute ? (
          <DataNotice $error role="alert">잘못된 실행 경로입니다. 요청번호와 실행 ID를 확인해주세요.</DataNotice>
        ) : (
          <>
            <DataStateNotice loading={runLoading} error={runError} subject="요구사항 분석 결과" />
            {runNotReady && (
              <DataNotice $error role="alert">
                이 작업은 더 이상 요구사항 검토 대기 상태가 아닙니다 (현재 상태: {run?.run_status}). 최신 화면으로 이동해주세요.
              </DataNotice>
            )}
            {submitError && <DataNotice $error role="alert">{submitError}</DataNotice>}
          </>
        )}
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={1} />
        <SplitGrid>
          <LeftPanel>
            <SectionCard title="AI 분석 결과 요약">
              <SummaryGrid>
                <Row>
                  <RowLabel>사용 용도</RowLabel>
                  <RowValue>{view.usagePurpose}</RowValue>
                </Row>
                <Row>
                  <RowLabel>요청 데이터 설명</RowLabel>
                  <RowValue>{view.dataDescription}</RowValue>
                </Row>
                <Row>
                  <RowLabel>AI 판단 데이터 컬럼</RowLabel>
                  <ColumnList>
                    {view.columns.map((col) => (
                      <ColumnItem key={col.name}>
                        <ColumnTop>
                          <ColumnName>{col.name}</ColumnName>
                          <ColumnType>{col.type}</ColumnType>
                        </ColumnTop>
                        <ColumnDescription>{col.description}</ColumnDescription>
                      </ColumnItem>
                    ))}
                  </ColumnList>
                </Row>
                <ScaleRow>
                  <ScaleLabel>예상 데이터 건수:</ScaleLabel>
                  <ScaleValue>{view.estimatedCount}</ScaleValue>
                </ScaleRow>
              </SummaryGrid>
            </SectionCard>
          </LeftPanel>

          <RightCol>
            <SectionCard title="전달 설정" accentColor="#d97706">
              <OptionGroup>
                <OptionGroupLabel>데이터 전달 매체</OptionGroupLabel>
                <OptionList>
                  <OptionRow>
                    <RadioIcon src={radioSelectedSrc} alt="" />
                    <OptionLabel $selected>{view.deliveryMedium}</OptionLabel>
                  </OptionRow>
                  <OptionRow>
                    <RadioEmpty />
                    <OptionLabel $selected={false}>이메일</OptionLabel>
                  </OptionRow>
                </OptionList>
              </OptionGroup>
              <OptionGroup>
                <OptionGroupLabel>원하는 산출물 형식</OptionGroupLabel>
                <OptionList>
                  <OptionRow>
                    <RadioIcon src={radioSelectedSrc} alt="" />
                    <OptionLabel $selected>{view.outputFormat}</OptionLabel>
                  </OptionRow>
                  <OptionRow>
                    <RadioEmpty />
                    <OptionLabel $selected={false}>시각화 대시보드</OptionLabel>
                  </OptionRow>
                  <OptionRow>
                    <RadioEmpty />
                    <OptionLabel $selected={false}>보고서</OptionLabel>
                  </OptionRow>
                </OptionList>
              </OptionGroup>
              <ReviewActions>
                <BackButton type="button" disabled={submitting}>이전 단계로</BackButton>
                <ApproveButton type="button" disabled={invalidRoute || submitting || runNotReady} onClick={() => handleDecision(true)}>
                  {submitting ? '제출 중...' : '승인 후 다음 단계'}
                </ApproveButton>
              </ReviewActions>
            </SectionCard>

            <SectionCard title="피드백 제출">
              <FeedbackTextarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={view.feedbackPlaceholder}
              />
              <FeedbackActions>
                <ResubmitButton
                  type="button"
                  disabled={!feedback.trim() || invalidRoute || submitting || runNotReady}
                  onClick={() => handleDecision(false)}
                >
                  {submitting ? '제출 중...' : '재가공 요청'}
                </ResubmitButton>
              </FeedbackActions>
            </SectionCard>
          </RightCol>
        </SplitGrid>
      </FlowContentArea>
    <Footer />
    </PageWrapper>
  )
}
