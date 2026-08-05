import { useCallback, useEffect, useMemo, useState } from 'react'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import SubNav from '../../shared/SubNav'
import { chevronLeftSrc, chevronRightSrc, memberAvatarPlaceholderSrc, plusIconSrc, searchIconSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper } from '../../shared/layout.styles'
import { NavIcon, PageNav, PageNumber, PageNumbers, Pagination, TableContainer } from '../../shared/Table.styles'
import { fetchCurrentEmployee } from '../../shared/api'
import { EMPTY_MEMBER_MANAGEMENT, fetchMemberManagementData, ROLE_OPTIONS, updateMemberActiveState, updateMemberRole } from './memberData'
import { DEVELOPER_NAV_ITEMS } from './dashboardData'
import {
  ActionNotice,
  ActionsCell,
  AvatarSm,
  BodyHeader,
  EmptyMemberRow,
  FilterBar,
  FilterSelect,
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
  RoleChangeButton,
  RoleDialog,
  RoleDialogActions,
  RoleDialogBackdrop,
  RoleDialogDescription,
  RoleDialogTitle,
  RolePill,
  RolePillWrap,
  RoleSelect,
  SearchIconImg,
  SearchInput,
  SearchTextInput,
  Spacer,
  StatusPill,
  StatusPillWrap,
  StatusTab,
  StatusToggleTabs,
  ToggleActiveButton,
  DialogButton,
} from './MemberManagement.styles'

type StatusFilter = 'all' | 'active' | 'inactive'

const PAGE_SIZE = 5

