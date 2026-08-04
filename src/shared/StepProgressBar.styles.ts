import styled from 'styled-components'
import { colors } from './theme'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 24px 280px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};

  @media (max-width: 1200px) {
    padding-right: 80px;
    padding-left: 80px;
  }

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    padding: 20px 16px;
  }
`

export const StepItem = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: 10px;

  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    grid-template-rows: auto auto;
    flex: none;
    align-items: center;
    column-gap: 12px;
    row-gap: 0;
  }
`

export const StepCircle = styled.div<{ $state: 'done' | 'active' | 'pending' }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $state }) => ($state === 'pending' ? colors.border : colors.flowPrimary)};
  color: ${({ $state }) => ($state === 'pending' ? colors.textSecondary : colors.white)};
  font-size: 13px;
  font-weight: 700;
`

export const CheckIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const StepLabel = styled.p<{ $state: 'done' | 'active' | 'pending' }>`
  margin: 0;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: ${({ $state }) => ($state === 'active' ? 700 : 500)};
  color: ${({ $state }) =>
    $state === 'active' ? colors.flowPrimary : $state === 'done' ? colors.text : colors.textMuted};
  white-space: nowrap;

  @media (max-width: 700px) {
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    line-height: 1.35;
  }
`

export const StepLine = styled.div<{ $done: boolean }>`
  flex: 1 0 0;
  min-width: 32px;
  height: 1px;
  margin: 0 4px;
  background: ${({ $done }) => ($done ? colors.flowPrimary : colors.border)};

  @media (max-width: 700px) {
    grid-column: 1;
    grid-row: 2;
    width: 1px;
    min-width: 1px;
    height: 12px;
    margin: 0 auto;
  }
`
