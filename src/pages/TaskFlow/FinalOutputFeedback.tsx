import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import SectionCard from '../../shared/SectionCard'
import { arrowLeftSrc, arrowRightSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun, fetchProcessingResult, issueResultDownloadUrl, submitReview } from '../../shared/api'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_FINAL_OUTPUT_FEEDBACK } from './finalOutputFeedbackData'
import {
  ApproveButton,
  ArrowIcon,
  Bar,
  BarColumn,
  BarLabel,
  BackLink,
  BottomActionsRow,
  Card,
  CardHeaderRow,
  CardTitle,
  DataTable,
  DownloadLink,
  FeedbackActions,
  FeedbackTextarea,
  HeaderActions,
  InfoGrid,
  InfoLabel,
  InfoRowEl,
  InfoStructuredValue,
  InfoValue,
  LeftCol,
  MiniChart,
  RecutButton,
  ReportBody,
  ReportHeader,
  ReportMeta,
  ReportTitle,
  ReportViewer,
  ResubmitButton,
  RightActions,
  RightCol,
  SplitGrid,
  SummaryHeading,
  SummaryLine,
  SummaryText,
  TCell,
  THead,
  TRow,
  ViewFullReport,
} from './FinalOutputFeedback.styles'

export default function FinalOutputFeedback() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const invalidRoute = !requestNo || !Number.isInteger(numericRunId)
  const runFetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data: run, loading: runLoading, error: runError } = useAsyncData(runFetcher)
  const resultFetcher = useCallback(() => fetchProcessingResult(numericRunId), [numericRunId])
  const { data: processingResult, loading: resultLoading, error: resultError } = useAsyncData(resultFetcher)
  const runNotReady = !runLoading && run !== null && run.run_status !== 'WAITING_FINAL_REVIEW'
  const view = { ...EMPTY_FINAL_OUTPUT_FEEDBACK, reqId: run?.request_no ?? EMPTY_FINAL_OUTPUT_FEEDBACK.reqId, requestTitle: run?.request_title ?? EMPTY_FINAL_OUTPUT_FEEDBACK.requestTitle }
  const outputRows = processingResult?.api_result.items ?? []
  const outputColumns = processingResult?.processed_columns ?? Object.keys(outputRows[0] ?? {})
  // api_result.items는 delivery_channel === 'api'일 때만 채워진다(processor.py 설계).
  // 이메일/CSV 배송 요청은 여기가 항상 비어 있어도 산출물 자체는 정상 생성된 것이라
  // 다운로드로 유도하는 안내가 필요하다.
  const previewUnavailable = outputRows.length === 0 && Number(processingResult?.quality_report.output_row_count ?? 0) > 0
  const isPreviewSubset =
    outputRows.length > 0 && outputRows.length < Number(processingResult?.quality_report.output_row_count ?? 0)
  const report = processingResult?.report
  const reportTitle = typeof report?.title === 'string' ? report.title : '최종 가공 결과'
  const reportSummary = [
    typeof report?.summary === 'string' ? report.summary : null,
    typeof processingResult?.processing_explanation.summary === 'string' ? processingResult.processing_explanation.summary : null,
  ].filter((summary): summary is string => Boolean(summary))
  const qualityRows = Object.entries(processingResult?.quality_report ?? {})
  const chartSeries = Array.isArray(processingResult?.visualization?.series)
    ? processingResult.visualization.series.filter(
      (item): item is { label: string; value: number } => (
        typeof item === 'object'
        && item !== null
        && typeof item.label === 'string'
        && typeof item.value === 'number'
      ),
    )
    : []
  const maxChartValue = Math.max(...chartSeries.map((item) => item.value), 1)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  async function handleDownload() {
    setDownloadError(null)
    try {
      // 인증이 되는 호출로 주소를 먼저 받는다. 새 창은 Authorization 헤더를 싣지 못한다.
      const { download_url } = await issueResultDownloadUrl(numericRunId)
      window.open(download_url, '_blank', 'noopener')
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : '다운로드 주소를 받지 못했습니다.')
    }
  }

  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleDecision(approved: boolean) {
    if (invalidRoute || submitting || (!approved && !feedback.trim())) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitReview(numericRunId, { approved, feedback: approved ? null : feedback.trim() })
      const target = result.next_stage ?? result.rollback_to_stage
      const route = target === 'REQUIREMENT_ANALYSIS' ? 'analyzing'
        : target === 'DATA_SELECTION' ? 'selection'
          : target === 'DATA_PROCESSING' ? 'processing'
            : 'detail'
      navigate(result.run_status === 'COMPLETED' ? `/tasks/${requestNo}/runs/${runId}/complete` : `/tasks/${requestNo}/runs/${runId}/${route}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '검토 제출에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="최종 산출물 및 피드백" badgeLabel="산출물 검토" />
      <FlowContentArea>
        {invalidRoute ? (
          <DataNotice $error role="alert">잘못된 실행 경로입니다. 요청번호와 실행 ID를 확인해주세요.</DataNotice>
        ) : (
          <>
            <DataStateNotice loading={runLoading || resultLoading} error={runError ?? resultError} subject="최종 산출물" />
            {runNotReady && <DataNotice $error role="alert">이 작업은 현재 최종 검토 대기 상태가 아닙니다 ({run?.run_status}).</DataNotice>}
            {submitError && <DataNotice $error role="alert">{submitError}</DataNotice>}
          </>
        )}
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={3} />
        <SplitGrid>
          <LeftCol>
            <Card>
              <CardHeaderRow>
                <CardTitle>산출물 데이터 (Top 10)</CardTitle>
                <HeaderActions>
                  <DownloadLink
                    type="button"
                    onClick={() => navigate(`/tasks/${requestNo}/runs/${runId}/final-feedback/full`)}
                    disabled={invalidRoute || outputRows.length === 0}
                  >
                    전체 보기
                  </DownloadLink>
                  <DownloadLink type="button" onClick={handleDownload} disabled={invalidRoute}>CSV 다운로드</DownloadLink>
                </HeaderActions>
              </CardHeaderRow>
              {previewUnavailable && (
                <DataNotice role="status">
                  화면에 표시할 미리보기 데이터가 없습니다. 산출물은{' '}
                  {Number(processingResult?.quality_report.output_row_count ?? 0)}건 정상 생성됐습니다 — CSV 다운로드로 확인해주세요.
                </DataNotice>
              )}
              {isPreviewSubset && (
                <DataNotice role="status">
                  전체 {Number(processingResult?.quality_report.output_row_count ?? 0)}건 중 상위{' '}
                  {outputRows.length}건만 미리보기로 표시합니다. 전체 산출물은 CSV 다운로드로 확인해주세요.
                </DataNotice>
              )}
              {downloadError && <DataNotice role="alert">{downloadError}</DataNotice>}
              <DataTable>
                <THead>
                  {outputColumns.map((column) => <TCell key={column} $strong>{column}</TCell>)}
                </THead>
                {outputRows.slice(0, 10).map((row, index) => (
                  <TRow key={index}>
                    {outputColumns.map((column) => <TCell key={column}>{String(row[column] ?? '-')}</TCell>)}
                  </TRow>
                ))}
              </DataTable>
            </Card>

            <Card>
              <CardTitle>보고서 미리보기</CardTitle>
              <ReportViewer>
                <ReportHeader>
                    <ReportTitle>{reportTitle}</ReportTitle>
                    <ReportMeta>{processingResult ? `${processingResult.quality_report.output_row_count ?? outputRows.length}건 · 시도 ${processingResult.attempt_no}` : view.reportMeta}</ReportMeta>
                </ReportHeader>
                <ReportBody>
                  <SummaryText>
                    <SummaryHeading>주요 트렌드 발견 (Insight Summary)</SummaryHeading>
                    {reportSummary.map((line) => (
                      <SummaryLine key={line}>{line}</SummaryLine>
                    ))}
                  </SummaryText>
                  <MiniChart>
                    {chartSeries.map((bar) => (
                      <BarColumn key={bar.label}>
                        <Bar $height={(bar.value / maxChartValue) * 100} $highlight={bar.value === maxChartValue} />
                        <BarLabel>{bar.label}</BarLabel>
                      </BarColumn>
                    ))}
                  </MiniChart>
                </ReportBody>
              </ReportViewer>
              <ViewFullReport type="button">
                전체 보고서 보기
                <ArrowIcon src={arrowRightSrc} alt="" />
              </ViewFullReport>
            </Card>
          </LeftCol>

          <RightCol>
            <Card>
              <CardTitle>산출물 정보</CardTitle>
              <InfoGrid>
                {qualityRows.map(([label, value], index) => (
                  <InfoRowEl key={label} $last={index === qualityRows.length - 1}>
                    <InfoLabel>{label}</InfoLabel>
                    {typeof value === 'object' && value !== null ? (
                      <InfoStructuredValue>{JSON.stringify(value, null, 2)}</InfoStructuredValue>
                    ) : (
                      <InfoValue>{String(value)}</InfoValue>
                    )}
                  </InfoRowEl>
                ))}
              </InfoGrid>
            </Card>

            <SectionCard title="피드백 제출">
              <FeedbackTextarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={view.feedbackPlaceholder}
              />
              <FeedbackActions>
                <ResubmitButton type="button" disabled={!feedback.trim() || invalidRoute || submitting || runNotReady} onClick={() => handleDecision(false)}>
                  재가공 요청
                </ResubmitButton>
              </FeedbackActions>
            </SectionCard>
          </RightCol>
        </SplitGrid>

        <BottomActionsRow>
          <BackLink type="button" onClick={() => navigate(`/tasks/${requestNo}/runs/${runId}/sample-feedback`)}>
            <ArrowIcon src={arrowLeftSrc} alt="" />
            이전 단계
          </BackLink>
          <RightActions>
            <RecutButton type="button">수정 후 재생성</RecutButton>
            <ApproveButton type="button" disabled={invalidRoute || submitting || runNotReady} onClick={() => handleDecision(true)}>
              {submitting ? '제출 중...' : '최종 승인'}
            </ApproveButton>
          </RightActions>
        </BottomActionsRow>
      </FlowContentArea>
    <Footer />
    </PageWrapper>
  )
}
