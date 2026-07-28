import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { chevronDownSrc, chevronLeftSrc, chevronRightSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import { MainContent, PageWrapper, SectionHeader, SectionTitle, SectionTitleGroup } from '../../shared/layout.styles'
import {
  Cell,
  MutedCell,
  NavIcon,
  PageNav,
  PageNumber,
  PageNumbers,
  Pagination,
  ReqIdCell,
  SortBar,
  SortChip,
  SortChipIcon,
  StatusCell,
  StatusPill,
  StrongCell as ClientCell,
  TableBody,
  TableContainer,
  TableHeaderRow,
  TableRowEl,
} from '../../shared/Table.styles'
import {
  fetchPractitionerDashboardData,
  TASK_FILTER_STAGES,
  taskFilterStageForStatus,
  taskStatusColors,
  type TaskFilterStage,
} from './data'
import {
  ActionLink,
  AlertBadge,
  AlertsRow,
  AlertsSection,
  ColHeader,
  ColHeaderMeta,
  ColHeaderTitle,
  CardBottom,
  CardTop,
  CountBadge,
  FootNote,
  ClearFilters,
  EmptyState,
  FilterGroup,
  FilterMenu,
  FilterOption,
  FilterSummary,
  InsightCol,
  InsightRow,
  ItemSubtitle,
  ItemTexts,
  ItemTitle,
  ListCol,
  RankNumber,
  RankedRow,
  SmallTag,
  StatCaption,
  StatCardEl,
  StatLabel,
  StatNumbers,
  StatUnit,
  StatValue,
  StatsRow,
  SupplementRow,
  TableSection,
  WarningCardEl,
  WarningDesc,
  WarningTitle,
} from './PractitionerDashboardMain.styles'

export default function PractitionerDashboardMain() {
  const { data } = useAsyncData(fetchPractitionerDashboardData)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<TaskFilterStage | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [openFilter, setOpenFilter] = useState<'status' | 'assignee' | 'month' | null>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const taskDetailRoute = {
    '요구사항 분석': '/tasks/review',
    '요구사항 분석 진행': '/tasks/review',
    '요구사항 완료 피드백': '/tasks/review',
    '데이터 선별 진행': '/tasks/selection',
    '샘플데이터 및 피드백': '/tasks/sample-feedback',
    '데이터 가공 진행': '/tasks/processing',
    '최종 산출물 및 피드백': '/tasks/final-feedback',
    작업완료: '/tasks/complete',
  } as const

  const assigneeOptions = useMemo(
    () => [...new Set(data?.taskRows.map((row) => row.assignee) ?? [])].sort((a, b) => a.localeCompare(b, 'ko')),
    [data],
  )
  const monthOptions = useMemo(
    () => [...new Set(data?.taskRows.map((row) => row.createdAt.slice(0, 7)) ?? [])].sort().reverse(),
    [data],
  )
  const filteredRows = useMemo(() => {
    if (!data) return []
    return data.taskRows.filter((row) => {
      if (statusFilter !== 'all' && taskFilterStageForStatus[row.status] !== statusFilter) return false
      if (assigneeFilter !== 'all' && row.assignee !== assigneeFilter) return false
      if (monthFilter !== 'all' && row.createdAt.slice(0, 7) !== monthFilter) return false
      return true
    })
  }, [assigneeFilter, data, monthFilter, statusFilter])

  const pageSize = data?.pageSize ?? 4
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page, pageSize])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!filterBarRef.current?.contains(event.target as Node)) setOpenFilter(null)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenFilter(null)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const hasActiveFilter = statusFilter !== 'all' || assigneeFilter !== 'all' || monthFilter !== 'all'

  function selectFilter(update: () => void) {
    update()
    setPage(1)
    setOpenFilter(null)
  }

  function clearFilters() {
    setStatusFilter('all')
    setAssigneeFilter('all')
    setMonthFilter('all')
    setPage(1)
    setOpenFilter(null)
  }

  if (!data) return null

  return (
    <PageWrapper>
      <GNB />
      <SubNav
        activeTo="/dashboard"
        items={[
          { label: '전체 작업', to: '/dashboard' },
          { label: '내 작업 현황', to: '/dashboard/my-tasks' },
        ]}
      />
      <MainContent>
        <StatsRow>
          {data.statCards.map((stat) => (
            <StatCardEl key={stat.label} $highlight={stat.highlight}>
              <StatLabel $highlight={stat.highlight}>{stat.label}</StatLabel>
              <StatNumbers>
                <StatValue $highlight={stat.highlight}>{stat.value}</StatValue>
                <StatUnit $highlight={stat.highlight}>{stat.unit}</StatUnit>
              </StatNumbers>
              <StatCaption $highlight={stat.highlight}>{stat.caption}</StatCaption>
            </StatCardEl>
          ))}
        </StatsRow>

        <AlertsSection>
          <SectionHeader>
            <SectionTitleGroup>
              <SectionTitle>단계별 조치 대기 작업 (Human Intervention Required)</SectionTitle>
              <AlertBadge>{data.alertBannerCount}건 지속 관리 필요</AlertBadge>
            </SectionTitleGroup>
          </SectionHeader>
          <AlertsRow>
            {data.warningCards.map((card, index) => (
              <WarningCardEl key={card.title} $urgent={index === 0}>
                <CardTop>
                  <WarningTitle>{card.title}</WarningTitle>
                  <CountBadge $bg={card.countBg} $color={card.countColor}>
                    {card.countLabel}
                  </CountBadge>
                </CardTop>
                <WarningDesc>{card.description}</WarningDesc>
                <CardBottom>
                  <FootNote>{card.footNote}</FootNote>
                  <ActionLink type="button" onClick={() => navigate(card.actionTo)}>
                    상세 조치 &gt;
                  </ActionLink>
                </CardBottom>
              </WarningCardEl>
            ))}
          </AlertsRow>
        </AlertsSection>

        <InsightRow>
          <InsightCol>
            <ColHeader>
              <ColHeaderTitle>선호 데이터 상품 TOP 4 (Hana Market 인기 순위)</ColHeaderTitle>
              <ColHeaderMeta>최근 7일 기준</ColHeaderMeta>
            </ColHeader>
            <ListCol>
              {data.preferredItems.map((item) => (
                <RankedRow key={item.rank}>
                  <RankNumber>{item.rank}</RankNumber>
                  <ItemTexts>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemSubtitle>{item.subtitle}</ItemSubtitle>
                  </ItemTexts>
                  <SmallTag $bg={item.tagBg} $color={item.tagColor}>
                    {item.tag}
                  </SmallTag>
                </RankedRow>
              ))}
            </ListCol>
          </InsightCol>

          <InsightCol>
            <ColHeader>
              <ColHeaderTitle>보완 필요 데이터 리스트 (기능 및 카테고리 누락)</ColHeaderTitle>
              <ColHeaderMeta $danger>우선 보완대상</ColHeaderMeta>
            </ColHeader>
            <ListCol>
              {data.supplementItems.map((item) => (
                <SupplementRow key={item.title}>
                  <ItemTexts>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemSubtitle style={{ color: item.noteColor }}>{item.note}</ItemSubtitle>
                  </ItemTexts>
                  <SmallTag $bg={item.tagBg} $color={item.tagColor}>
                    {item.tag}
                  </SmallTag>
                </SupplementRow>
              ))}
            </ListCol>
          </InsightCol>
        </InsightRow>

        <TableSection>
          <SectionHeader>
            <SectionTitle>전체 작업 관리 리스트</SectionTitle>
            <SortBar ref={filterBarRef}>
              <FilterGroup>
                <SortChip type="button" aria-haspopup="menu" aria-expanded={openFilter === 'status'} onClick={() => setOpenFilter((current) => current === 'status' ? null : 'status')}>
                  {statusFilter === 'all' ? '단계별 상태' : `단계: ${statusFilter}`}
                  <SortChipIcon src={chevronDownSrc} alt="" />
                </SortChip>
                {openFilter === 'status' && (
                  <FilterMenu role="menu" aria-label="단계별 상태 필터">
                    {(['all', ...TASK_FILTER_STAGES] as const).map((status) => (
                      <FilterOption key={status} type="button" role="menuitemradio" aria-checked={statusFilter === status} $selected={statusFilter === status} onClick={() => selectFilter(() => setStatusFilter(status))}>
                        {status === 'all' ? '전체 상태' : status}
                      </FilterOption>
                    ))}
                  </FilterMenu>
                )}
              </FilterGroup>
              <FilterGroup>
                <SortChip type="button" aria-haspopup="menu" aria-expanded={openFilter === 'assignee'} onClick={() => setOpenFilter((current) => current === 'assignee' ? null : 'assignee')}>
                  {assigneeFilter === 'all' ? '담당자' : assigneeFilter}
                  <SortChipIcon src={chevronDownSrc} alt="" />
                </SortChip>
                {openFilter === 'assignee' && (
                  <FilterMenu role="menu" aria-label="담당자 필터">
                    <FilterOption type="button" role="menuitemradio" aria-checked={assigneeFilter === 'all'} $selected={assigneeFilter === 'all'} onClick={() => selectFilter(() => setAssigneeFilter('all'))}>전체 담당자</FilterOption>
                    {assigneeOptions.map((assignee) => (
                      <FilterOption key={assignee} type="button" role="menuitemradio" aria-checked={assigneeFilter === assignee} $selected={assigneeFilter === assignee} onClick={() => selectFilter(() => setAssigneeFilter(assignee))}>{assignee}</FilterOption>
                    ))}
                  </FilterMenu>
                )}
              </FilterGroup>
              <FilterGroup>
                <SortChip type="button" aria-haspopup="menu" aria-expanded={openFilter === 'month'} onClick={() => setOpenFilter((current) => current === 'month' ? null : 'month')}>
                  {monthFilter === 'all' ? '날짜' : monthFilter.replace('.', '년 ') + '월'}
                  <SortChipIcon src={chevronDownSrc} alt="" />
                </SortChip>
                {openFilter === 'month' && (
                  <FilterMenu role="menu" aria-label="등록 월 필터">
                    <FilterOption type="button" role="menuitemradio" aria-checked={monthFilter === 'all'} $selected={monthFilter === 'all'} onClick={() => selectFilter(() => setMonthFilter('all'))}>전체 날짜</FilterOption>
                    {monthOptions.map((month) => (
                      <FilterOption key={month} type="button" role="menuitemradio" aria-checked={monthFilter === month} $selected={monthFilter === month} onClick={() => selectFilter(() => setMonthFilter(month))}>{month.replace('.', '년 ')}월</FilterOption>
                    ))}
                  </FilterMenu>
                )}
              </FilterGroup>
              <FilterSummary>{data.taskRows.length}건 중 {filteredRows.length}건</FilterSummary>
              {hasActiveFilter && <ClearFilters type="button" onClick={clearFilters}>필터 초기화</ClearFilters>}
            </SortBar>
          </SectionHeader>

          <TableContainer>
            <TableHeaderRow>
              <Cell $width={140}>요청번호</Cell>
              <Cell $width={180}>고객사명</Cell>
              <Cell $width={160}>데이터 유형</Cell>
              <Cell $flex>데이터 상세</Cell>
              <Cell $width={120}>담당자</Cell>
              <Cell $width={110}>등록일</Cell>
              <Cell $width={110}>작업수정일</Cell>
              <Cell $width={120}>상태</Cell>
            </TableHeaderRow>
            <TableBody>
              {pagedRows.length === 0 && <EmptyState>선택한 조건에 해당하는 작업이 없습니다.</EmptyState>}
              {pagedRows.map((row) => (
                <TableRowEl
                  key={row.reqId}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`${taskDetailRoute[row.status]}?requestNo=${encodeURIComponent(row.reqId)}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`${taskDetailRoute[row.status]}?requestNo=${encodeURIComponent(row.reqId)}`)
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  aria-label={`${row.reqId} 작업 상세 보기`}
                >
                  <ReqIdCell $width={140}>{row.reqId}</ReqIdCell>
                  <ClientCell $width={180}>{row.client}</ClientCell>
                  <Cell $width={160} style={{ color: '#495057' }}>
                    {row.dataType}
                  </Cell>
                  <Cell $flex style={{ color: '#495057' }}>
                    {row.detail}
                  </Cell>
                  <Cell $width={120} style={{ color: '#495057' }}>
                    {row.assignee}
                  </Cell>
                  <MutedCell $width={110}>{row.createdAt}</MutedCell>
                  <MutedCell $width={110}>{row.updatedAt}</MutedCell>
                  <StatusCell $width={120}>
                    <StatusPill $bg={taskStatusColors[row.status].bg} $color={taskStatusColors[row.status].color}>
                      {row.status}
                    </StatusPill>
                  </StatusCell>
                </TableRowEl>
              ))}
            </TableBody>
          </TableContainer>

          <Pagination>
            <PageNav type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <NavIcon src={chevronLeftSrc} alt="이전" />
            </PageNav>
            <PageNumbers>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageNumber key={n} type="button" $active={n === page} onClick={() => setPage(n)}>
                  {n}
                </PageNumber>
              ))}
            </PageNumbers>
            <PageNav type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <NavIcon src={chevronRightSrc} alt="다음" />
            </PageNav>
          </Pagination>
        </TableSection>
      </MainContent>
    </PageWrapper>
  )
}
