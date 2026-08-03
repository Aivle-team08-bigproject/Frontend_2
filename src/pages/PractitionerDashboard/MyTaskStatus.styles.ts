import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  background: ${colors.bgTint};
  border: 1px solid ${colors.primary};
  min-width: 0;
  flex-wrap: wrap;
  gap: 20px;
`

export const ProfileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
`

export const AvatarLg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
`

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const UserNameText = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const RoleBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid ${colors.primary};
  background: transparent;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`

export const UserMeta = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.textSecondary};
  white-space: nowrap;

  strong {
    font-weight: 700;
  }
`

export const QuickStats = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const StatItemLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
  white-space: nowrap;
`

export const StatItemValue = styled.p<{ $color: string }>`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

export const CardsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const CardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const TaskCard = styled.div<{ $urgent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
  background: ${colors.white};
  border-top: 1px solid ${({ $urgent }) => ($urgent ? colors.danger : colors.primary)};
  border-right: 1px solid ${({ $urgent }) => ($urgent ? colors.danger : colors.primary)};
  border-bottom: 1px solid ${({ $urgent }) => ($urgent ? colors.danger : colors.primary)};
  border-left: 6px solid ${({ $urgent }) => ($urgent ? colors.danger : colors.primary)};
  border-radius: 4px 16px 16px 4px;
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;
  gap: 12px;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  min-width: 0;
  flex-wrap: wrap;
`

export const ReqIdText = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${colors.primary};
`

export const ClientText = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${colors.text};
`

export const Divider = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`

export const SummaryText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.textSecondary};
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HeaderBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

export const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const ProgressLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const ProgressValue = styled.p<{ $color: string }>`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const BarTrack = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${colors.bg};
  overflow: hidden;
`

export const BarFill = styled.div<{ $percent: number; $urgent: boolean }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: ${({ $urgent }) => ($urgent ? colors.danger : colors.primary)};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;
  gap: 12px;
`

export const FooterLeft = styled.div`
  display: flex;
  gap: 16px;
  white-space: nowrap;
  min-width: 0;
  flex-wrap: wrap;
`

export const FooterDate = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`

export const FooterDue = styled.p<{ $color: string }>`
  margin: 0;
  font-size: 13px;
  font-weight: ${({ $color }) => ($color === colors.danger ? 700 : 400)};
  color: ${({ $color }) => $color};
`

export const ActionButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border: 1.5px solid ${colors.primary};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${colors.bgTint};
    outline: none;
  }
`
