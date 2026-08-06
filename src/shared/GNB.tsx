import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EMPTY_CURRENT_USER, fetchCurrentUser } from './currentUser'
import { logout } from './api'
import { clearAccessToken } from './auth'
import { useAsyncData } from './hooks'
import { avatarSrc, searchIconSrc } from './icons'
import Logo from './Logo'
import {
  Avatar,
  Bar,
  Left,
  ProfileMenu,
  ProfileMenuButton,
  ProfileMenuItem,
  ProfileMenuWrap,
  Profile,
  Right,
  Search,
  SearchIcon,
  SearchInput,
  UserInfo,
  UserName,
  UserRole,
} from './GNB.styles'

export default function GNB() {
  const { data } = useAsyncData(fetchCurrentUser)
  // 조회에 실패해도 GNB(로그아웃 메뉴 포함)는 계속 노출한다.
  const user = data ?? EMPTY_CURRENT_USER
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
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

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '')
  }, [searchParams])

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

  function submitSearch() {
    const query = search.trim()
    // 현재 목록의 권한 범위·필터는 유지하고 검색어만 갱신한다.
    const next = new URLSearchParams(searchParams)
    if (query) next.set('search', query)
    else next.delete('search')
    next.set('page', '1')
    navigate(`/dashboard/tasks?${next.toString()}`)
  }

  return (
    <Bar>
      <Left>
        <Logo size="sm" to="/dashboard" />
      </Left>
      <Search>
        <SearchIcon src={searchIconSrc} alt="" />
        <SearchInput
          aria-label="작업 검색"
          placeholder="요청번호, 고객사, 작업명, 담당자 검색"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitSearch()
          }}
        />
      </Search>
      <Right>
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
              {user.permissions.includes('CONTRACT_MANAGE') && (
                <ProfileMenuItem to="/dashboard/overview" role="menuitem">관리자 Dashboard</ProfileMenuItem>
              )}
              <ProfileMenuItem to="/dev-dashboard" role="menuitem">개발자 페이지</ProfileMenuItem>
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
