import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
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
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { fetchTaskCompleteData } from './taskCompleteData'
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
  const { data } = useAsyncData(fetchTaskCompleteData)
  const navigate = useNavigate()

  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="작업 완료" badgeLabel="완료" badgeBg="#22c55e" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={9} />

        <Card>
          <CardTitle>프로세스 결과 요약</CardTitle>
          <MilestoneList>
            {data.milestones.map((item, index) => (
              <MilestoneRow key={item.title}>
                <IndicatorCol>
                  <Circle>
                    <CheckIcon src={checkSmSrc} alt="완료" />
                  </Circle>
                  {index < data.milestones.length - 1 && <ConnectorLine />}
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
                {data.files.map((file) => (
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
                    <FieldValue>{data.endpointUrl}</FieldValue>
                  </FieldValueBox>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>API Key (Private)</FieldLabel>
                  <FieldValueBox>
                    <FieldValue>{data.apiKeyMasked}</FieldValue>
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
                <InputBox>{data.recipientEmail}</InputBox>
                <InputBox>{data.emailSubject}</InputBox>
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
    </PageWrapper>
  )
}
