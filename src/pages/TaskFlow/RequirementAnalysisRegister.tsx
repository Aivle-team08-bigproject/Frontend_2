import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import FlowPageHeader from '../../shared/FlowPageHeader'
import RequestHeaderCard from '../../shared/RequestHeaderCard'
import StepProgressBar from '../../shared/StepProgressBar'
import { PageWrapper } from '../../shared/layout.styles'
import { REQUIREMENT_REGISTER_FORM } from './requirementRegisterData'
import { ApiError, createDataRequest, extractDocumentText } from '../../shared/api'
import {
  ActionsRow,
  ContentArea,
  ErrorMessage,
  InfoMessage,
  InputHeader,
  InputSection,
  InputSubtitle,
  InputTitle,
  SubmitButton,
  Textarea,
  UploadButton,
  UploadHint,
  UploadRow,
} from './RequirementAnalysisRegister.styles'

const ACCEPTED_EXTENSIONS = '.txt,.docx,.pdf'

export default function RequirementAnalysisRegister() {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileNotice, setFileNotice] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // 같은 파일 다시 선택해도 onChange가 또 뜨도록 초기화
    if (!file) return

    if (value.trim() && !window.confirm('입력창에 이미 작성된 내용이 있습니다. 파일 내용으로 덮어쓸까요?')) {
      return
    }

    setExtracting(true)
    setFileError(null)
    setFileNotice(null)
    try {
      const result = await extractDocumentText(file)
      setValue(result.extracted_text)
      setFileNotice(
        result.truncated
          ? `${result.filename}에서 불러왔습니다. 내용이 길어 8000자까지만 채워졌어요 — 필요하면 이어서 수정해주세요.`
          : `${result.filename}에서 불러왔습니다. 필요하면 검토 후 수정해주세요.`,
      )
    } catch (error) {
      setFileError(error instanceof ApiError ? error.message : '파일에서 텍스트를 추출하지 못했습니다.')
    } finally {
      setExtracting(false)
    }
  }

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

  return (
    <PageWrapper>
      <GNB />
      <FlowPageHeader title="요구사항 분석 가공 등록" badgeLabel="요구사항 등록" />
      <ContentArea>
        <RequestHeaderCard reqId={REQUIREMENT_REGISTER_FORM.reqId} title={REQUIREMENT_REGISTER_FORM.requestTitle} />
        <StepProgressBar currentStep={1} />
        <InputSection>
          <InputHeader>
            <InputTitle>데이터 요구사항을 자유롭게 입력해주세요</InputTitle>
            <InputSubtitle>AI가 요구사항을 자동으로 분석하여 최적의 데이터를 제공합니다</InputSubtitle>
          </InputHeader>
          <UploadRow>
            <UploadButton type="button" disabled={extracting} onClick={() => fileInputRef.current?.click()}>
              {extracting ? '파일 분석 중...' : '파일에서 불러오기'}
            </UploadButton>
            <UploadHint>.txt, .docx, .pdf · 최대 10MB</UploadHint>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </UploadRow>
          {fileError && <ErrorMessage role="alert">{fileError}</ErrorMessage>}
          {fileNotice && <InfoMessage role="status">{fileNotice}</InfoMessage>}
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={REQUIREMENT_REGISTER_FORM.placeholder}
          />
          <ActionsRow>
            {submitError && <ErrorMessage role="alert">{submitError}</ErrorMessage>}
            <SubmitButton type="button" disabled={!value.trim() || submitting} onClick={handleSubmit}>
              {submitting ? '등록 중...' : '요구사항 제출'}
            </SubmitButton>
          </ActionsRow>
        </InputSection>
      </ContentArea>
    <Footer />
    </PageWrapper>
  )
}
