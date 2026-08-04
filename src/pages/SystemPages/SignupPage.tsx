import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, fetchPublicDepartments, signup } from '../../shared/api'
import type { Department, SignupPosition } from '../../shared/api'
import {
  BackLink,
  ConsentBox,
  ConsentDetails,
  ConsentLabel,
  ErrorText,
  FieldError,
  FieldHint,
  Field,
  Form,
  FormGrid,
  Input,
  LoginCard,
  LoginScreen,
  PrimaryButton,
  PasswordRule,
  PasswordRules,
  Dropdown,
  DropdownButton,
  DropdownIcon,
  DropdownMenu,
  DropdownSearch,
  DropdownOption,
  DropdownValue,
  EmailAt,
  EmailInput,
  EmailInputRow,
  SignupHeader,
  SignupNote,
  SuccessBox,
  Title,
  LegalLink,
  SectionTitle,
  SignupSection,
} from './SignupPage.styles'

const positions: Array<{ value: SignupPosition; label: string }> = [
  { value: 'STAFF', label: '사원' },
  { value: 'ASSISTANT_MANAGER', label: '대리' },
  { value: 'MANAGER', label: '과장' },
  { value: 'DEPUTY_GENERAL_MANAGER', label: '차장' },
  { value: 'GENERAL_MANAGER', label: '부장' },
]

type FormState = {
  name: string
  emailLocal: string
  emailDomain: string
  phone: string
  departmentId: string
  position: string
  password: string
  passwordConfirm: string
  terms: boolean
  privacy: boolean
}

type ValidatableField = 'name' | 'email' | 'phone' | 'departmentId' | 'position' | 'password' | 'passwordConfirm'

function passwordState(value: string) {
  return {
    length: value.length >= 12 && value.length <= 64,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  }
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
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

function composeEmail(form: FormState) {
  return `${form.emailLocal}@${form.emailDomain}`
}

function validateField(field: ValidatableField, value: string, form: FormState): string | null {
  if (field === 'name') {
    const length = value.trim().length
    return length < 2 || length > 50 ? '이름은 2~50자로 입력해주세요.' : null
  }
  if (field === 'email') {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value.trim()) ? null : '아이디와 도메인을 올바르게 입력해주세요.'
  }
  if (field === 'phone') {
    return /^01[016789]\d{7,8}$/.test(value.replace(/\D/g, '')) ? null : '휴대폰 번호를 올바른 형식으로 입력해주세요.'
  }
  if (field === 'departmentId') return value ? null : '부서를 선택해주세요.'
  if (field === 'position') return value ? null : '직급을 선택해주세요.'
  if (field === 'password') {
    const rules = passwordState(value)
    return Object.values(rules).every(Boolean) ? null : '비밀번호 조건을 모두 충족해주세요.'
  }
  return value === form.password ? null : '비밀번호 확인이 일치하지 않습니다.'
}

