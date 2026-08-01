import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BackLink,
  ConsentBox,
  ConsentDetails,
  ConsentLabel,
  ErrorText,
  Field,
  Form,
  FormGrid,
  Input,
  LoginCard,
  LoginScreen,
  PrimaryButton,
  Dropdown,
  DropdownButton,
  DropdownIcon,
  DropdownMenu,
  DropdownSearch,
  DropdownOption,
  DropdownValue,
  SignupHeader,
  SignupNote,
  SuccessBox,
  Title,
  LegalLink,
} from './SignupPage.styles'

const departments = ['데이터기획팀', '마케팅팀', '상품개발팀', 'IT관리팀']
const positions = ['사원', '대리', '과장', '차장', '부장']

function FieldDropdown({ label, value, options, placeholder, searchable, onChange }: { label: string; value: string; options: string[]; placeholder: string; searchable?: boolean; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))

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
      <DropdownButton type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <DropdownValue $selected={Boolean(value)}>{value || placeholder}</DropdownValue>
        <DropdownIcon $open={open}>⌄</DropdownIcon>
      </DropdownButton>
      {open && <DropdownMenu role="listbox" aria-label={`${label} 선택`}>
        {searchable && <DropdownSearch autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="부서명을 검색하세요" aria-label="부서 검색" />}
        {filteredOptions.length ? filteredOptions.map((option) => (
          <DropdownOption key={option} type="button" role="option" aria-selected={value === option} $selected={value === option} onClick={() => { onChange(option); setOpen(false); setQuery('') }}>
            {option}{value === option && <span>✓</span>}
          </DropdownOption>
        )) : <DropdownOption type="button" disabled>검색 결과가 없습니다.</DropdownOption>}
      </DropdownMenu>}
    </Dropdown>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', position: '', password: '', passwordConfirm: '', terms: false, privacy: false })
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (form.name.trim().length < 2) return setError('이름을 2자 이상 입력해주세요.')
    if (!form.email.includes('@')) return setError('회사 이메일을 올바르게 입력해주세요.')
    if (form.phone.replace(/\D/g, '').length < 10) return setError('휴대폰 번호를 올바르게 입력해주세요.')
    if (!form.department || !form.position) return setError('부서와 직급을 선택해주세요.')
    if (form.password.length < 12 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      return setError('비밀번호는 12자 이상이며 대문자·소문자·숫자·특수문자를 포함해야 합니다.')
    }
    if (form.password !== form.passwordConfirm) return setError('비밀번호 확인이 일치하지 않습니다.')
    if (!form.terms || !form.privacy) return setError('서비스 이용약관과 개인정보 수집·이용에 모두 동의해주세요.')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <LoginScreen>
        <LoginCard>
          <SignupHeader><span>HANA CARD</span><Title>가입 신청 완료</Title><SignupNote>목업 신청이 완료되었습니다.</SignupNote></SignupHeader>
          <SuccessBox>
            <strong>관리자 승인 후 로그인할 수 있습니다.</strong>
            <p>실제 API 연동 단계에서 신청 결과와 승인 상태가 연결됩니다.</p>
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
          <span>HANA CARD</span>
          <Title>회원가입 신청</Title>
          <SignupNote>하나카드 임직원 정보를 입력해 가입을 신청하세요. 관리자 승인 후 서비스를 이용할 수 있습니다.</SignupNote>
        </SignupHeader>
        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <Field>이름<Input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="홍길동" autoComplete="name" /></Field>
            <Field>회사 이메일<Input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="name@hanacard.co.kr" autoComplete="email" /></Field>
            <Field>휴대폰 번호<Input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="010-0000-0000" autoComplete="tel" /></Field>
            <FieldDropdown label="부서" value={form.department} options={departments} placeholder="부서를 선택하세요" searchable onChange={(value) => update('department', value)} />
            <FieldDropdown label="직급" value={form.position} options={positions} placeholder="직급을 선택하세요" onChange={(value) => update('position', value)} />
            <Field>비밀번호<Input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="12자 이상" autoComplete="new-password" /></Field>
            <Field>비밀번호 확인<Input type="password" value={form.passwordConfirm} onChange={(event) => update('passwordConfirm', event.target.value)} placeholder="비밀번호 재입력" autoComplete="new-password" /></Field>
          </FormGrid>
          <SignupNote>비밀번호는 대문자·소문자·숫자·특수문자를 각각 포함해야 합니다.</SignupNote>
          <ConsentBox>
            <ConsentLabel><input type="checkbox" checked={form.terms} onChange={(event) => update('terms', event.target.checked)} /> <span><strong>[필수]</strong> 서비스 이용약관에 동의합니다.</span> <LegalLink to="/legal/terms">전문 보기</LegalLink></ConsentLabel>
            <ConsentDetails>서비스 이용 조건, 계정 관리, 관리자 승인, 권한 범위 및 이용 제한을 안내합니다.</ConsentDetails>
            <ConsentLabel><input type="checkbox" checked={form.privacy} onChange={(event) => update('privacy', event.target.checked)} /> <span><strong>[필수]</strong> 개인정보 수집·이용에 동의합니다.</span> <LegalLink to="/legal/privacy">전문 보기</LegalLink></ConsentLabel>
            <ConsentDetails>항목: 이름·회사 이메일·휴대폰·부서·직급·동의 IP · 근거: 필수 동의·서비스 이용계약 · 목적: 가입 심사·계정 인증·권한·보안 운영 · 보유기간: 신청 1년, 계정·동의 이력 3년 · 거부 시 회원가입 제한</ConsentDetails>
          </ConsentBox>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <PrimaryButton type="submit">가입 신청하기</PrimaryButton>
        </Form>
      </LoginCard>
    </LoginScreen>
  )
}
