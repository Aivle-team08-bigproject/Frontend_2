import styled from 'styled-components'
import { colors } from './theme'

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 32, 0.45);
  z-index: 1000;
`

export const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 420px;
  max-width: calc(100vw - 32px);
  padding: 24px;
  border-radius: 16px;
  background: ${colors.white};
  box-shadow: 0 12px 32px rgba(15, 23, 32, 0.18);
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const ModalTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
`

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${colors.textSecondary};
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: ${colors.bg};
  }
`

export const ModalBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const ModalLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.textSecondary};
`

export const ModalHint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textMuted};
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  padding-top: 4px;
`

export const ModalStatusPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 24px 0 8px;
`

export const ModalSpinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid ${colors.border};
  border-top-color: #309688;
  animation: modal-spin 0.8s linear infinite;

  @keyframes modal-spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const ModalResultIcon = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $error }) => ($error ? '#fdecec' : '#e6f4ef')};
  color: ${({ $error }) => ($error ? '#c92a2a' : '#2b8a3e')};
  font-size: 18px;
  font-weight: 700;
`

export const ModalStatusText = styled.p<{ $error?: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $error }) => ($error ? '#c92a2a' : colors.text)};
  text-align: center;
`

export const EmailInput = styled.input`
  flex: 1;
  min-width: 220px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.text};
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #309688;
    box-shadow: 0 0 0 2px rgba(48, 150, 136, 0.12);
  }

  &:disabled {
    opacity: 0.6;
  }
`

export const EmailSubmitButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  background: #309688;
  color: ${colors.white};
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const EmailCancelButton = styled.button`
  height: 34px;
  padding: 0 10px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  cursor: pointer;
`

export const EmailStatus = styled.p<{ $error?: boolean }>`
  width: 100%;
  margin: 0;
  color: ${({ $error }) => ($error ? '#c92a2a' : '#2b8a3e')};
  font-size: 13px;
`
