import { fetchCurrentUser } from './currentUser'
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
  const { data: user } = useAsyncData(fetchCurrentUser)

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
        {user && (
          <Profile>
            <Avatar src={avatarSrc} alt="" width={36} height={36} />
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserRole>{user.role}</UserRole>
            </UserInfo>
          </Profile>
        )}
      </Right>
    </Bar>
  )
}
