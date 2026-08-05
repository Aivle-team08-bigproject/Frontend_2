import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { colors } from './theme'

export const Bar = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 16px 40px;
  border-top: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textMuted};
  font-size: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;

  @media print {
    display: none;
  }

  @media (max-width: 900px) {
    padding: 16px 24px;
  }

  @media (max-width: 600px) {
    padding: 16px 16px;
  }
`

export const Copyright = styled.span`
  white-space: nowrap;
`

export const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const FooterLink = styled(Link)`
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;

  &[aria-current='page'] {
    color: ${colors.primary};
  }

  &:hover {
    text-decoration: underline;
  }
`
