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
`

export const Left = styled.div`
  display: flex;
  align-items: center;
`

export const LogoGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 4px;
    border-radius: 6px;
  }
`

export const LogoMark = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: ${colors.primary};
  flex-shrink: 0;
`

export const LogoTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  white-space: nowrap;
`

export const LogoTitle = styled.p`
  margin: 0;
  font-weight: 800;
  font-size: 16px;
  color: ${colors.primary};
`

export const LogoSubtitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 9px;
  color: ${colors.textMuted};
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
`

export const SearchIcon = styled.img`
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

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
