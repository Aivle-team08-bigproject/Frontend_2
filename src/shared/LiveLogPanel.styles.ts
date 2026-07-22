import styled from 'styled-components'
import { colors } from './theme'

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 420px;
  flex-shrink: 0;
`

export const LogCardEl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 640px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const LogHeader = styled.div`
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

export const LiveDot = styled.img`
  width: 8px;
  height: 8px;
`

export const LogTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const RefreshGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const RefreshIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const RefreshLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
  white-space: nowrap;
`

export const Terminal = styled.div`
  display: flex;
  flex: 1 0 0;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background: #1e1e1e;
  overflow-y: auto;
`

export const LogLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  white-space: nowrap;
`

export const LogTime = styled.p`
  margin: 0;
  color: #7c7c7c;
`

export const AgentTag = styled.p<{ $color: string }>`
  margin: 0;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const LogMessage = styled.p`
  margin: 0;
  width: 100%;
  font-size: 12px;
  line-height: 1.4;
  color: #e1e1e1;
`

export const ProgressActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const RefreshNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const RefreshNoticeLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textSecondary};
  white-space: nowrap;
`

export const CancelButton = styled.button`
  display: flex;
  padding: 10px 16px;
  border: 1px solid ${colors.danger};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.danger};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`
