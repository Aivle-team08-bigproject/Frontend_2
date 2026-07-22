import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 480px;
  flex-shrink: 0;
`

export const SummaryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const RowLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`

export const RowValue = styled.p`
  margin: 0;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.text};
`

export const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const ColumnItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
`

export const ColumnTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  white-space: nowrap;
`

export const ColumnName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`

export const ColumnType = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.flowPrimary};
`

export const ColumnDescription = styled.p`
  margin: 0;
  width: 100%;
  font-size: 13px;
  color: ${colors.textSecondary};
`

export const ScaleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`

export const ScaleLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`

export const ScaleValue = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
`

export const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

export const OptionGroupLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

export const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

export const RadioIcon = styled.img`
  width: 18px;
  height: 18px;
`

export const RadioEmpty = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border: 2px solid ${colors.textMuted};
  flex-shrink: 0;
`

export const OptionLabel = styled.p<{ $selected: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  color: ${({ $selected }) => ($selected ? colors.text : colors.textSecondary)};
  white-space: nowrap;
`

export const ReviewActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 16px;
`

export const BackButton = styled.button`
  display: flex;
  padding: 12px 24px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 15px;
  font-weight: 600;
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
