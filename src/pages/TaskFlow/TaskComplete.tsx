import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import {
  checkSmSrc,
  copySrc,
  databaseSrc,
  downloadSrc,
  fileSpreadsheetSrc,
  fileTextSrc,
  mailSrc,
} from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchTaskDetail, issueCustomerApiKey, pipelineResultDownloadUrl, type CustomerApiKeyResponse } from '../../shared/api'
import EmailDeliveryModal from '../../shared/EmailDeliveryModal'
import { DataNotice, FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_TASK_COMPLETE } from './taskCompleteData'
import {
  BottomActions,
  Card,
  CardTitle,
  Circle,
  CheckIcon,
  ColHeader,
  ColTitle,
  ConnectorLine,
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
  GoDashboardButton,
  IconBadge,
  IconImg,
  IndicatorCol,
  MilestoneDescription,
  MilestoneList,
  MilestoneRow,
  MilestoneText,
  MilestoneTime,
  MilestoneTitle,
  MilestoneTop,
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
  const { data: detail, loading, error } = useAsyncData(detailFetcher)
  const view = { ...EMPTY_TASK_COMPLETE, reqId: detail?.request_no ?? EMPTY_TASK_COMPLETE.reqId, requestTitle: detail?.title ?? EMPTY_TASK_COMPLETE.requestTitle }
  const finalArtifact = detail?.stages
    .find((stage) => stage.stage_code === 'DATA_PROCESSING')
    ?.artifacts.find((artifact) => artifact.artifact_type === 'FINAL')
  const files = finalArtifact
    ? [{
      name: `${detail!.request_no}-run-${detail!.run_id}-result.csv`,
      size: formatFileSize(finalArtifact.size_bytes),
      kind: 'csv' as const,
    }]
    : []
  const navigate = useNavigate()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [issuedApiKey, setIssuedApiKey] = useState<CustomerApiKeyResponse | null>(null)
  const [apiKeyIssuing, setApiKeyIssuing] = useState(false)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

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


  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="작업 완료" badgeLabel="완료" badgeBg="#22c55e" />
      <FlowContentArea>
        <DataStateNotice loading={loading} error={error} subject="작업 완료 정보" />
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={4} />

        <Card>
          <CardTitle>프로세스 결과 요약</CardTitle>
          <MilestoneList>
            {view.milestones.map((item, index) => (
              <MilestoneRow key={item.title}>
                <IndicatorCol>
                  <Circle>
                    <CheckIcon src={checkSmSrc} alt="완료" />
                  </Circle>
                  {index < view.milestones.length - 1 && <ConnectorLine />}
                </IndicatorCol>
                <MilestoneText>
                  <MilestoneTop>
                    <MilestoneTitle>{item.title}</MilestoneTitle>
                    <MilestoneTime>{item.time}</MilestoneTime>
                  </MilestoneTop>
                  <MilestoneDescription>{item.description}</MilestoneDescription>
                </MilestoneText>
              </MilestoneRow>
            ))}
          </MilestoneList>
        </Card>

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
                  <FieldLabel>아직 생성된 산출물 파일이 없습니다.</FieldLabel>
                ) : (
                  files.map((file) => (
                    <FileRow
                      key={file.name}
                      as="button"
                      type="button"
                      onClick={() => window.open(pipelineResultDownloadUrl(numericRunId), '_blank', 'noopener')}
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
                        <FieldValue>{issuedApiKey.endpoint_url}</FieldValue>
                      </FieldValueBox>
                    </FieldBlock>
                    <FieldBlock>
                      <FieldLabel>API Key — 지금만 표시됩니다, 지금 복사하세요</FieldLabel>
                      <FieldValueBox>
                        <FieldValue>{issuedApiKey.api_key}</FieldValue>
                        <CopyIcon src={copySrc} alt="복사" onClick={handleCopyApiKey} />
                      </FieldValueBox>
                    </FieldBlock>
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
          runId={numericRunId}
          deliveryType="FINAL_ARTIFACT"
          title="최종 산출물 메일 발송"
          hint="본인 계정 이메일이 자동으로 채워집니다. 필요하면 수정 후 발송하세요. 다운로드 링크는 발송 시점 기준 3일간 유효합니다."
          open={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
        />
      )}
    <Footer />
    </PageWrapper>
  )
}
