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

export const ActionLink = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.primary};
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

export const SortBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SortChip = styled.button`
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

export const SortChipIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  overflow: hidden;
`

export const TableHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 16px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textSecondary};
`

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TableRowEl = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`

export const Cell = styled.p<{ $width?: number; $flex?: boolean }>`
  margin: 0;
  flex-shrink: 0;
  width: ${({ $width, $flex }) => ($flex ? undefined : $width ? `${$width}px` : undefined)};
  flex: ${({ $flex }) => ($flex ? '1 0 0' : undefined)};
  min-width: ${({ $flex }) => ($flex ? '0' : undefined)};
  overflow: ${({ $flex }) => ($flex ? 'hidden' : undefined)};
  text-overflow: ${({ $flex }) => ($flex ? 'ellipsis' : undefined)};
  white-space: nowrap;
  font-size: 13px;
`

export const ReqIdCell = styled(Cell)`
  color: ${colors.primary};
  font-weight: 700;
  text-decoration: underline;
`

export const StrongCell = styled(Cell)`
  color: ${colors.text};
  font-weight: 700;
`

export const MutedCell = styled(Cell)`
  color: ${colors.textMuted};
`

export const StatusCell = styled.div<{ $width: number }>`
  display: flex;
  flex-shrink: 0;
  width: ${({ $width }) => `${$width}px`};
`

export const Pagination = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const PageNav = styled.button`
  display: flex;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const NavIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const PageNumbers = styled.div`
  display: flex;
  gap: 4px;
`

export const PageNumber = styled.button<{ $active: boolean }>`
  display: flex;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : colors.border)};
  background: ${({ $active }) => ($active ? colors.primary : colors.white)};
  color: ${({ $active }) => ($active ? '#000' : colors.textSecondary)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`
