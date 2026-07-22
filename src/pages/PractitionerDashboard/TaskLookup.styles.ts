import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const ContextBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;
  background: ${colors.white};
  border-radius: 4px 12px 12px 4px;
`

export const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ErrorIconCircle = styled.div`
  display: flex;
  padding: 6px;
  border-radius: 100px;
  background: ${colors.dangerBg};
`

export const ErrorIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const BannerTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
`

export const BannerTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${colors.text};
`

export const BannerDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textSecondary};
`

export const ClearButton = styled.button`
  display: flex;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: ${colors.bg};
  cursor: pointer;
`

export const ClearIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const ResultsCountHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ResultsTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const InTableSortBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
`

export const CountBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${colors.bgTint};
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`
