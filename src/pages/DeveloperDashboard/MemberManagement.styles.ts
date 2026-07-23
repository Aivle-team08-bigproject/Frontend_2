import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const BodyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;
  gap: 12px;
`

export const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: ${colors.text};
`

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.textMuted};
`

export const RegisterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const PlusIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  flex-wrap: wrap;
`

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 320px;
  flex-shrink: 0;
  max-width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
`

export const SearchTextInput = styled.input`
  flex: 1 0 0;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: ${colors.text};
  font-size: 14px;

  &::placeholder {
    color: ${colors.textMuted};
  }
`

export const SearchIconImg = styled.img`
  width: 16px;
  height: 16px;
`

export const SearchPlaceholder = styled.p`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  font-size: 14px;
  color: ${colors.textMuted};
`

export const Dropdown = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
`

export const FilterSelect = styled.select`
  appearance: none;
  display: flex;
  min-width: 150px;
  padding: 10px 36px 10px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 14px;
  cursor: pointer;
`

export const DropdownIcon = styled.img`
  width: 12px;
  height: 12px;
`

export const Spacer = styled.div`
  flex: 1 0 0;
  min-width: 0;
`

export const StatusToggleTabs = styled.div`
  display: flex;
  padding: 4px;
  border-radius: 8px;
  background: ${colors.bg};
  max-width: 100%;
  overflow-x: auto;
`

export const StatusTab = styled.button<{ $active: boolean }>`
  display: flex;
  padding: 8px 14px;
  border-radius: 6px;
  border: ${({ $active }) => ($active ? `1px solid ${colors.border}` : 'none')};
  background: ${({ $active }) => ($active ? colors.white : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primary : colors.textSecondary)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  cursor: pointer;
`

export const MemberTableHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 14px 24px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  font-size: 14px;
  font-weight: 700;
  color: ${colors.textSecondary};
  min-width: 1120px;
  white-space: nowrap;
`

export const MemberTableRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.border};
  min-width: 1120px;

  &:last-child {
    border-bottom: none;
  }
`

export const MemberCell = styled.p<{ $width?: number; $flex?: boolean }>`
  margin: 0;
  flex-shrink: 0;
  width: ${({ $width, $flex }) => ($flex ? undefined : $width ? `${$width}px` : undefined)};
  flex: ${({ $flex }) => ($flex ? '1 0 0' : undefined)};
  min-width: ${({ $flex }) => ($flex ? '0' : undefined)};
  font-size: 14px;
  color: ${colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 160px;
  flex-shrink: 0;
`

export const AvatarSm = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`

export const NameText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  white-space: nowrap;
`

export const RolePillWrap = styled.div`
  display: flex;
  width: 140px;
  flex-shrink: 0;
`

export const RolePill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const StatusPillWrap = styled.div`
  display: flex;
  width: 120px;
  flex-shrink: 0;
`

export const StatusPill = styled.span<{ $active: boolean }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? '#dcfce7' : '#f1f5f9')};
  color: ${({ $active }) => ($active ? '#22c55e' : '#6b7280')};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 180px;
  flex-shrink: 0;
`

export const RoleChangeButton = styled.button`
  display: flex;
  padding: 6px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const RoleEditor = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const RoleSelect = styled.select`
  min-width: 76px;
  padding: 5px 6px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 12px;
`

export const RoleDialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.28);
`

export const RoleDialog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(360px, 100%);
  padding: 24px;
  border: 1px solid ${colors.border};
  border-radius: 14px;
  background: ${colors.white};
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
`

export const RoleDialogTitle = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 18px;
  font-weight: 800;
`

export const RoleDialogDescription = styled.p`
  margin: -6px 0 2px;
  color: ${colors.textMuted};
  font-size: 13px;
`

export const RoleDialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`

export const DialogButton = styled.button<{ $primary?: boolean }>`
  padding: 9px 14px;
  border: 1px solid ${({ $primary }) => ($primary ? colors.primary : colors.border)};
  border-radius: 7px;
  background: ${({ $primary }) => ($primary ? colors.primary : colors.white)};
  color: ${({ $primary }) => ($primary ? colors.white : colors.textSecondary)};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const InlineActionButton = styled.button`
  padding: 5px 7px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ToggleActiveButton = styled.button<{ $active: boolean }>`
  display: flex;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? '#fef3c7' : '#e6f3f3')};
  color: ${({ $active }) => ($active ? '#ea580c' : colors.primary)};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const PageState = styled.div<{ $error?: boolean }>`
  display: flex;
  min-height: 260px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $error }) => ($error ? '#fecaca' : colors.border)};
  border-radius: 12px;
  background: ${({ $error }) => ($error ? '#fff7f7' : colors.white)};
  color: ${({ $error }) => ($error ? colors.danger : colors.textSecondary)};
  font-size: 14px;
`

export const ActionNotice = styled.p<{ $error?: boolean }>`
  margin: 12px 0 0;
  color: ${({ $error }) => ($error ? colors.danger : colors.primary)};
  font-size: 13px;
  font-weight: 600;
`

export const EmptyMemberRow = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: ${colors.textMuted};
  font-size: 14px;
`
