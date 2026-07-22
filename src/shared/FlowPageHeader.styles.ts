import styled from 'styled-components'
import { colors } from './theme'

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 40px;
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border};
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`
