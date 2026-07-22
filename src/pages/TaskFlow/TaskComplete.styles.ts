import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const CardTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const MilestoneRow = styled.div`
  display: flex;
  gap: 24px;
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

export const Circle = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #22c55e;
`

export const CheckIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const ConnectorLine = styled.div`
  width: 2px;
  flex: 1 0 0;
  min-height: 16px;
  background: ${colors.border};
  margin-top: 4px;
`

export const MilestoneText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 24px;
  white-space: nowrap;
`

export const MilestoneTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const MilestoneTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${colors.text};
`

export const MilestoneTime = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const MilestoneDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textSecondary};
`

export const DeliveryRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
`

export const DeliveryCol = styled.div`
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
  gap: 10px;
`

export const IconBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${colors.flowPrimaryBg};
  flex-shrink: 0;
`

export const IconImg = styled.img`
  width: 18px;
  height: 18px;
`

export const ColTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
  white-space: nowrap;
`

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.bg};
`

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FileIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const FileName = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.text};
  white-space: nowrap;
`

export const FileSize = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${colors.textMuted};
  white-space: nowrap;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

export const FieldLabel = styled.p`
  margin: 0;
  width: 100%;
  font-size: 11px;
  color: ${colors.textMuted};
`

export const FieldValueBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background: ${colors.bg};
`

export const FieldValue = styled.p`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: ${colors.text};
`

export const CopyIcon = styled.img`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
`

export const RegisteredBadge = styled.span`
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${colors.flowPrimaryBg};
  color: ${colors.flowPrimary};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`

export const InputBox = styled.div`
  display: flex;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${colors.border};
  font-size: 12px;
  color: ${colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CustomRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  border: none;
  border-top: 1px solid ${colors.border};
  border-bottom: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
`

export const CustomRowLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textSecondary};
`

export const PlusIcon = styled.img`
  width: 12px;
  height: 12px;
`

export const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: ${colors.flowPrimary};
  color: ${colors.white};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const BottomActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding-top: 16px;
`

export const GoDashboardButton = styled.button`
  display: flex;
  padding: 14px 40px;
  border: 1px solid ${colors.textSecondary};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const NewTaskButton = styled.button`
  display: flex;
  padding: 14px 48px;
  border: none;
  border-radius: 8px;
  background: ${colors.flowPrimary};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`
