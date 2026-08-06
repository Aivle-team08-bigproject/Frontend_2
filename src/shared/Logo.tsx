import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { logoWordmarkSrc } from './brand'
import { colors } from './theme'

const sizeHeight = {
  sm: 30,
  md: 40,
}

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 4px;
    border-radius: 6px;
  }
`

export default function Logo({ size = 'md', to = '/dashboard' }: { size?: 'sm' | 'md'; to?: string }) {
  return (
    <LogoLink to={to} aria-label="하나 데이터 플랫폼으로 이동">
      <img src={logoWordmarkSrc} alt="하나 데이터 플랫폼" height={sizeHeight[size]} />
    </LogoLink>
  )
}
