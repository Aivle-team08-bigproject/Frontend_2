import styled from 'styled-components'
import { colors, shadow } from '../../shared/theme'

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
  border: ${({ $highlight }) => ($highlight ? `1.5px solid ${colors.primary}` : `1px solid ${colors.border}`)};
  background: ${colors.white};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.02);
`

export const StatLabel = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $highlight }) => ($highlight ? colors.primary : colors.textSecondary)};
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
  color: ${({ $highlight }) => ($highlight ? colors.primary : colors.text)};
`

export const StatUnit = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? colors.textSecondary : colors.textMuted)};
`

export const StatCaption = styled.p<{ $highlight?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${({ $highlight }) => ($highlight ? colors.textSecondary : colors.textMuted)};
`

export const FootNote = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
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

export const WorkArea = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const WorkPanel = styled.section`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background: ${colors.white};
`

export const LatestNoticeBanner = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-width: 0;
  padding: 14px 18px;
  border: 1px solid #b7dddd;
  border-radius: 12px;
  background: #eef9f8;
  color: ${colors.text};
  text-align: left;
  cursor: pointer;

  &:hover, &:focus-visible { border-color: ${colors.primary}; outline: none; }
`

export const LatestNoticeLabel = styled.span`
  flex: 0 0 auto;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 800;
`

export const LatestNoticeTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  flex: 1 1 auto;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const LatestNoticeDate = styled.span`
  flex: 0 0 auto;
  color: ${colors.textMuted};
  font-size: 12px;
  white-space: nowrap;
`

export const LatestNoticeMore = styled.span`
  flex: 0 0 auto;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const QueueList = styled.div`
  display: flex;
  min-height: 240px;
  flex-direction: column;
  gap: 10px;
`

export const QueueItemRow = styled.button`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background: ${colors.white};
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${colors.flowPrimaryBg};
  }
`

export const QueueRank = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 12px;
  font-weight: 800;
`

export const QueueTexts = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`

export const QueueTitle = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const QueueMeta = styled.span`
  overflow: hidden;
  color: ${colors.textMuted};
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const QueueAction = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 7px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CalendarMonth = styled.h3`
  margin: 0;
  color: ${colors.text};
  font-size: 20px;
  font-weight: 800;
`

export const CalendarNav = styled.div`
  display: flex;
  gap: 4px;
`

export const CalendarNavButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${colors.border};
  border-radius: 7px;
  background: ${colors.white};
  color: ${colors.primary};
  font-size: 18px;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${colors.primary};
    outline: none;
  }
`

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  /* 요일 라벨 줄(auto) + 항상 6주치 날짜 줄. 날짜 줄 높이를 고정해야
     달 끝자락 빈 칸이 있는 줄이 찌그러져서 달마다 카드 높이가 흔들리는 걸 막는다. */
  grid-template-rows: auto repeat(6, minmax(48px, auto));
  gap: 4px;
`

export const CalendarWeekday = styled.span`
  padding: 4px 0;
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  text-align: center;
`

export const CalendarDayCell = styled.div`
  position: relative;
`

export const CalendarDay = styled.button<{ $muted?: boolean; $today?: boolean; $hasEvent?: boolean }>`
  width: 100%;
  position: relative;
  min-height: 48px;
  padding: 7px 5px;
  border: 1px solid ${({ $today }) => ($today ? colors.primary : colors.border)};
  border-radius: 8px;
  background: ${({ $today }) => ($today ? colors.flowPrimaryBg : colors.white)};
  color: ${({ $muted }) => ($muted ? colors.textMuted : colors.text)};
  font-size: 12px;
  text-align: left;
  cursor: ${({ $hasEvent }) => ($hasEvent ? 'pointer' : 'default')};

  &:hover,
  &:focus-visible {
    border-color: ${({ $hasEvent }) => ($hasEvent ? colors.primary : colors.border)};
    outline: none;
  }
`

export const CalendarEventDots = styled.span`
  display: flex;
  gap: 3px;
  margin-top: 5px;
`

export const CalendarEventDot = styled.span<{ $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

export const CalendarPopover = styled.div<{ $visible: boolean }>`
  position: fixed;
  z-index: 20;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: ${shadow.card};
`

export const CalendarPopoverHeader = styled.p`
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 800;
  color: ${colors.text};
`

export const CalendarPopoverItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${colors.bg};
    outline: none;
  }
`

export const CalendarPopoverDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  margin-top: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

export const CalendarPopoverText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

export const CalendarPopoverLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.textMuted};
`

export const CalendarPopoverTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CalendarPopoverMeta = styled.span`
  font-size: 11px;
  color: ${colors.textSecondary};
`

export const CalendarLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  color: ${colors.textSecondary};
  font-size: 11px;
`

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`

export const LegendDot = styled.span<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`
