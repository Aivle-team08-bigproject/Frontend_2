import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { colors, radius, shadow, spacing } from '../../shared/theme'

export const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
  width: 100%;
  padding: ${spacing.xxl}px;
  border-radius: ${radius.lg}px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: ${shadow.card};
`

export const SummaryTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md}px;
  flex-wrap: wrap;
`

export const MetaRow = styled.div`
  display: flex;
  gap: ${spacing.xxl}px;
  flex-wrap: wrap;
`

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const MetaLabel = styled.span`
  font-size: 12px;
  color: ${colors.textMuted};
`

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
`

export const StatusBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 100px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`

export const ProgressWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

export const ProgressLabels = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 12px;
  color: ${colors.textSecondary};
`

export const ProgressValue = styled.span`
  font-weight: 800;
  color: ${colors.flowPrimary};
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${colors.bg};
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 4px;
  background: ${colors.flowPrimary};
  transition: width 0.3s ease;
`

export const ActionRow = styled.div`
  display: flex;
  gap: ${spacing.md}px;
  flex-wrap: wrap;
`

export const RetryFeedbackBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const RetryFeedbackLabel = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.textSecondary};
`

export const RetryFeedbackTextarea = styled.textarea`
  width: 100%;
  height: 72px;
  padding: 12px 14px;
  border-radius: ${radius.sm}px;
  border: 1px solid ${colors.border};
  background: ${colors.bg};
  font-family: inherit;
  font-size: 13px;
  color: ${colors.text};
  resize: vertical;

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.flowPrimary};
  }
`

export const PrimaryAction = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border: none;
  border-radius: ${radius.sm}px;
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

export const SecondaryAction = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm}px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`

export const StagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${spacing.lg}px;
  width: 100%;
`

export const StageCard = styled.div<{ $current: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  padding: ${spacing.xl}px;
  border-radius: ${radius.lg}px;
  border: ${({ $current }) => ($current ? `1.5px solid ${colors.flowPrimary}` : `1px solid ${colors.border}`)};
  background: ${colors.white};
  box-shadow: ${shadow.card};
`

export const StageTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm}px;
`

export const StageName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${colors.text};
`

export const StageMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: ${colors.textSecondary};
`

export const StageErrorText = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: ${radius.sm}px;
  background: ${colors.dangerBg};
  color: ${colors.danger};
  font-size: 12px;
  line-height: 1.5;
  word-break: break-word;
`

export const FailureNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.lg}px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid ${colors.danger};
  border-radius: ${radius.md}px;
  background: ${colors.dangerBg};

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
  }
`

export const FailureNoticeCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const FailureNoticeTitle = styled.strong`
  color: ${colors.danger};
  font-size: 14px;
  line-height: 1.5;
`

export const FailureNoticeText = styled.span`
  color: ${colors.textSecondary};
  font-size: 13px;
  line-height: 1.5;
`

export const FailureNoticeAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 10px 16px;
  border-radius: ${radius.sm}px;
  background: ${colors.white};
  color: ${colors.danger};
  border: 1px solid ${colors.danger};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${colors.dangerBg};
  }
`

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(20, 24, 28, 0.48);
`

export const FailureModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(520px, 100%);
  padding: 28px;
  border-radius: ${radius.lg}px;
  background: ${colors.white};
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
`

export const FailureModalTitle = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 20px;
`

export const FailureModalText = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;
`

export const ModalActionRow = styled(ActionRow)`
  justify-content: flex-end;
`

export const AdminRecoveryButton = styled(SecondaryAction)`
  color: ${colors.danger};
  border-color: ${colors.danger};
`

export const RecoveryOption = styled.button`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm}px;
  background: ${colors.white};
  color: ${colors.text};
  text-align: left;
  cursor: pointer;

  strong { font-size: 14px; }
  span { color: ${colors.textSecondary}; font-size: 12px; line-height: 1.5; }
  &:hover { border-color: ${colors.flowPrimary}; background: ${colors.bg}; }
`

export const ArtifactList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const ArtifactItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: ${colors.textSecondary};
`

export const StageLink = styled(Link)`
  align-self: flex-start;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.flowPrimary};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  width: 100%;
`

export const HistoryRow = styled.div<{ $stripe: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-left: 3px solid ${({ $stripe }) => $stripe};
  border-radius: ${radius.sm}px;
  background: ${colors.bg};
`

export const HistoryTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.text};
`

export const HistoryMeta = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${colors.textMuted};
`

export const HistoryFeedback = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 1.5;
  word-break: break-word;
`

export const EmptyText = styled.p`
  margin: 0;
  padding: 20px 0;
  text-align: center;
  font-size: 13px;
  color: ${colors.textMuted};
`
