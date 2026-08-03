import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EMPTY_CURRENT_USER, fetchCurrentUser } from './currentUser'
import { logout } from './api'
import { clearAccessToken } from './auth'
import { useAsyncData } from './hooks'
import { alarmBadgeSrc, avatarSrc, searchIconSrc } from './icons'
import {
  AlarmBadge,
  Avatar,
  Bar,
  Divider,
  Left,
  LogoGroup,
  LogoMark,
  LogoSubtitle,
  LogoTexts,
  LogoTitle,
  ProfileMenu,
  ProfileMenuButton,
  ProfileMenuItem,
  ProfileMenuWrap,
  Profile,
  Right,
  Search,
  SearchIcon,
  SearchPlaceholder,
  UserInfo,
  UserName,
  UserRole,
} from './GNB.styles'

export default function GNB() {
  const { data } = useAsyncData(fetchCurrentUser)
  // 조회에 실패해도 GNB(로그아웃 메뉴 포함)는 계속 노출한다.
  const user = data ?? EMPTY_CURRENT_USER
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) setIsProfileMenuOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsProfileMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      clearAccessToken()
      navigate('/login', { replace: true })
    }
  }

  return (
    <Bar>
      <Left>
        <LogoGroup to="/dashboard" aria-label="대시보드로 이동">
          <LogoMark />
          <LogoTexts>
            <LogoTitle>Lumen Platform</LogoTitle>
            <LogoSubtitle>OPERATOR PLATFORM</LogoSubtitle>
          </LogoTexts>
        </LogoGroup>
      </Left>
      <Search>
        <SearchIcon src={searchIconSrc} alt="" />
        <SearchPlaceholder>사용자 이름, ID 검색...</SearchPlaceholder>
      </Search>
      <Right>
        <AlarmBadge src={alarmBadgeSrc} alt="알림" />
        <Divider />
        <ProfileMenuWrap ref={profileMenuRef}>
          <Profile
            type="button"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <Avatar src={avatarSrc} alt="" width={36} height={36} />
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserRole>{user.role}</UserRole>
            </UserInfo>
          </Profile>
          {isProfileMenuOpen && (
            <ProfileMenu role="menu" aria-label="사용자 메뉴">
              <ProfileMenuItem to="/tasks/register" role="menuitem">새 작업 생성</ProfileMenuItem>
              <ProfileMenuItem to="/dev-dashboard" role="menuitem">관리자 페이지</ProfileMenuItem>
              <ProfileMenuButton
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </ProfileMenuButton>
            </ProfileMenu>
          )}
        </ProfileMenuWrap>
      </Right>
    </Bar>
  )
}
