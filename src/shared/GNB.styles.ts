import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { colors } from './theme'

export const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 10px 40px;
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;

  @media (max-width: 900px) {
    padding: 10px 24px;
  }

  @media (max-width: 600px) {
    padding: 10px 16px;
  }
`

export const Left = styled.div`
  display: flex;
  align-items: center;
`

export const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 360px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};

  @media (max-width: 900px) {
    display: none;
  }
`

export const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
`

export const SearchInput = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  flex: 1 0 0;
  min-width: 0;
  font-size: 14px;
  color: ${colors.text};

  &::placeholder {
    color: ${colors.textMuted};
  }
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`

export const AlarmBadge = styled.img`
  width: 34px;
  height: 34px;
`

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${colors.border};
`

export const ProfileMenuWrap = styled.div`
  position: relative;
`

export const Profile = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 4px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${colors.bgTint};
    outline: none;
  }
`

export const ProfileMenu = styled.div`
  position: absolute;
  z-index: 50;
  top: calc(100% + 10px);
  right: 0;
  display: flex;
  width: 168px;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background: ${colors.white};
  box-shadow: 0 10px 28px rgba(15, 90, 82, 0.14);
`

export const ProfileMenuItem = styled(Link)`
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    border-color: ${colors.primary};
    color: ${colors.primary};
    outline: none;
  }
`

export const ProfileMenuButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: ${colors.textSecondary};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${colors.primary};
    color: ${colors.primary};
    outline: none;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;

  @media (max-width: 600px) {
    display: none;
  }
`

export const UserName = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.text};
`

export const UserRole = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${colors.textMuted};
`
