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
  min-width: 0;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 900px) {
    padding: 16px 24px;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${colors.bg};
  }
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex-wrap: wrap;
`

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: ${colors.text};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
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
