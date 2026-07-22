import { useNavigate } from 'react-router-dom'
import {
  ErrorActions,
  ErrorCode,
  ErrorContent,
  ErrorDescription,
  ErrorHeader,
  ErrorReference,
  ErrorScreen,
  ErrorTitle,
  GridIcon,
  HeaderBrand,
  HeaderMark,
  Illustration,
  PrimaryAction,
  SecondaryAction,
  SecurityArea,
  SupportText,
} from './ErrorPage.styles'

function Header() {
  return <ErrorHeader><HeaderBrand><HeaderMark />하나 데이터마켓</HeaderBrand><SecurityArea>Internal Security Area</SecurityArea></ErrorHeader>
}

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <ErrorScreen>
      <Header />
      <ErrorContent>
        <Illustration><GridIcon><span /><span /><span /><span /></GridIcon></Illustration>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
        <ErrorDescription>요청하신 페이지가 존재하지 않거나 잘못된 경로로 접근하셨습니다.</ErrorDescription>
        <ErrorActions>
          <PrimaryAction type="button" onClick={() => navigate('/dashboard')}>홈으로 돌아가기</PrimaryAction>
          <SecondaryAction type="button" onClick={() => navigate(-1)}>이전 페이지</SecondaryAction>
        </ErrorActions>
      </ErrorContent>
    </ErrorScreen>
  )
}

export function ServerErrorPage() {
  const navigate = useNavigate()
  return (
    <ErrorScreen>
      <Header />
      <ErrorContent>
        <Illustration $danger><svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="#dc2626"/><path d="M26 14 36.5 34H15.5L26 14Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M26 21v6M26 31h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg></Illustration>
        <ErrorCode $danger>500</ErrorCode>
        <ErrorTitle>서버 오류가 발생했습니다</ErrorTitle>
        <ErrorDescription>일시적인 내부 서버 장애가 발생했습니다. 담당자가 신속히 파악하고 수정 중입니다.</ErrorDescription>
        <ErrorReference>오류 코드: <strong>ERR-2024-XH92</strong></ErrorReference>
        <ErrorActions>
          <PrimaryAction type="button" onClick={() => navigate('/dashboard')}>홈으로 돌아가기</PrimaryAction>
          <SecondaryAction $danger type="button" onClick={() => window.location.reload()}>다시 시도</SecondaryAction>
        </ErrorActions>
        <SupportText>문제가 지속되면 개발팀에 문의하세요 <a href="mailto:dev@example.com">dev@example.com</a></SupportText>
      </ErrorContent>
    </ErrorScreen>
  )
}
