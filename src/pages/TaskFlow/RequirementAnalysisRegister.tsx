import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import { useAsyncData } from '../../shared/hooks'
import { PageWrapper } from '../../shared/layout.styles'
import { fetchRequirementRegisterData } from './requirementRegisterData'
import { createDataRequest } from '../../shared/api'
import {
  ActionsRow,
  ContentArea,
  ErrorMessage,
  InputHeader,
  InputSection,
  InputSubtitle,
  InputTitle,
  SubmitButton,
  Textarea,
} from './RequirementAnalysisRegister.styles'

export default function RequirementAnalysisRegister() {
  const { data } = useAsyncData(fetchRequirementRegisterData)
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit() {
    const rawRequirement = value.trim()
    if (!rawRequirement || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const created = await createDataRequest({ raw_requirement: rawRequirement })
      navigate(`/tasks/${created.request_no}/runs/${created.run_id}/analyzing`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '요청 등록에 실패했습니다.')
      setSubmitting(false)
    }
  }

  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="요구사항 분석 가공 등록" badgeLabel="요구사항 등록" />
      <ContentArea>
        <RequestHeaderCard reqId={data.reqId} title={data.requestTitle} />
        <StepProgressBar currentStep={1} />
        <InputSection>
          <InputHeader>
            <InputTitle>데이터 요구사항을 자유롭게 입력해주세요</InputTitle>
            <InputSubtitle>AI가 요구사항을 자동으로 분석하여 최적의 데이터를 제공합니다</InputSubtitle>
          </InputHeader>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={data.placeholder}
          />
          <ActionsRow>
            {submitError && <ErrorMessage role="alert">{submitError}</ErrorMessage>}
            <SubmitButton type="button" disabled={!value.trim() || submitting} onClick={handleSubmit}>
              {submitting ? '등록 중...' : '요구사항 제출'}
            </SubmitButton>
          </ActionsRow>
        </InputSection>
      </ContentArea>
    </PageWrapper>
  )
}
