import styled from 'styled-components'
import { colors } from './theme'

export const ProgressModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
`

export const ProgressModal = styled.div`
  width: min(440px, 100%);
  padding: 32px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background: ${colors.white};
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.2);
  text-align: center;
`

export const ProgressModalTitle = styled.h2`
  margin: 0 0 12px;
  color: ${colors.text};
  font-size: 18px;
  font-weight: 800;
`

export const ProgressModalMessage = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;
  word-break: keep-all;
`
