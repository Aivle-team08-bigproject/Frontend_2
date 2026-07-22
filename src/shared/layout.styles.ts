import styled from 'styled-components'
import { colors } from './theme'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  min-height: 100vh;
  background: ${colors.bg};
`

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  padding: 40px;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const SectionTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.02);
`

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${colors.textMuted};
    cursor: not-allowed;
  }
`

export const OutlineButton = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1.5px solid ${({ $color }) => $color ?? colors.primary};
  border-radius: 8px;
  background: ${colors.white};
  color: ${({ $color }) => $color ?? colors.primary};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const GhostButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`
