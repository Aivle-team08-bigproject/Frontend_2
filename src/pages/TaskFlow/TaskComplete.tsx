import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import {
  copySrc,
  databaseSrc,
  downloadSrc,
  fileSpreadsheetSrc,
  fileTextSrc,
  mailSrc,
} from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchTaskDetail, issueCustomerApiKey, openResultDownload, type CustomerApiKeyResponse } from '../../shared/api'
import EmailDeliveryModal from '../../shared/EmailDeliveryModal'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_TASK_COMPLETE } from './taskCompleteData'
import {
  BottomActions,
  Card,
  CardTitle,
  ColHeader,
  ColTitle,
  CopyIcon,
  DeliveryCol,
  DeliveryRow,
  FieldBlock,
  FieldGroup,
  FieldLabel,
  FieldValue,
  FieldValueBox,
  FileIcon,
  FileInfo,
  FileList,
  FileName,
  FileRow,
  FileSize,
  FileSkeletonIcon,
  FileSkeletonRow,
  FileSkeletonSize,
  FileSkeletonText,
  GoDashboardButton,
  IconBadge,
  IconImg,
  NewTaskButton,
  RegisteredBadge,
  SendButton,
} from './TaskComplete.styles'

const fileIcons = { csv: fileTextSrc, xlsx: fileSpreadsheetSrc }

