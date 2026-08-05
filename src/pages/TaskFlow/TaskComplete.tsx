import { useCallback } from 'react'
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
  plusSmSrc,
} from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { fetchPipelineRun } from '../../shared/api'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'
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
  CustomRow,
  CustomRowLabel,
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
  InputBox,
  MilestoneDescription,
  MilestoneList,
  MilestoneRow,
  MilestoneText,
  MilestoneTime,
  MilestoneTitle,
  MilestoneTop,
  NewTaskButton,
  PlusIcon,
  RegisteredBadge,
  SendButton,
} from './TaskComplete.styles'

const fileIcons = { csv: fileTextSrc, xlsx: fileSpreadsheetSrc }

export default function TaskComplete() {
  const { runId } = useParams()
  const numericRunId = Number(runId)
  const runFetcher = useCallback(() => fetchPipelineRun(numericRunId), [numericRunId])
  const { data: run, loading, error } = useAsyncData(runFetcher)
  const view = { ...EMPTY_TASK_COMPLETE, reqId: run?.request_no ?? EMPTY_TASK_COMPLETE.reqId, requestTitle: run?.request_title ?? EMPTY_TASK_COMPLETE.requestTitle }
  const navigate = useNavigate()


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
                {view.files.map((file) => (
                  <FileRow key={file.name}>
                    <FileInfo>
                      <FileIcon src={fileIcons[file.kind]} alt="" />
                      <FileName>{file.name}</FileName>
                    </FileInfo>
                    <FileSize>{file.size}</FileSize>
                  </FileRow>
                ))}
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
                <FieldBlock>
                  <FieldLabel>Endpoint URL</FieldLabel>
                  <FieldValueBox>
                    <FieldValue>{view.endpointUrl}</FieldValue>
                  </FieldValueBox>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>API Key (Private)</FieldLabel>
                  <FieldValueBox>
                    <FieldValue>{view.apiKeyMasked}</FieldValue>
                    <CopyIcon src={copySrc} alt="복사" />
                  </FieldValueBox>
                </FieldBlock>
                <RegisteredBadge>연동 등록됨</RegisteredBadge>
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
                <InputBox>{view.recipientEmail}</InputBox>
                <InputBox>{view.emailSubject}</InputBox>
                <CustomRow type="button">
                  <CustomRowLabel>메일 커스텀</CustomRowLabel>
                  <PlusIcon src={plusSmSrc} alt="" />
                </CustomRow>
                <SendButton type="button">메일 발송</SendButton>
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
    <Footer />
    </PageWrapper>
  )
}
