import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: stretch;
  width: 100%;
`

export const StatCardEl = styled.div<{ $highlight?: boolean }>`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ $highlight }) => ($highlight ? 'transparent' : colors.border)};
  background: ${({ $highlight }) => ($highlight ? colors.primary : colors.white)};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.02);
`

export const StatLabel = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $highlight }) => ($highlight ? 'rgba(255,255,255,0.7)' : colors.textSecondary)};
`

export const StatNumbers = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

export const StatValue = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: ${({ $highlight }) => ($highlight ? '#000' : colors.text)};
`

export const StatUnit = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? 'rgba(255,255,255,0.7)' : colors.textMuted)};
`

export const StatCaption = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${({ $highlight }) => ($highlight ? 'rgba(255,255,255,0.7)' : colors.textMuted)};
`

export const AlertsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const AlertBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${colors.dangerBg};
  color: ${colors.danger};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const AlertsRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
`

export const WarningCardEl = styled.div<{ $urgent?: boolean }>`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  background: ${colors.white};
  border: ${({ $urgent }) => ($urgent ? `1.5px solid ${colors.danger}` : `1px solid ${colors.border}`)};
`

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const WarningTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const CountBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const WarningDesc = styled.p`
  margin: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: ${colors.textSecondary};
`

export const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const FootNote = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const ActionLink = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 3px;
    border-radius: 2px;
  }
`

export const InsightRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: stretch;
  width: 100%;
`

export const InsightCol = styled.div`
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

export const ColHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const ColHeaderTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
`

export const ColHeaderMeta = styled.p<{ $danger?: boolean }>`
  margin: 0;
  font-size: 12px;
  font-weight: ${({ $danger }) => ($danger ? 700 : 400)};
  color: ${({ $danger }) => ($danger ? colors.danger : colors.textMuted)};
`

export const ListCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

export const RankedRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.bg};
`

export const RankNumber = styled.p`
  margin: 0;
  width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: ${colors.primary};
`

export const ItemTexts = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`

export const ItemTitle = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
`

export const ItemSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const SmallTag = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const SupplementRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
`

export const TableSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

export const FilterGroup = styled.div`
  position: relative;
`

export const FilterMenu = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  right: 0;
  display: flex;
  min-width: 164px;
  max-height: 280px;
  overflow-y: auto;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background: ${colors.white};
  box-shadow: 0 10px 28px rgba(15, 90, 82, 0.14);
`

export const FilterOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 7px;
  background: ${({ $selected }) => ($selected ? '#e6f3f3' : 'transparent')};
  color: ${({ $selected }) => ($selected ? colors.primary : colors.textSecondary)};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: #e6f3f3;
    outline: none;
  }
`

export const FilterSummary = styled.span`
  align-self: center;
  margin-left: 4px;
  color: ${colors.textMuted};
  font-size: 12px;
  white-space: nowrap;
`

export const ClearFilters = styled.button`
  align-self: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const EmptyState = styled.div`
  display: flex;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  color: ${colors.textMuted};
  font-size: 14px;
`
