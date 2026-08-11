import styled from 'styled-components'
import { colors } from './theme'

export const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const TooltipTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid ${colors.textMuted};
  border-radius: 50%;
  background: transparent;
  color: ${colors.textMuted};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
  padding: 0;

  &:hover,
  &:focus-visible {
    border-color: ${colors.flowPrimary};
    color: ${colors.flowPrimary};
  }
`

export const TooltipPanel = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: 0 8px 24px rgba(15, 23, 32, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.12s ease, transform 0.12s ease, visibility 0.12s;

  ${TooltipWrapper}:hover &,
  ${TooltipTrigger}:focus-visible + & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`

export const TooltipTitle = styled.p`
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.text};
`

export const TooltipBody = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.textSecondary};
`

export const TooltipList = styled.ol`
  margin: 6px 0 0;
  padding-left: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.textSecondary};
`
