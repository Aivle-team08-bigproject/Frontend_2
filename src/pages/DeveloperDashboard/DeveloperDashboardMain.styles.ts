import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const TokenSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const Tag = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  background: #e6f3f3;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`

export const PeriodSelector = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  background: ${colors.bg};
`

export const PeriodButton = styled.button<{ $active: boolean }>`
  display: flex;
  padding: 6px 12px;
  border: ${({ $active }) => ($active ? `1px solid ${colors.border}` : 'none')};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? colors.white : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primary : colors.textSecondary)};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  cursor: pointer;
`

export const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
`

export const SummaryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 340px;
  flex-shrink: 0;
`

export const SummaryCardEl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.bg};
`

export const SummaryLabel = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.textSecondary};
`

export const SummaryValueGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

export const SummaryValue = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: ${({ $highlight }) => ($highlight ? colors.primary : colors.text)};
`

export const SummaryUnit = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.textMuted};
`

export const ChartContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
`

export const ChartImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: contain;
  object-position: left;
`

export const XAxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const AgentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const AgentCardsRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: stretch;
  width: 100%;
`

export const AgentCardEl = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const AgentName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const StatusBadge = styled.span<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
`

export const StatusDot = styled.img`
  width: 8px;
  height: 8px;
`

export const StatusLabel = styled.p<{ $color: string }>`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

export const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-size: 13px;
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const MetaLabel = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`

export const MetaValue = styled.p<{ $color?: string }>`
  margin: 0;
  font-weight: 600;
  color: ${({ $color }) => $color ?? colors.text};
`

export const FailureSection = styled.div`
  display: flex;
  gap: 24px;
  align-items: stretch;
  width: 100%;
`

export const FailureChartCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 450px;
  flex-shrink: 0;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const CardHeaderTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
`

export const CardHeaderMeta = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const BarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

export const BarLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
`

export const BarLabel = styled.p`
  margin: 0;
  font-weight: 600;
  color: ${colors.textSecondary};
`

export const BarPercent = styled.p<{ $color: string }>`
  margin: 0;
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

export const BarFill = styled.div<{ $percent: number; $color: string }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: ${({ $color }) => $color};
`

export const RecentFailuresCard = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const LogTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`

export const LogTableHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 12px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textSecondary};
`

export const LogTableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const LogRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`

export const LogCell = styled.p<{ $width?: number; $flex?: boolean }>`
  margin: 0;
  flex-shrink: 0;
  width: ${({ $width, $flex }) => ($flex ? undefined : $width ? `${$width}px` : undefined)};
  flex: ${({ $flex }) => ($flex ? '1 0 0' : undefined)};
  min-width: ${({ $flex }) => ($flex ? '0' : undefined)};
  overflow: ${({ $flex }) => ($flex ? 'hidden' : undefined)};
  text-overflow: ${({ $flex }) => ($flex ? 'ellipsis' : undefined)};
  white-space: nowrap;
  font-size: 13px;
  color: ${colors.textSecondary};
`

export const LogAgentCell = styled(LogCell)`
  color: ${colors.text};
  font-weight: 700;
`

export const SeverityCell = styled.div<{ $width: number }>`
  display: flex;
  flex-shrink: 0;
  width: ${({ $width }) => `${$width}px`};
`

export const SeverityBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`
