import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import SectionCard from '../../shared/SectionCard'
import { arrowLeftSrc, arrowRightSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { currentRequestNo } from '../../shared/api'
import { FlowContentArea, PageWrapper } from '../../shared/layout.styles'
import { EMPTY_FINAL_OUTPUT_FEEDBACK, fetchFinalOutputFeedbackData } from './finalOutputFeedbackData'
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
  InfoGrid,
  InfoLabel,
  InfoRowEl,
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
  const { data, loading, error } = useAsyncData(fetchFinalOutputFeedbackData)
  const view = data ?? EMPTY_FINAL_OUTPUT_FEEDBACK
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()


  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="최종 산출물 및 피드백" badgeLabel="산출물 검토" />
      <FlowContentArea>
        <DataStateNotice loading={loading} error={error} subject="최종 산출물" />
        <RequestHeaderCard reqId={view.reqId} title={view.requestTitle} />
        <StepProgressBar currentStep={3} />
        <SplitGrid>
          <LeftCol>
            <Card>
              <CardHeaderRow>
                <CardTitle>산출물 데이터 (Top 10)</CardTitle>
                <DownloadLink type="button">CSV 다운로드</DownloadLink>
              </CardHeaderRow>
              <DataTable>
                <THead>
                  <TCell $strong>지역(구)</TCell>
                  <TCell $strong>지역(동)</TCell>
                  <TCell $strong>업종</TCell>
                  <TCell $strong>연령대</TCell>
                  <TCell $strong>결제월</TCell>
                  <TCell $strong>매출지수</TCell>
                </THead>
                {view.outputRows.map((row, index) => (
                  <TRow key={index}>
                    <TCell>{row.district}</TCell>
                    <TCell>{row.neighborhood}</TCell>
                    <TCell>{row.category}</TCell>
                    <TCell>{row.ageGroup}</TCell>
                    <TCell>{row.paymentMonth}</TCell>
                    <TCell $strong>{row.salesIndex}</TCell>
                  </TRow>
                ))}
              </DataTable>
            </Card>

            <Card>
              <CardTitle>보고서 미리보기</CardTitle>
              <ReportViewer>
                <ReportHeader>
                  <ReportTitle>{view.reportTitle}</ReportTitle>
                  <ReportMeta>{view.reportMeta}</ReportMeta>
                </ReportHeader>
                <ReportBody>
                  <SummaryText>
                    <SummaryHeading>주요 트렌드 발견 (Insight Summary)</SummaryHeading>
                    {view.insightSummary.map((line) => (
                      <SummaryLine key={line}>{line}</SummaryLine>
                    ))}
                  </SummaryText>
                  <MiniChart>
                    {view.chartBars.map((bar) => (
                      <BarColumn key={bar.label}>
                        <Bar $height={bar.height} $highlight={bar.highlight} />
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
                {view.infoRows.map((row, index) => (
                  <InfoRowEl key={row.label} $last={index === view.infoRows.length - 1}>
                    <InfoLabel>{row.label}</InfoLabel>
                    <InfoValue>{row.value}</InfoValue>
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
                <ResubmitButton type="button" disabled={!feedback.trim()}>
                  재가공 요청
                </ResubmitButton>
              </FeedbackActions>
            </SectionCard>
          </RightCol>
        </SplitGrid>

        <BottomActionsRow>
          <BackLink type="button">
            <ArrowIcon src={arrowLeftSrc} alt="" />
            이전 단계
          </BackLink>
          <RightActions>
            <RecutButton type="button">수정 후 재생성</RecutButton>
            <ApproveButton type="button" onClick={() => navigate(`/tasks/complete?requestNo=${encodeURIComponent(currentRequestNo())}`)}>
              최종 승인
            </ApproveButton>
          </RightActions>
        </BottomActionsRow>
      </FlowContentArea>
    </PageWrapper>
  )
}