function FieldDropdown({ label, value, options, placeholder, searchable, disabled, invalid, error, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; placeholder: string; searchable?: boolean; disabled?: boolean; invalid?: boolean; error?: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <Dropdown ref={containerRef}>
      <span>{label}</span>
      <DropdownButton type="button" disabled={disabled} $invalid={invalid} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <DropdownValue $selected={Boolean(value)}>{options.find((option) => option.value === value)?.label || placeholder}</DropdownValue>
        <DropdownIcon $open={open}>⌄</DropdownIcon>
      </DropdownButton>
      {open && <DropdownMenu role="listbox" aria-label={`${label} 선택`}>
        {searchable && <DropdownSearch autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="부서명을 검색하세요" aria-label="부서 검색" />}
        {filteredOptions.length ? filteredOptions.map((option) => (
          <DropdownOption key={option.value} type="button" role="option" aria-selected={value === option.value} $selected={value === option.value} onClick={() => { onChange(option.value); setOpen(false); setQuery('') }}>
            {option.label}{value === option.value && <span>✓</span>}
          </DropdownOption>
        )) : <DropdownOption type="button" disabled>검색 결과가 없습니다.</DropdownOption>}
      </DropdownMenu>}
      {error && <FieldError>{error}</FieldError>}
    </Dropdown>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ name: '', emailLocal: '', emailDomain: '', phone: '', departmentId: '', position: '', password: '', passwordConfirm: '', terms: false, privacy: false })
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  const [departmentsError, setDepartmentsError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ValidatableField, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [signupResult, setSignupResult] = useState<{ employee_code: string; email: string; message: string } | null>(null)

  async function loadDepartments() {
    setDepartmentsLoading(true)
    setDepartmentsError(null)
    try {
      setDepartments(await fetchPublicDepartments())
    } catch (reason) {
      setDepartmentsError(reason instanceof Error ? reason.message : '부서 목록을 불러오지 못했습니다.')
    } finally {
      setDepartmentsLoading(false)
    }
  }

  useEffect(() => { void loadDepartments() }, [])

  const update = (key: keyof typeof form, value: string | boolean) => {
    const normalizedValue = key === 'phone' && typeof value === 'string'
      ? formatPhone(value)
      : key === 'emailLocal' && typeof value === 'string'
        ? sanitizeEmailLocal(value)
        : key === 'emailDomain' && typeof value === 'string'
          ? sanitizeEmailDomain(value)
          : value
    const nextForm = { ...form, [key]: normalizedValue } as FormState
    setForm(nextForm)
    setError(null)
  }

  const validateForm = () => {
    const fields: ValidatableField[] = ['name', 'email', 'phone', 'departmentId', 'position', 'password', 'passwordConfirm']
    const nextErrors = fields.reduce<Partial<Record<ValidatableField, string>>>((current, field) => {
      const value = field === 'email' ? composeEmail(form) : form[field]
      const validation = validateField(field, value, form)
      if (validation) current[field] = validation
      return current
    }, {})
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (!validateForm()) return
    if (!form.terms || !form.privacy) return setError('서비스 이용약관과 개인정보 수집·이용에 모두 동의해주세요.')
    setSubmitting(true)
    setError(null)
    try {
      const response = await signup({
        name: form.name.trim(),
        email: composeEmail(form).trim().toLowerCase(),
        phone: form.phone,
        department_id: Number(form.departmentId),
        position: form.position as SignupPosition,
        password: form.password,
        terms_agreed: form.terms,
        privacy_agreed: form.privacy,
      })
      setSignupResult({ employee_code: response.employee_code, email: response.email, message: response.message })
    } catch (reason) {
      if (reason instanceof ApiError) {
        const messages: Record<string, string> = {
          EMAIL_ALREADY_REGISTERED: '이미 가입 신청 또는 등록된 회사 이메일입니다.',
          SIGNUP_PENDING_APPROVAL: '이미 관리자 승인 대기 중인 가입 신청이 있습니다.',
          SIGNUP_REJECTED: '기존 가입 신청이 거절된 상태입니다. 관리자에게 문의해주세요.',
        }
        setError((reason.code && messages[reason.code]) || reason.message)
      } else {
        setError(reason instanceof Error ? reason.message : '가입 신청에 실패했습니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (signupResult) {
    return (
      <LoginScreen>
        <LoginCard>
          <SignupHeader><span>DATA FORGE</span><Title>가입 신청 완료</Title><SignupNote>관리자 승인 후 서비스를 이용할 수 있습니다.</SignupNote></SignupHeader>
          <SuccessBox>
            <strong>관리자 승인 후 로그인할 수 있습니다.</strong>
            <p>{signupResult.message}</p>
            <p>신청 번호: {signupResult.employee_code} · {signupResult.email}</p>
          </SuccessBox>
          <PrimaryButton type="button" onClick={() => navigate('/login')}>로그인으로 돌아가기</PrimaryButton>
        </LoginCard>
      </LoginScreen>
    )
  }

  return (
    <LoginScreen>
      <LoginCard>
        <SignupHeader>
          <BackLink to="/login">← 로그인으로 돌아가기</BackLink>
          <span>DATA FORGE</span>
          <Title>회원가입 신청</Title>
          <SignupNote>포트폴리오 데모 임직원 정보를 입력해 가입을 신청하세요. 관리자 승인 후 서비스를 이용할 수 있습니다.</SignupNote>
        </SignupHeader>
        <Form onSubmit={handleSubmit}>
          <SignupSection>
            <SectionTitle>기본 정보</SectionTitle>
            <FormGrid>
              <Field>이름<Input $invalid={Boolean(fieldErrors.name)} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="홍길동" autoComplete="name" maxLength={50} aria-invalid={Boolean(fieldErrors.name)} />{fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}<FieldHint>{form.name.length}/50자</FieldHint></Field>
              <Field>휴대폰 번호<Input $invalid={Boolean(fieldErrors.phone)} type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="010-0000-0000" autoComplete="tel" maxLength={13} inputMode="tel" aria-invalid={Boolean(fieldErrors.phone)} />{fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}</Field>
            </FormGrid>
          </SignupSection>
          <SignupSection>
            <SectionTitle>소속 정보</SectionTitle>
            <FormGrid>
              <Field $wide>회사 이메일<EmailInputRow $invalid={Boolean(fieldErrors.email)}><EmailInput type="text" value={form.emailLocal} onChange={(event) => update('emailLocal', event.target.value)} placeholder="name" autoComplete="username" maxLength={64} inputMode="email" autoCapitalize="none" spellCheck={false} aria-label="이메일 아이디" aria-invalid={Boolean(fieldErrors.email)} /><EmailAt>@</EmailAt><EmailInput type="text" value={form.emailDomain} onChange={(event) => update('emailDomain', event.target.value)} placeholder="example.com" autoComplete="off" maxLength={255} inputMode="url" autoCapitalize="none" spellCheck={false} aria-label="이메일 도메인" aria-invalid={Boolean(fieldErrors.email)} /></EmailInputRow>{fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}</Field>
              <FieldDropdown label="부서" value={form.departmentId} options={departments.map((department) => ({ value: String(department.id), label: department.name }))} placeholder={departmentsLoading ? '부서 목록을 불러오는 중...' : '부서를 선택하세요'} searchable disabled={departmentsLoading || Boolean(departmentsError)} invalid={Boolean(fieldErrors.departmentId)} error={fieldErrors.departmentId} onChange={(value) => update('departmentId', value)} />
              <FieldDropdown label="직급" value={form.position} options={positions} placeholder="직급을 선택하세요" invalid={Boolean(fieldErrors.position)} error={fieldErrors.position} onChange={(value) => update('position', value)} />
            </FormGrid>
          </SignupSection>
          <SignupSection>
            <SectionTitle>계정 정보</SectionTitle>
            <FormGrid>
              <Field>비밀번호<Input $invalid={Boolean(fieldErrors.password)} type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="12자 이상" autoComplete="new-password" maxLength={64} aria-invalid={Boolean(fieldErrors.password)} /><PasswordRules><PasswordRule $valid={passwordState(form.password).length}>12~64자</PasswordRule><PasswordRule $valid={passwordState(form.password).uppercase}>대문자</PasswordRule><PasswordRule $valid={passwordState(form.password).lowercase}>소문자</PasswordRule><PasswordRule $valid={passwordState(form.password).number}>숫자</PasswordRule><PasswordRule $valid={passwordState(form.password).special}>특수문자</PasswordRule></PasswordRules>{fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}</Field>
              <Field>비밀번호 확인<Input $invalid={Boolean(fieldErrors.passwordConfirm)} type="password" value={form.passwordConfirm} onChange={(event) => update('passwordConfirm', event.target.value)} placeholder="비밀번호 재입력" autoComplete="new-password" maxLength={64} aria-invalid={Boolean(fieldErrors.passwordConfirm)} />{fieldErrors.passwordConfirm && <FieldError>{fieldErrors.passwordConfirm}</FieldError>}</Field>
            </FormGrid>
          </SignupSection>
          {departmentsError && <ErrorText role="alert">{departmentsError} <button type="button" onClick={() => void loadDepartments()}>다시 시도</button></ErrorText>}
          <SignupNote>비밀번호는 대문자·소문자·숫자·특수문자를 각각 포함해야 합니다.</SignupNote>
          <ConsentBox>
            <ConsentLabel><input type="checkbox" checked={form.terms} onChange={(event) => update('terms', event.target.checked)} /> <span><strong>[필수]</strong> 서비스 이용약관에 동의합니다.</span> <LegalLink to="/legal/terms">전문 보기</LegalLink></ConsentLabel>
            <ConsentDetails>서비스 이용 조건, 계정 관리, 관리자 승인, 권한 범위 및 이용 제한을 안내합니다.</ConsentDetails>
            <ConsentLabel><input type="checkbox" checked={form.privacy} onChange={(event) => update('privacy', event.target.checked)} /> <span><strong>[필수]</strong> 개인정보 수집·이용에 동의합니다.</span> <LegalLink to="/legal/privacy">전문 보기</LegalLink></ConsentLabel>
            <ConsentDetails>항목: 이름·회사 이메일·휴대폰·부서·직급·동의 IP · 근거: 필수 동의·서비스 이용계약 · 목적: 가입 심사·계정 인증·권한·보안 운영 · 보유기간: 신청 1년, 계정·동의 이력 3년 · 거부 시 회원가입 제한</ConsentDetails>
          </ConsentBox>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <PrimaryButton type="submit" disabled={submitting || departmentsLoading}>{submitting ? '가입 신청 중...' : '가입 신청하기'}</PrimaryButton>
        </Form>
      </LoginCard>
    </LoginScreen>
  )
}
