import styled from 'styled-components'
import { colors } from './theme'

export const ProcessCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const AccentBar = styled.div`
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: ${colors.flowPrimary};
`

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const StatusBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const TimelineItemEl = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
`

export const IndicatorCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
`

export const Circle = styled.div<{ $state: 'done' | 'active' | 'failed' | 'pending' }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: ${({ $state }) =>
    $state === 'done'
      ? '#22c55e'
      : $state === 'active'
        ? '#eab308'
        : $state === 'failed'
          ? colors.danger
          : colors.border};
`

export const CheckIcon = styled.img`
  width: 12px;
  height: 12px;
`

export const ActiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.white};
`

export const FailedMark = styled.span`
  color: ${colors.white};
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
`

export const ConnectorLine = styled.div`
  width: 2px;
  flex: 1 0 0;
  min-height: 12px;
  background: ${colors.border};
  margin-top: 4px;
`

export const TextCol = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  white-space: nowrap;
`

export const ItemTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
`

export const ItemTime = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const ItemDescription = styled.p`
  margin: 0;
  width: 100%;
  font-size: 13px;
  color: ${colors.textSecondary};
`
