import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import { infoSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import { currentRequestNo } from '../../shared/api'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { fetchSampleDataFeedbackData } from './sampleDataFeedbackData'
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
  const { data } = useAsyncData(fetchSampleDataFeedbackData)
  const [accordionOpen, setAccordionOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="샘플데이터 및 피드백" badgeLabel="샘플 검토" />
      <FlowContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={2} />

        <PreviewCard>
          <PreviewHeader>
            <PreviewTitle>샘플 데이터 미리보기 (Top 5)</PreviewTitle>
            <ButtonGroup>
              <DownloadButton type="button">CSV 다운로드</DownloadButton>
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
            {data.sampleRows.map((row, index) => (
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
                {data.columnInfo.map((info) => (
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
              placeholder={data.feedbackPlaceholder}
            />
          </PromptGroup>
          <NoticeBanner>
            <NoticeIcon src={infoSrc} alt="" />
            <NoticeText>샘플 승인 후 계약 체결 시 본 데이터 가공으로 진행됩니다</NoticeText>
          </NoticeBanner>
        </FeedbackCard>

        <ActionsRow>
          <RequestButton type="button" disabled={!prompt.trim()}>
            재가공 요청
          </RequestButton>
          <ApproveButton type="button" onClick={() => navigate(`/tasks/processing?requestNo=${encodeURIComponent(currentRequestNo())}`)}>
            샘플 승인 → 계약 체결
          </ApproveButton>
          <DisabledButton type="button" disabled>
            본 데이터 가공 시작
          </DisabledButton>
        </ActionsRow>
      </FlowContentArea>
    </PageWrapper>
  )
}
