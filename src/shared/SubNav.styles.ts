import styled from 'styled-components'
import { colors } from './theme'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  padding: 0 40px;
  background: ${colors.bgTint};
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
`

export const Tab = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  cursor: pointer;
`

export const TabLabel = styled.p<{ $active: boolean }>`
  margin: 0;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? '#000' : colors.textSecondary)};
  white-space: nowrap;
`
