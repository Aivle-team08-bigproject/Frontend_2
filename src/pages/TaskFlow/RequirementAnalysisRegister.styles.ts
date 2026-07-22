import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 40px;
`

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

export const InputHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: center;
`

export const InputTitle = styled.p`
  margin: 0;
  width: 100%;
  font-size: 28px;
  font-weight: 800;
  color: ${colors.text};
`

export const InputSubtitle = styled.p`
  margin: 0;
  width: 100%;
  font-size: 14px;
  color: ${colors.textSecondary};
`

export const Textarea = styled.textarea`
  width: 100%;
  height: 594px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: rgba(93, 148, 209, 0.07);
  font-family: inherit;
  font-size: 14px;
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

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: #dc2626;
  font-size: 14px;
`

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: ${colors.flowPrimary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    background: ${colors.textMuted};
    cursor: not-allowed;
  }
`
