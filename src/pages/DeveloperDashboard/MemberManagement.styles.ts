import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const BodyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
`

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 320px;
  flex-shrink: 0;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
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
`

export const MemberTableRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.border};

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
`
