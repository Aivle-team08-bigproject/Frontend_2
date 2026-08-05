import { useLocation } from 'react-router-dom'
import { Bar, Copyright, FooterLink, Links } from './Footer.styles'

export default function Footer() {
  const { pathname } = useLocation()

  return (
    <Bar>
      <Copyright>© 2026 하나카드. 하나 데이터 플랫폼</Copyright>
      <Links aria-label="약관 및 정책">
        <FooterLink to="/legal/terms" aria-current={pathname === '/legal/terms' ? 'page' : undefined}>
          서비스 이용약관
        </FooterLink>
        <FooterLink to="/legal/privacy" aria-current={pathname === '/legal/privacy' ? 'page' : undefined}>
          개인정보 처리방침
        </FooterLink>
      </Links>
    </Bar>
  )
}
