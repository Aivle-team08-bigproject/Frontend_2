import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const PreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const PreviewTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const DownloadButton = styled.button`
  display: flex;
  padding: 6px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
`

export const EmailButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #309688;
  color: ${colors.white};
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
`

export const SampleTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  overflow-x: auto;
  overflow-y: hidden;
`

export const SampleHeaderRow = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 16px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textSecondary};
  min-width: 620px;
  white-space: nowrap;
`

export const SampleRowEl = styled.div`
  display: flex;
  width: 100%;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.border};
  font-size: 14px;
  color: ${colors.text};
  min-width: 620px;

  &:last-child {
    border-bottom: none;
  }
`

export const SampleCell = styled.p<{ $strong?: boolean }>`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
`

export const AccordionCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: #f9fafc;
`

export const AccordionToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  padding: 16px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
`

export const ChevronText = styled.span<{ $open: boolean }>`
  font-size: 10px;
  color: #667380;
  transform: rotate(${({ $open }) => ($open ? '0deg' : '-90deg')});
  transition: transform 0.15s ease;
`

export const AccordionTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333840;
`

export const AccordionDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9dee3;
`

export const AccordionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 16px 20px 20px;
`

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

export const InfoTitle = styled.p`
  margin: 0;
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: #40454d;
`

export const InfoDescription = styled.p`
  margin: 0;
  width: 100%;
  font-size: 12.5px;
  line-height: 1.75;
  color: #6b7380;
`

export const FeedbackCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

export const FeedbackTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

export const PromptGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

export const PromptLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
  white-space: nowrap;
`

export const PromptTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: ${colors.bg};
  font-family: inherit;
  font-size: 13px;
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

export const NoticeBanner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${colors.flowPrimaryBg};
`

export const NoticeIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const NoticeText = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.flowPrimary};
  white-space: nowrap;
`

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  padding-top: 16px;
`

export const RequestButton = styled.button`
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

export const DisabledButton = styled.button`
  display: flex;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${colors.border};
  color: ${colors.textMuted};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: not-allowed;
`