function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) return '-'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function TaskComplete() {
  const { requestNo, runId } = useParams()
  const numericRunId = Number(runId)
  const detailFetcher = useCallback(() => fetchTaskDetail(requestNo!, numericRunId), [requestNo, numericRunId])
  // 마지막 단계 승인 직후에는 산출물 S3 저장과 Artifact DB 등록이 별도 트랜잭션으로
  // 마무리될 수 있다. 완료 화면 진입 시 한 번만 조회하면 파일이 없는 상태가 고정되므로
  // 화면이 열려 있는 동안 상세를 재조회해 파일 등록을 즉시 반영한다.
  const { data: detail, loading, error } = useAsyncData(detailFetcher, { intervalMs: 3000 })
  const navigate = useNavigate()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [issuedApiKey, setIssuedApiKey] = useState<CustomerApiKeyResponse | null>(null)
  const [apiKeyIssuing, setApiKeyIssuing] = useState(false)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const view = { ...EMPTY_TASK_COMPLETE, reqId: detail?.request_no ?? EMPTY_TASK_COMPLETE.reqId, requestTitle: detail?.title ?? EMPTY_TASK_COMPLETE.requestTitle }
  // 동일 단계는 재시도될 수 있으므로 첫 DATA_PROCESSING 실행만 보면 안 된다.
  // FINAL 산출물은 run 단위로 유일하므로, 모든 단계 이력에서 최신 FINAL 산출물을 찾는다.
  // 그렇지 않으면 산출물이 이미 등록됐어도 첫 시도의 빈 artifact 목록 때문에
  // 완료 화면이 스켈레톤에 계속 머문다.
  const finalArtifact = detail?.stages
    .flatMap((stage) => stage.artifacts)
    .filter((artifact) => artifact.artifact_type === 'FINAL')
    .at(-1)
  // API Key 발급은 고객 연동 정보일 뿐, 최종 파일 생성의 근거가 아니다. 이전에는
  // issuedApiKey를 fallback으로 사용해 서버 등록 버튼을 누른 순간 파일이 생긴 것처럼
  // 보였고, 실제 Artifact가 늦게 등록되면 다운로드가 실패할 수 있었다.
  const files = finalArtifact
    ? [{
      name: `${detail!.request_no}-run-${detail!.run_id}-result.csv`,
      size: formatFileSize(finalArtifact?.size_bytes ?? null),
      kind: 'csv' as const,
    }]
    : []

  async function handleIssueApiKey() {
    if (apiKeyIssuing) return
    setApiKeyIssuing(true)
    setApiKeyError(null)
    try {
      const result = await issueCustomerApiKey(numericRunId)
      setIssuedApiKey(result)
    } catch (err) {
      setApiKeyError(err instanceof Error ? err.message : 'API Key 발급에 실패했습니다.')
    } finally {
      setApiKeyIssuing(false)
    }
  }

  async function handleCopyApiKey() {
    if (!issuedApiKey) return
    await navigator.clipboard.writeText(issuedApiKey.api_key)
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  async function handleCopyApiUrl() {
    if (!issuedApiKey) return
    await navigator.clipboard.writeText(issuedApiKey.endpoint_url)
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  function csvCell(value: string): string {
    return `"${value.replace(/"/g, '""')}"`
  }

  function handleDownloadApiCredentials() {
    if (!issuedApiKey) return
    const csv = [
      ['endpoint_url', 'api_key'],
      [issuedApiKey.endpoint_url, issuedApiKey.api_key],
    ].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n'
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${detail?.request_no ?? 'customer'}-api-credentials.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }


  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="작업 완료" badgeLabel="완료" badgeBg="#22c55e" />
      <FlowContentArea>
        <DataStateNotice loading={loading} error={error} subject="작업 완료 정보" />
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={4} />

        <Card>
          <CardTitle>산출물 제공 및 연동</CardTitle>
          <DeliveryRow>
            <DeliveryCol>
              <ColHeader>
                <IconBadge>
                  <IconImg src={downloadSrc} alt="" />
                </IconBadge>
                <ColTitle>파일 다운로드</ColTitle>
              </ColHeader>
              <FileList>
                {files.length === 0 ? (
                  <FileSkeletonRow role="status" aria-label="산출물 파일 준비 중">
                    <FileSkeletonIcon />
                    <FileSkeletonText />
                    <FileSkeletonSize />
                  </FileSkeletonRow>
                ) : (
                  files.map((file) => (
                    <FileRow
                      key={file.name}
                      as="button"
                      type="button"
                      onClick={() => void openResultDownload(numericRunId)}
                    >
                      <FileInfo>
                        <FileIcon src={fileIcons[file.kind]} alt="" />
                        <FileName>{file.name}</FileName>
                      </FileInfo>
                      <FileSize>{file.size}</FileSize>
                    </FileRow>
                  ))
                )}
              </FileList>
            </DeliveryCol>

            <DeliveryCol>
              <ColHeader>
                <IconBadge>
                  <IconImg src={databaseSrc} alt="" />
                </IconBadge>
                <ColTitle>API 서버 등록</ColTitle>
              </ColHeader>
              <FieldGroup>
                {issuedApiKey ? (
                  <>
                    <FieldBlock>
                      <FieldLabel>Endpoint URL</FieldLabel>
                      <FieldValueBox>
                        <FieldValue title={issuedApiKey.endpoint_url}>{issuedApiKey.endpoint_url}</FieldValue>
                        <CopyIcon src={copySrc} alt="URL 복사" onClick={handleCopyApiUrl} />
                      </FieldValueBox>
                    </FieldBlock>
                    <FieldBlock>
                      <FieldLabel>API Key — 지금만 표시됩니다, 지금 복사하세요</FieldLabel>
                      <FieldValueBox>
                        <FieldValue title={issuedApiKey.api_key}>{issuedApiKey.api_key}</FieldValue>
                        <CopyIcon src={copySrc} alt="복사" onClick={handleCopyApiKey} />
                      </FieldValueBox>
                    </FieldBlock>
                    <SendButton type="button" onClick={handleDownloadApiCredentials}>
                      API URL·Key CSV 다운로드
                    </SendButton>
                    <RegisteredBadge>{apiKeyCopied ? '복사됨' : '연동 등록됨'}</RegisteredBadge>
                  </>
                ) : (
                  <>
                    <FieldLabel>API Key를 발급하면 고객이 이 계약의 산출물을 직접 재다운로드할 수 있습니다.</FieldLabel>
                    {apiKeyError && <DataNotice $error role="alert">{apiKeyError}</DataNotice>}
                    <SendButton type="button" onClick={handleIssueApiKey} disabled={!detail || apiKeyIssuing}>
                      {apiKeyIssuing ? '발급 중...' : 'API Key 발급'}
                    </SendButton>
                  </>
                )}
              </FieldGroup>
            </DeliveryCol>

            <DeliveryCol>
              <ColHeader>
                <IconBadge>
                  <IconImg src={mailSrc} alt="" />
                </IconBadge>
                <ColTitle>고객 메일 전송</ColTitle>
              </ColHeader>
              <FieldGroup>
                <FieldLabel>최종 산출물 다운로드 링크를 고객 이메일로 보냅니다.</FieldLabel>
                <SendButton type="button" onClick={() => setEmailModalOpen(true)} disabled={!detail}>
                  메일 발송
                </SendButton>
              </FieldGroup>
            </DeliveryCol>
          </DeliveryRow>
        </Card>

        <BottomActions>
          <GoDashboardButton type="button" onClick={() => navigate('/dashboard')}>
            대시보드로 이동
          </GoDashboardButton>
          <NewTaskButton type="button" onClick={() => navigate('/tasks/register')}>
            새 작업 등록
          </NewTaskButton>
        </BottomActions>
      </FlowContentArea>
      {detail && (
        <EmailDeliveryModal
          defaultRecipient={detail?.client_contact_email ?? null}
          runId={numericRunId}
          deliveryType="FINAL_ARTIFACT"
          title="최종 산출물 메일 발송"
          hint="메일 발송 시 API URL·Key를 자동 발급해 최종 산출물 다운로드 링크와 함께 보냅니다. 다운로드 링크는 발송 시점 기준 3일간 유효합니다."
          open={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          apiCredentials={issuedApiKey}
          onApiCredentialsIssued={setIssuedApiKey}
        />
      )}
    <Footer />
    </PageWrapper>
  )
}
