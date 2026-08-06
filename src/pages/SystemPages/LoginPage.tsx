import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError, login } from '../../shared/api'
import { saveAccessToken } from '../../shared/auth'
import Logo from '../../shared/Logo'
import {
  Brand,
  ErrorText,
  Field,
  Form,
  FormMeta,
  HelperText,
  Icon,
  Input,
  InputWrap,
  LegalLink,
  LoginBody,
  LoginButton,
  LoginCard,
  LoginScreen,
  RememberLabel,
  SignupLink,
  Subtitle,
  TextButton,
} from './LoginPage.styles'

function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.7"/><path d="M3.75 15c0-3.1 2.35-5.25 5.25-5.25S14.25 11.9 14.25 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
}

function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="3.5" y="7.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><path d="M6 7.5V5.75a3 3 0 0 1 6 0V7.5M9 11v1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const response = await login(email.trim().toLowerCase(), password, rememberMe)
      saveAccessToken(response.access_token, rememberMe)
      navigate(destination, { replace: true })
    } catch (reason) {
      if (reason instanceof ApiError) {
        const messages: Record<string, string> = {
          SIGNUP_PENDING_APPROVAL: '가입 신청이 관리자 승인 대기 중입니다.',
          SIGNUP_REJECTED: '가입 신청이 거절되었습니다. 관리자에게 문의해주세요.',
          ACCOUNT_LOCKED: '계정이 잠겼습니다. 관리자에게 문의해주세요.',
          ACCOUNT_DISABLED: '사용할 수 없는 계정입니다. 관리자에게 문의해주세요.',
          INVALID_CREDENTIALS: '회사 이메일 또는 비밀번호를 확인해주세요.',
        }
        setError((reason.code && messages[reason.code]) || reason.message)
      } else {
        setError(reason instanceof Error ? reason.message : '로그인에 실패했습니다.')
      }
      setSubmitting(false)
    }
  }

  return (
    <LoginScreen>
      <LoginBody>
        <LoginCard>
          <Brand>
            <Logo size="md" to="/login" />
            <Subtitle>실무자 관리 시스템 • Operator Platform</Subtitle>
          </Brand>
          <Form onSubmit={handleSubmit}>
            <Field>
              회사 이메일
              <InputWrap><Icon><UserIcon /></Icon><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@hanacard.co.kr" autoComplete="username" /></InputWrap>
            </Field>
            <Field>
              비밀번호
              <InputWrap><Icon><LockIcon /></Icon><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••••" autoComplete="current-password" /></InputWrap>
            </Field>
            <FormMeta>
              <RememberLabel><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />로그인 상태 유지</RememberLabel>
              <TextButton type="button" onClick={() => setError('비밀번호 재설정은 관리자에게 문의해주세요.')}>비밀번호를 잊으셨나요?</TextButton>
            </FormMeta>
            {error && <ErrorText role="alert">{error}</ErrorText>}
            <LoginButton type="submit" disabled={submitting || !email.trim() || !password}>{submitting ? '로그인 중...' : '로그인'}</LoginButton>
            <SignupLink type="button" onClick={() => navigate('/signup')}>회원가입 신청</SignupLink>
            <HelperText><LegalLink to="/legal/terms">서비스 이용약관</LegalLink> · <LegalLink to="/legal/privacy">개인정보 처리방침</LegalLink></HelperText>
          </Form>
        </LoginCard>
      </LoginBody>
    </LoginScreen>
  )
}