export default function MemberManagement() {
  const [reloadKey, setReloadKey] = useState(0)
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState('')
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null)
  const loadMembers = useCallback(() => {
    void reloadKey
    return fetchMemberManagementData()
  }, [reloadKey])
  const { data, loading, error } = useAsyncData(loadMembers)
  const view = data ?? EMPTY_MEMBER_MANAGEMENT
  const { data: currentEmployee } = useAsyncData(fetchCurrentEmployee)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [partFilter, setPartFilter] = useState('all')
  const [page, setPage] = useState(1)

  const roles = useMemo(() => [...new Set(view.members.map((member) => member.role))].sort(), [view.members])
  const parts = useMemo(() => [...new Set(view.members.map((member) => member.part))].sort(), [view.members])

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return view.members.filter((member) => {
      const matchesStatus =
        statusFilter === 'all' || (statusFilter === 'active' ? member.status === '활성' : member.status === '비활성')
      const matchesRole = roleFilter === 'all' || member.role === roleFilter
      const matchesPart = partFilter === 'all' || member.part === partFilter
      const matchesSearch =
        !normalizedSearch ||
        [member.name, member.userId, member.part, member.role].some((value) => value.toLowerCase().includes(normalizedSearch))
      return matchesStatus && matchesRole && matchesPart && matchesSearch
    })
  }, [partFilter, roleFilter, searchTerm, statusFilter, view.members])

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const pagedMembers = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const canManagePermissions = currentEmployee?.permissions.includes('EMPLOYEE_PERMISSION_MANAGE') ?? false
  const canUpdateEmployee = currentEmployee?.permissions.includes('EMPLOYEE_UPDATE') ?? false
  const canManageMembers = canManagePermissions || canUpdateEmployee

  const saveRole = async (userId: string) => {
    setSavingUserId(userId)
    setNotice(null)
    try {
      await updateMemberRole(userId, editingRole)
      setEditingRoleUserId(null)
      setNotice({ message: '권한이 변경되었습니다.', error: false })
      setReloadKey((current) => current + 1)
    } catch (actionError) {
      setNotice({ message: actionError instanceof Error ? actionError.message : '권한 변경에 실패했습니다.', error: true })
    } finally {
      setSavingUserId(null)
    }
  }

  const toggleActive = async (userId: string, active: boolean) => {
    const action = active ? '비활성화' : '활성화'
    if (!window.confirm(`이 구성원을 ${action}하시겠습니까?`)) return
    setSavingUserId(userId)
    setNotice(null)
    try {
      await updateMemberActiveState(userId, active)
      setNotice({ message: `구성원 계정이 ${action}되었습니다.`, error: false })
      setReloadKey((current) => current + 1)
    } catch (actionError) {
      setNotice({ message: actionError instanceof Error ? actionError.message : `${action}에 실패했습니다.`, error: true })
    } finally {
      setSavingUserId(null)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [partFilter, roleFilter, searchTerm, statusFilter])

  const navigation = (
    <>
      <GNB />
      <SubNav activeTo="/dev-dashboard/members" items={DEVELOPER_NAV_ITEMS} />
    </>
  )

  return (
    <PageWrapper>
      {navigation}
      <MainContent>
        <DataStateNotice loading={loading} error={error} subject="구성원 데이터" />
        <BodyHeader>
          <HeaderTitleGroup>
            <HeaderTitle>회원 관리</HeaderTitle>
            <HeaderSubtitle>플랫폼 내부 운영 인력 권한 설정 및 활성화 제어</HeaderSubtitle>
          </HeaderTitleGroup>
          {currentEmployee?.permissions.includes('EMPLOYEE_CREATE') && (
            <RegisterButton type="button" disabled title="신규 직원 등록 화면은 다음 단계에서 연결됩니다.">
              <PlusIcon src={plusIconSrc} alt="" />
              신규 직원 등록
            </RegisterButton>
          )}
        </BodyHeader>
        {notice && <ActionNotice $error={notice.error}>{notice.message}</ActionNotice>}

        <FilterBar>
          <SearchInput>
            <SearchIconImg src={searchIconSrc} alt="" />
            <SearchTextInput
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="이름, 사번, ID로 검색..."
              aria-label="구성원 검색"
            />
          </SearchInput>
          <FilterSelect value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="권한 필터">
            <option value="all">모든 권한(역할)</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={partFilter} onChange={(event) => setPartFilter(event.target.value)} aria-label="소속 파트 필터">
            <option value="all">소속 파트 전체</option>
            {parts.map((part) => (
              <option key={part} value={part}>
                {part}
              </option>
            ))}
          </FilterSelect>
          <Spacer />
          <StatusToggleTabs>
            <StatusTab type="button" $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              전체 ({view.totalCount}명)
            </StatusTab>
            <StatusTab type="button" $active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
              활성 ({view.activeCount}명)
            </StatusTab>
            <StatusTab type="button" $active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
              비활성 ({view.inactiveCount}명)
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
            {canManageMembers && (
              <MemberCell $width={180} style={{ textAlign: 'right' }}>
                관리
              </MemberCell>
            )}
          </MemberTableHeaderRow>
          {pagedMembers.length === 0 ? (
            <EmptyMemberRow>선택한 조건에 해당하는 구성원이 없습니다.</EmptyMemberRow>
          ) : (
            pagedMembers.map((member) => {
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
                  {canManageMembers && (
                    <ActionsCell>
                      {canManagePermissions && (
                        <RoleChangeButton
                          type="button"
                          onClick={() => {
                            setEditingRoleUserId(member.userId)
                            setEditingRole(member.role)
                            setNotice(null)
                          }}
                          disabled={savingUserId === member.userId}
                        >
                          권한 변경
                        </RoleChangeButton>
                      )}
                      {canUpdateEmployee && (
                        <ToggleActiveButton
                          type="button"
                          $active={active}
                          onClick={() => toggleActive(member.userId, active)}
                          disabled={savingUserId === member.userId}
                        >
                          {active ? '비활성화' : '활성화'}
                        </ToggleActiveButton>
                      )}
                    </ActionsCell>
                  )}
                </MemberTableRow>
              )
            })
          )}
        </TableContainer>

        <Pagination aria-label="구성원 페이지 이동">
          <PageNav type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            <NavIcon src={chevronLeftSrc} alt="이전" />
          </PageNav>
          <PageNumbers>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <PageNumber
                key={pageNumber}
                type="button"
                $active={pageNumber === page}
                aria-current={pageNumber === page ? 'page' : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PageNumber>
            ))}
          </PageNumbers>
          <PageNav
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            <NavIcon src={chevronRightSrc} alt="다음" />
          </PageNav>
        </Pagination>
        {editingRoleUserId && canManagePermissions && (
          <RoleDialogBackdrop role="presentation" onClick={() => setEditingRoleUserId(null)}>
            <RoleDialog role="dialog" aria-modal="true" aria-labelledby="role-dialog-title" onClick={(event) => event.stopPropagation()}>
              <RoleDialogTitle id="role-dialog-title">권한 변경</RoleDialogTitle>
              <RoleDialogDescription>구성원에게 적용할 역할을 선택하세요.</RoleDialogDescription>
              <RoleSelect value={editingRole} onChange={(event) => setEditingRole(event.target.value)} aria-label="역할 선택">
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.label}>
                    {role.label}
                  </option>
                ))}
              </RoleSelect>
              <RoleDialogActions>
                <DialogButton type="button" onClick={() => setEditingRoleUserId(null)} disabled={Boolean(savingUserId)}>
                  취소
                </DialogButton>
                <DialogButton $primary type="button" onClick={() => saveRole(editingRoleUserId)} disabled={Boolean(savingUserId)}>
                  {savingUserId ? '저장 중...' : '적용'}
                </DialogButton>
              </RoleDialogActions>
            </RoleDialog>
          </RoleDialogBackdrop>
        )}
      </MainContent>
    <Footer />
    </PageWrapper>
  )
}
