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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const MainForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`

export const GuidePanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  line-height: 1.55;

  @media (max-width: 900px) {
    order: -1;
  }
`

export const GuideTitle = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 800;
`

export const GuideList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background: ${colors.white};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
`

export const RequiredMark = styled.span`
  margin-left: 2px;
  color: ${colors.danger};
`

export const FieldInput = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  padding: 0 13px;
  border: 1px solid ${({ $invalid }) => $invalid ? colors.danger : '#dee2e6'};
  border-radius: 10px;
  outline: 0;
  background: #f8f9fa;
  color: ${colors.text};
  font: inherit;
  font-weight: 400;

  &:focus {
    border-color: ${({ $invalid }) => $invalid ? colors.danger : colors.flowPrimary};
    box-shadow: 0 0 0 3px ${({ $invalid }) => $invalid ? 'rgba(224, 49, 49, 0.1)' : 'rgba(0, 132, 133, 0.1)'};
  }
`

export const FieldSelect = styled.select<{ $invalid?: boolean }>`
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  padding: 0 13px;
  border: 1px solid ${({ $invalid }) => $invalid ? colors.danger : '#dee2e6'};
  border-radius: 10px;
  outline: 0;
  background: #f8f9fa;
  color: ${colors.text};
  font: inherit;
  font-weight: 400;

  &:focus {
    border-color: ${({ $invalid }) => $invalid ? colors.danger : colors.flowPrimary};
    box-shadow: 0 0 0 3px ${({ $invalid }) => $invalid ? 'rgba(224, 49, 49, 0.1)' : 'rgba(0, 132, 133, 0.1)'};
  }
`

export const SectionLabel = styled.h2`
  grid-column: 1 / -1;
  margin: 0;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 800;
`

export const FieldHint = styled.span`
  grid-column: 1 / -1;
  margin-top: -4px;
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 500;
`

export const FieldError = styled.span`
  grid-column: 1 / -1;
  margin-top: -4px;
  color: ${colors.danger};
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
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

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
  grid-column: 1 / -1;
`

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1.5px solid ${colors.flowPrimary};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.flowPrimary};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    border-color: ${colors.textMuted};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }
`

export const UploadHint = styled.span`
  font-size: 12px;
  color: ${colors.textMuted};
`

export const InfoMessage = styled.p`
  margin: 0;
  color: ${colors.flowPrimary};
  font-size: 13px;
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
  grid-column: 1 / -1;

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
