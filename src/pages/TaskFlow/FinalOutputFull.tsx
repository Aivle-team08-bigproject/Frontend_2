import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun, fetchProcessingResult, openResultDownload } from '../../shared/api'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_FINAL_OUTPUT_FEEDBACK } from './finalOutputFeedbackData'
import { Card, CardHeaderRow, CardTitle, DataTable, DownloadLink, HeaderActions, TCell, THead, TRow } from './FinalOutputFeedback.styles'

export default function FinalOutputFull() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const invalidRoute = !requestNo || !Number.isInteger(numericRunId)
  const navigate = useNavigate()

  const runFetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data: run, loading: runLoading, error: runError } = useAsyncData(runFetcher)
  const resultFetcher = useCallback(() => fetchProcessingResult(numericRunId), [numericRunId])
  const { data: processingResult, loading: resultLoading, error: resultError } = useAsyncData(resultFetcher)
  const view = { ...EMPTY_FINAL_OUTPUT_FEEDBACK, reqId: run?.request_no ?? EMPTY_FINAL_OUTPUT_FEEDBACK.reqId, requestTitle: run?.request_title ?? EMPTY_FINAL_OUTPUT_FEEDBACK.requestTitle }
  const outputRows = processingResult?.api_result.items ?? []
  const outputColumns = processingResult?.processed_columns ?? Object.keys(outputRows[0] ?? {})

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader
        title="최종 산출물 전체 보기"
        badgeLabel={`${outputRows.length}건`}
        onBack={invalidRoute ? undefined : () => navigate(`/tasks/${requestNo}/runs/${runId}/final-feedback`)}
        backLabel="산출물 검토로"
      />
      <FlowContentArea>
        {invalidRoute ? (
          <DataNotice $error role="alert">잘못된 실행 경로입니다. 요청번호와 실행 ID를 확인해주세요.</DataNotice>
        ) : (
          <DataStateNotice loading={runLoading || resultLoading} error={runError ?? resultError} subject="최종 산출물" />
        )}
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />

        <Card>
          <CardHeaderRow>
            <CardTitle>산출물 데이터 (전체 {outputRows.length}건)</CardTitle>
            <HeaderActions>
              <DownloadLink type="button" onClick={() => void openResultDownload(numericRunId)} disabled={invalidRoute}>
                CSV 다운로드
              </DownloadLink>
            </HeaderActions>
          </CardHeaderRow>
          <DataTable>
            <THead>
              {outputColumns.map((column) => <TCell key={column} $strong>{column}</TCell>)}
            </THead>
            {outputRows.map((row, index) => (
              <TRow key={index}>
                {outputColumns.map((column) => <TCell key={column}>{String(row[column] ?? '-')}</TCell>)}
              </TRow>
            ))}
          </DataTable>
        </Card>
      </FlowContentArea>
      <Footer />
    </PageWrapper>
  )
}
