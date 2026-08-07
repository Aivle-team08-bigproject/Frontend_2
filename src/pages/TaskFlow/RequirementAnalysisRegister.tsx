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
import { EmailAt, EmailInput, EmailInputRow } from '../SystemPages/SignupPage.styles'
import {
  ActionsRow,
  ContentArea,
  Field,
  FieldGrid,
  FieldHint,
  FieldInput,
  FieldSelect,
  FormGrid,
  GuideList,
  GuidePanel,
  GuideTitle,
  ErrorMessage,
  FieldError,
  InfoMessage,
  InputHeader,
  InputSection,
  InputSubtitle,
  InputTitle,
  MainForm,
  RequiredMark,
  SectionLabel,
  SubmitButton,
  Textarea,
  UploadButton,
  UploadHint,
  UploadRow,
} from './RequirementAnalysisRegister.styles'

const ACCEPTED_EXTENSIONS = '.txt,.docx,.pdf'

function formatPhone(value: string) {
  const rawDigits = value.replace(/\D/g, '')
  if (rawDigits.startsWith('02')) {
    const digits = rawDigits.slice(0, 10)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  const digits = rawDigits.slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function sanitizeEmailLocal(value: string) {
  return value.replace(/[^A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]/g, '').slice(0, 64)
}

function sanitizeEmailDomain(value: string) {
  return value.replace(/[^A-Za-z0-9.-]/g, '').toLowerCase().slice(0, 255)
}

export default function RequirementAnalysisRegister() {
  const [value, setValue] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmailLocal, setContactEmailLocal] = useState('')
  const [contactEmailDomain, setContactEmailDomain] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deliveryDueDate, setDeliveryDueDate] = useState('')
  const [dataSensitivity, setDataSensitivity] = useState<'NONE' | 'POSSIBLE' | 'UNKNOWN'>('UNKNOWN')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileNotice, setFileNotice] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const contactEmail = contactEmailLocal || contactEmailDomain ? `${contactEmailLocal}@${contactEmailDomain}` : ''
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const dateError = endDate && startDate && endDate < startDate
    ? '계약 종료일은 시작일보다 빠를 수 없습니다.'
    : deliveryDueDate && endDate && deliveryDueDate > endDate
      ? '최종 납기일은 계약 종료일 이후일 수 없습니다.'
      : null

  function validateField(field: string): string | null {
    if (field === 'title') return title.trim().length < 1 ? '작업명을 입력해주세요.' : title.trim().length > 100 ? '작업명은 100자 이내로 입력해주세요.' : null
    if (field === 'deliveryDueDate') return deliveryDueDate ? null : '최종 납기일을 선택해주세요.'
    if (field === 'customerName') return customerName.trim() ? null : '고객사명을 입력해주세요.'
    if (field === 'businessRegistrationNumber' && businessRegistrationNumber && !/^\d{3}-?\d{2}-?\d{5}$/.test(businessRegistrationNumber)) return '사업자등록번호를 올바른 형식으로 입력해주세요.'
    if (field === 'contactEmail' && contactEmail && !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(contactEmail)) return '이메일 주소를 올바른 형식으로 입력해주세요.'
    if (field === 'contactPhone' && contactPhone && !/^(0\d{1,2})-?\d{3,4}-?\d{4}$/.test(contactPhone.replace(/\s/g, ''))) return '연락처를 올바른 형식으로 입력해주세요.'
    if (field === 'dateRange') return dateError
    return null
  }

  function validateForm() {
    const fields = ['title', 'deliveryDueDate', 'customerName', 'businessRegistrationNumber', 'contactEmail', 'contactPhone', 'dateRange']
    const nextErrors = fields.reduce<Record<string, string>>((errors, field) => {
      const error = validateField(field)
      if (error) errors[field] = error
      return errors
    }, {})
    setFieldErrors(nextErrors)
    setTouchedFields(fields.reduce<Record<string, boolean>>((touched, field) => { touched[field] = true; return touched }, {}))
    return Object.keys(nextErrors).length === 0
  }

  function handleFieldBlur(field: string) {
    setTouchedFields((current) => ({ ...current, [field]: true }))
    const error = validateField(field)
    setFieldErrors((current) => ({ ...current, ...(error ? { [field]: error } : Object.fromEntries(Object.keys(current).filter((key) => key !== field).map((key) => [key, current[key]]))) }))
  }

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
    if (!rawRequirement || submitting || !validateForm()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const created = await createDataRequest({
        raw_requirement: rawRequirement,
        title: title.trim() || undefined,
        requester_name: customerName.trim() || undefined,
        client: {
          company_name: customerName.trim(),
          business_registration_number: businessRegistrationNumber.trim() || undefined,
          contact_name: contactName.trim() || undefined,
          contact_email: contactEmail.trim() || undefined,
          contact_phone: contactPhone.trim() || undefined,
        },
        contract: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          delivery_due_at: deliveryDueDate ? `${deliveryDueDate}T18:00:00+09:00` : undefined,
        },
        data_sensitivity: dataSensitivity,
      })
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
            <InputTitle>새 작업을 등록해주세요</InputTitle>
            <InputSubtitle>업무 목적과 필요한 데이터를 자유롭게 작성하면 AI가 요구사항을 분석합니다.</InputSubtitle>
          </InputHeader>
          <FieldGrid>
            <SectionLabel>작업 기본 정보</SectionLabel>
            <Field><span>작업명<RequiredMark>*</RequiredMark></span><FieldInput $invalid={Boolean(fieldErrors.title)} value={title} onChange={(event) => setTitle(event.target.value)} onBlur={() => handleFieldBlur('title')} placeholder="작업명을 입력해주세요" aria-invalid={Boolean(fieldErrors.title)} />{touchedFields.title && fieldErrors.title && <FieldError>{fieldErrors.title}</FieldError>}</Field>
            <Field><span>최종 납기일<RequiredMark>*</RequiredMark></span><FieldInput $invalid={Boolean(fieldErrors.deliveryDueDate || fieldErrors.dateRange)} type="date" value={deliveryDueDate} onChange={(event) => setDeliveryDueDate(event.target.value)} onBlur={() => handleFieldBlur('deliveryDueDate')} aria-invalid={Boolean(fieldErrors.deliveryDueDate || fieldErrors.dateRange)} />{touchedFields.deliveryDueDate && (fieldErrors.deliveryDueDate || fieldErrors.dateRange) && <FieldError>{fieldErrors.deliveryDueDate || fieldErrors.dateRange}</FieldError>}</Field>
          </FieldGrid>
          <FieldGrid>
            <SectionLabel>계약 기본 정보</SectionLabel>
            <Field><span>계약 시작일</span><FieldInput type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></Field>
            <Field><span>계약 종료일</span><FieldInput type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></Field>
            <Field><span>개인정보·민감정보 가능성</span><FieldSelect value={dataSensitivity} onChange={(event) => setDataSensitivity(event.target.value as typeof dataSensitivity)}><option value="UNKNOWN">판단 필요</option><option value="NONE">없음</option><option value="POSSIBLE">있음</option></FieldSelect></Field>
            <FieldHint>결과물 형식·전달 방식·검토 여부는 요구사항 분석 완료 후 결정합니다.</FieldHint>
          </FieldGrid>
          <FieldGrid>
            <SectionLabel>고객사 정보</SectionLabel>
            <Field><span>고객사명<RequiredMark>*</RequiredMark></span><FieldInput $invalid={Boolean(fieldErrors.customerName)} value={customerName} onChange={(event) => setCustomerName(event.target.value)} onBlur={() => handleFieldBlur('customerName')} placeholder="고객사명을 입력해주세요" aria-invalid={Boolean(fieldErrors.customerName)} />{touchedFields.customerName && fieldErrors.customerName && <FieldError>{fieldErrors.customerName}</FieldError>}</Field>
            <Field><span>사업자등록번호</span><FieldInput $invalid={Boolean(fieldErrors.businessRegistrationNumber)} value={businessRegistrationNumber} onChange={(event) => setBusinessRegistrationNumber(event.target.value)} onBlur={() => handleFieldBlur('businessRegistrationNumber')} placeholder="사업자등록번호" aria-invalid={Boolean(fieldErrors.businessRegistrationNumber)} />{touchedFields.businessRegistrationNumber && fieldErrors.businessRegistrationNumber && <FieldError>{fieldErrors.businessRegistrationNumber}</FieldError>}</Field>
            <Field><span>담당자명</span><FieldInput value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="고객사 담당자명" /></Field>
            <Field><span>담당자 이메일</span><EmailInputRow $invalid={Boolean(fieldErrors.contactEmail)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) handleFieldBlur('contactEmail') }}><EmailInput type="text" value={contactEmailLocal} onChange={(event) => setContactEmailLocal(sanitizeEmailLocal(event.target.value))} placeholder="아이디" maxLength={64} inputMode="email" autoCapitalize="none" spellCheck={false} aria-label="담당자 이메일 아이디" aria-invalid={Boolean(fieldErrors.contactEmail)} /><EmailAt>@</EmailAt><EmailInput type="text" value={contactEmailDomain} onChange={(event) => setContactEmailDomain(sanitizeEmailDomain(event.target.value))} placeholder="company.com" maxLength={255} inputMode="url" autoCapitalize="none" spellCheck={false} aria-label="담당자 이메일 도메인" aria-invalid={Boolean(fieldErrors.contactEmail)} /></EmailInputRow>{touchedFields.contactEmail && fieldErrors.contactEmail && <FieldError>{fieldErrors.contactEmail}</FieldError>}</Field>
            <Field><span>담당자 연락처</span><FieldInput $invalid={Boolean(fieldErrors.contactPhone)} type="tel" value={contactPhone} onChange={(event) => setContactPhone(formatPhone(event.target.value))} onBlur={() => handleFieldBlur('contactPhone')} placeholder="02-0000-0000" maxLength={13} inputMode="tel" aria-invalid={Boolean(fieldErrors.contactPhone)} />{touchedFields.contactPhone && fieldErrors.contactPhone && <FieldError>{fieldErrors.contactPhone}</FieldError>}</Field>
          </FieldGrid>
          <FormGrid>
            <MainForm>
              <FieldGrid>
                <SectionLabel>자연어 요구사항</SectionLabel>
                <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder={REQUIREMENT_REGISTER_FORM.placeholder} />
                <UploadRow>
                  <UploadButton type="button" disabled={extracting} onClick={() => fileInputRef.current?.click()}>
                    {extracting ? '파일 분석 중...' : '파일에서 불러오기'}
                  </UploadButton>
                  <UploadHint>.txt, .docx, .pdf · 최대 10MB</UploadHint>
                  <input ref={fileInputRef} type="file" accept={ACCEPTED_EXTENSIONS} onChange={handleFileChange} style={{ display: 'none' }} />
                </UploadRow>
                {fileError && <ErrorMessage role="alert">{fileError}</ErrorMessage>}
                {fileNotice && <InfoMessage role="status">{fileNotice}</InfoMessage>}
              </FieldGrid>
            </MainForm>
            <GuidePanel>
              <GuideTitle>요구사항 작성 가이드</GuideTitle>
              <p>아래 내용을 자연어로 편하게 작성해주세요. 모두 포함하지 않아도 분석을 시작할 수 있습니다.</p>
              <GuideList>
                <li>왜 필요한 데이터인지</li>
                <li>어떤 데이터를 대상으로 하는지</li>
                <li>원하는 결과나 활용 목적</li>
                <li>데이터 기간 또는 기준 시점</li>
                <li>제외하거나 반드시 보존할 항목</li>
                <li>납기와 업무상 중요한 일정</li>
              </GuideList>
              <p>결과물 형식과 전달 방식은 요구사항 분석 후 함께 결정합니다.</p>
            </GuidePanel>
          </FormGrid>
          {dateError && <ErrorMessage role="alert">{dateError}</ErrorMessage>}
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
