import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import SectionCard from '../../shared/SectionCard'
import { radioSelectedSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { currentRequestNo } from '../../shared/api'
import { FlowContentArea, LeftPanel, PageWrapper, SplitGrid } from '../../shared/layout.styles'
import { EMPTY_REVIEW_FEEDBACK, fetchReviewFeedbackData } from './reviewFeedbackData'
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

export default function ReviewFeedback() {
  const { data, loading, error } = useAsyncData(fetchReviewFeedbackData)
  const view = data ?? EMPTY_REVIEW_FEEDBACK
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()


  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="요구사항 완료 피드백" badgeLabel="피드백 대기" badgeBg="#d97706" />
      <FlowContentArea>
        <DataStateNotice loading={loading} error={error} subject="요구사항 분석 결과" />
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
                <BackButton type="button">이전 단계로</BackButton>
                <ApproveButton type="button" onClick={() => navigate(`/tasks/selection?requestNo=${encodeURIComponent(currentRequestNo())}`)}>
                  승인 후 다음 단계
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
                <ResubmitButton type="button" disabled={!feedback.trim()}>
                  재가공 요청
                </ResubmitButton>
              </FeedbackActions>
            </SectionCard>
          </RightCol>
        </SplitGrid>
      </FlowContentArea>
    </PageWrapper>
  )
}
