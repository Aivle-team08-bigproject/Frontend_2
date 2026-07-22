import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const SplitGrid = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  width: 100%;
`

export const LeftCol = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
`

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 580px;
  flex-shrink: 0;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 28px;
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

export const CardTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const DownloadLink = styled.button`
  display: flex;
  padding: 6px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`

export const DataTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`

export const THead = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 16px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textSecondary};
`

export const TRow = styled.div`
  display: flex;
  width: 100%;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.border};
  font-size: 14px;
  color: ${colors.text};

  &:last-child {
    border-bottom: none;
  }
`

export const TCell = styled.p<{ $strong?: boolean }>`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
`

export const ReportViewer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
`

export const ReportHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

export const ReportTitle = styled.p`
  margin: 0;
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
`

export const ReportMeta = styled.p`
  margin: 0;
  width: 100%;
  font-size: 12px;
  color: #6c757d;
`

export const ReportBody = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
`

export const SummaryText = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
`

export const SummaryHeading = styled.p`
  margin: 0;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`

export const SummaryLine = styled.p`
  margin: 0;
  width: 100%;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.textSecondary};
`

export const MiniChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 140px;
  flex-shrink: 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
`

export const Bar = styled.div<{ $height: number; $highlight: boolean }>`
  width: 28px;
  height: ${({ $height }) => `${$height}px`};
  border-radius: 4px 4px 0 0;
  background: ${({ $highlight }) => ($highlight ? colors.flowPrimary : colors.border)};
`

export const BarLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textSecondary};
  white-space: nowrap;
`

export const ViewFullReport = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  padding: 0;
  color: ${colors.flowPrimary};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`

export const ArrowIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  font-size: 14px;
`

export const InfoRowEl = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${({ $last }) => ($last ? '0' : '12px')};
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${colors.border}`)};
`

export const InfoLabel = styled.p`
  margin: 0;
  color: #6c757d;
`

export const InfoValue = styled.p`
  margin: 0;
  font-weight: 600;
  color: ${colors.text};
`

export const FeedbackTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.text};
  resize: none;

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.flowPrimary};
  }
`

export const FeedbackActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`

export const ResubmitButton = styled.button`
  display: flex;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${colors.flowPrimary};
  color: ${colors.white};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const BottomActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 16px;
`

export const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  padding: 0;
  color: #6c757d;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`

export const RightActions = styled.div`
  display: flex;
  gap: 12px;
`

export const RecutButton = styled.button`
  display: flex;
  padding: 12px 24px;
  border: 1px solid ${colors.flowPrimary};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.flowPrimary};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const ApproveButton = styled.button`
  display: flex;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  background: ${colors.flowPrimary};
  color: ${colors.white};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`
