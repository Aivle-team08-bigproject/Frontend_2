import styled from 'styled-components'
import { colors } from './theme'

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
  overflow-x: auto;
  overflow-y: hidden;
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
  min-width: 1000px;
  white-space: nowrap;
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
  min-width: 1000px;

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
  color: ${colors.textSecondary};
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

export const StatusPill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
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
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.border)};
  background: ${colors.white};
  color: ${({ $active }) => ($active ? colors.primary : colors.textSecondary)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`
