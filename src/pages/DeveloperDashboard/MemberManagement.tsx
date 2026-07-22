import { useState } from 'react'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { chevronDownSrc, chevronLeftSrc, chevronRightSrc, memberAvatarPlaceholderSrc, plusIconSrc, searchIconSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import { MainContent, PageWrapper } from '../../shared/layout.styles'
import { NavIcon, PageNav, PageNumber, PageNumbers, Pagination, TableContainer } from '../../shared/Table.styles'
import { fetchMemberManagementData } from './memberData'
import {
  ActionsCell,
  AvatarSm,
  BodyHeader,
  Dropdown,
  DropdownIcon,
  FilterBar,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  MemberCell,
  MemberTableHeaderRow,
  MemberTableRow,
  NameCell,
  NameText,
  PlusIcon,
  RegisterButton,
  RolePill,
  RolePillWrap,
  SearchIconImg,
  SearchInput,
  SearchPlaceholder,
  Spacer,
  StatusPill,
  StatusPillWrap,
  StatusTab,
  StatusToggleTabs,
  ToggleActiveButton,
  RoleChangeButton,
} from './MemberManagement.styles'

type StatusFilter = 'all' | 'active' | 'inactive'

export default function MemberManagement() {
  const { data } = useAsyncData(fetchMemberManagementData)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  if (!data) return null

  const rows = data.members.filter((m) => {
    if (statusFilter === 'active') return m.status === '활성'
    if (statusFilter === 'inactive') return m.status === '비활성'
    return true
  })

  return (
    <PageWrapper>
      <GNB />
      <SubNav
        activeTo="/dev-dashboard/members"
        items={[
          { label: '대시보드', to: '/dev-dashboard' },
          { label: '회원 관리', to: '/dev-dashboard/members' },
        ]}
      />
      <MainContent>
        <BodyHeader>
          <HeaderTitleGroup>
            <HeaderTitle>회원 관리</HeaderTitle>
            <HeaderSubtitle>플랫폼 내부 운영 인력 권한 설정 및 활성화 제어</HeaderSubtitle>
          </HeaderTitleGroup>
          <RegisterButton type="button">
            <PlusIcon src={plusIconSrc} alt="" />
            신규 직원 등록
          </RegisterButton>
        </BodyHeader>

        <FilterBar>
          <SearchInput>
            <SearchIconImg src={searchIconSrc} alt="" />
            <SearchPlaceholder>이름, 사번, ID로 검색...</SearchPlaceholder>
          </SearchInput>
          <Dropdown type="button">
            모든 권한(역할)
            <DropdownIcon src={chevronDownSrc} alt="" />
          </Dropdown>
          <Dropdown type="button">
            소속 파트 전체
            <DropdownIcon src={chevronDownSrc} alt="" />
          </Dropdown>
          <Spacer />
          <StatusToggleTabs>
            <StatusTab type="button" $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              전체 ({data.totalCount}명)
            </StatusTab>
            <StatusTab type="button" $active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
              활성 ({data.activeCount}명)
            </StatusTab>
            <StatusTab type="button" $active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
              비활성 ({data.inactiveCount}명)
            </StatusTab>
          </StatusToggleTabs>
        </FilterBar>

        <TableContainer>
          <MemberTableHeaderRow>
            <MemberCell $width={160}>이름</MemberCell>
            <MemberCell $width={160}>아이디</MemberCell>
            <MemberCell $width={140}>권한 (역할)</MemberCell>
            <MemberCell $flex>소속 파트</MemberCell>
            <MemberCell $width={160}>최종 로그인일</MemberCell>
            <MemberCell $width={120}>상태</MemberCell>
            <MemberCell $width={180} style={{ textAlign: 'right' }}>
              관리
            </MemberCell>
          </MemberTableHeaderRow>
          {rows.map((member) => {
            const active = member.status === '활성'
            return (
              <MemberTableRow key={member.userId}>
                <NameCell>
                  <AvatarSm src={memberAvatarPlaceholderSrc} alt="" />
                  <NameText>{member.name}</NameText>
                </NameCell>
                <MemberCell $width={160}>{member.userId}</MemberCell>
                <RolePillWrap>
                  <RolePill $bg={member.roleBg} $color={member.roleColor}>
                    {member.role}
                  </RolePill>
                </RolePillWrap>
                <MemberCell $flex>{member.part}</MemberCell>
                <MemberCell $width={160} style={{ color: '#adb5bd' }}>
                  {member.lastLoginAt}
                </MemberCell>
                <StatusPillWrap>
                  <StatusPill $active={active}>{member.status}</StatusPill>
                </StatusPillWrap>
                <ActionsCell>
                  <RoleChangeButton type="button">권한 변경</RoleChangeButton>
                  <ToggleActiveButton type="button" $active={active}>
                    {active ? '비활성화' : '활성화'}
                  </ToggleActiveButton>
                </ActionsCell>
              </MemberTableRow>
            )
          })}
        </TableContainer>

        <Pagination>
          <PageNav type="button">
            <NavIcon src={chevronLeftSrc} alt="이전" />
          </PageNav>
          <PageNumbers>
            <PageNumber type="button" $active>
              1
            </PageNumber>
            <PageNumber type="button" $active={false}>
              2
            </PageNumber>
            <PageNumber type="button" $active={false}>
              3
            </PageNumber>
          </PageNumbers>
          <PageNav type="button">
            <NavIcon src={chevronRightSrc} alt="다음" />
          </PageNav>
        </Pagination>
      </MainContent>
    </PageWrapper>
  )
}
