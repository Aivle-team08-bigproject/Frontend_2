import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import SubNav from '../../shared/SubNav'
import type { DashboardPageSize, DashboardTaskItem, PriorityCode, StageGroupCode, StatusGroupCode } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { fetchDashboardTasks } from '../../shared/api'
import { chevronDownSrc, chevronLeftSrc, chevronRightSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { formatDate } from '../../shared/datetime'
import { dashboardStatusTone } from '../../shared/pipelineLabels'
import { GhostButton, MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import {
  Cell, MutedCell, NavIcon, PageNav, PageNumber, PageNumbers, Pagination, ReqIdCell,
  SortBar, SortChip, SortChipIcon, StatusCell, StatusPill, StrongCell as ClientCell,
  TableBody, TableContainer, TableHeaderRow, TableRowEl,
  SortDirectionIcon, SortHeaderButton,
} from '../../shared/Table.styles'
import { PRACTITIONER_NAV_ITEMS, PRIORITY_LABELS } from './data'
import { ClearFilters, EmptyState, FilterGroup, FilterMenu, FilterOption, FilterSummary, TableSection } from './PractitionerDashboardMain.styles'

const VALID_PRIORITIES = new Set<PriorityCode>(['REQUIREMENT', 'SAMPLE', 'FINAL'])
const STAGES: Array<{ value: StageGroupCode; label: string }> = [
  { value: 'REQUIREMENT_ANALYSIS', label: '요구사항 분석' },
  { value: 'SAMPLE_DATA', label: '샘플 데이터' },
  { value: 'FINAL_OUTPUT', label: '최종 산출물' },
  { value: 'COMPLETED', label: '완료' },
]
const STATUSES: Array<{ value: StatusGroupCode; label: string }> = [
  { value: 'waiting_review', label: '검토 대기' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'failed', label: '실패' },
  { value: 'overdue', label: '기한 초과' },
]

function priorityFromParams(params: URLSearchParams): PriorityCode | undefined {
  const priority = params.get('priority')
  if (VALID_PRIORITIES.has(priority as PriorityCode)) return priority as PriorityCode
  const legacy = params.get('filter')
  return legacy === 'requirement' ? 'REQUIREMENT' : legacy === 'sample' ? 'SAMPLE' : legacy === 'final' ? 'FINAL' : undefined
}

function monthRange(month: string | null): Pick<Parameters<typeof fetchDashboardTasks>[0], 'created_from' | 'created_to'> {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return {}
  const [year, value] = month.split('-').map(Number)
  const lastDay = new Date(year, value, 0).getDate()
  return { created_from: `${month}-01`, created_to: `${month}-${String(lastDay).padStart(2, '0')}` }
}

export default function TaskList() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const filterBarRef = useRef<HTMLDivElement>(null)
  const [openFilter, setOpenFilter] = useState<'stage' | 'status' | 'assignee' | 'month' | null>(null)
  const priority = priorityFromParams(params)
  const scope = params.get('scope') === 'all' ? 'all' : 'mine'
  const stage = params.get('stage') as StageGroupCode | null
  const status = params.get('status') as StatusGroupCode | null
  const assignee = params.get('assignee')
  const month = params.get('month')
  const dueFrom = params.get('due_from')
  const dueTo = params.get('due_to')
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1)
  const pageSize = ([30, 50, 100].includes(Number(params.get('page_size'))) ? Number(params.get('page_size')) : 30) as DashboardPageSize
  const createdSort = params.get('created_sort') === 'asc' ? 'asc' : 'desc'

  const fetcher = useCallback(
    () => fetchDashboardTasks({
      scope, search: params.get('search') || undefined, priority, stage: stage || undefined,
      status: status || undefined, assignee: assignee || undefined, ...monthRange(month), page, page_size: pageSize,
      due_from: dueFrom || undefined, due_to: dueTo || undefined, created_sort: createdSort,
    }),
    [assignee, dueFrom, dueTo, month, page, pageSize, params, priority, scope, stage, status],
  )
  const { data, loading, error } = useAsyncData(fetcher)
  const { data: user } = useAsyncData(fetchCurrentUser)
  const items = useMemo(() => data?.items ?? [], [data])
  const canViewAll = user?.permissions.includes('CONTRACT_MANAGE') ?? false
  const assigneeOptions = useMemo(
    () => [...new Map(items.filter((item) => item.assignee_code).map((item) => [item.assignee_code!, item.assignee_name])).entries()],
    [items],
  )

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!filterBarRef.current?.contains(event.target as Node)) setOpenFilter(null)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  function updateQuery(values: Record<string, string | undefined>) {
    const next = new URLSearchParams(params)
    Object.entries(values).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    if (!('page' in values)) next.set('page', '1')
    setParams(next)
    setOpenFilter(null)
  }

  function clearFilters() {
    const next = new URLSearchParams()
    if (scope === 'all') next.set('scope', 'all')
    next.set('page', '1')
    next.set('page_size', String(pageSize))
    setParams(next)
    setOpenFilter(null)
  }

  function toggleCreatedSort() {
    updateQuery({ created_sort: createdSort === 'desc' ? 'asc' : 'desc' })
  }

  const hasActiveFilter = Boolean(params.get('search') || priority || stage || status || assignee || month || dueFrom || dueTo)
  const pageCount = Math.max(1, Math.ceil((data?.total_count ?? 0) / pageSize))

  return (
    <PageWrapper>
      <GNB />
      <SubNav activeTo="/dashboard/tasks" items={PRACTITIONER_NAV_ITEMS} />
      <MainContent>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && data?.total_count === 0} subject="작업 리스트 데이터" />
        <TableSection>
          <SectionHeader>
            <SectionTitle>작업 리스트{priority ? ` · ${PRIORITY_LABELS[priority]} 우선순위` : ''}</SectionTitle>
            <SortBar ref={filterBarRef}>
              {canViewAll && (
                <GhostButton type="button" onClick={() => updateQuery({ scope: scope === 'all' ? undefined : 'all' })}>
                  {scope === 'all' ? '전체 작업 조회 중' : '내 작업만 보기'}
                </GhostButton>
              )}
              {(['stage', 'status', 'assignee', 'month'] as const).map((name) => {
                const label = name === 'stage' ? STAGES.find((option) => option.value === stage)?.label ?? '단계'
                  : name === 'status' ? STATUSES.find((option) => option.value === status)?.label ?? '상태'
                    : name === 'assignee' ? assigneeOptions.find(([code]) => code === assignee)?.[1] ?? '담당자'
                      : month ?? '등록 월'
                return (
                  <FilterGroup key={name}>
                    <SortChip type="button" aria-haspopup="menu" aria-expanded={openFilter === name} onClick={() => setOpenFilter((current) => current === name ? null : name)}>
                      {label}<SortChipIcon src={chevronDownSrc} alt="" />
                    </SortChip>
                    {openFilter === name && (
                      <FilterMenu role="menu" aria-label={`${label} 필터`}>
                        <FilterOption type="button" role="menuitemradio" aria-checked={false} $selected={false} onClick={() => updateQuery({ [name]: undefined })}>전체</FilterOption>
                        {name === 'stage' && STAGES.map((option) => <FilterOption key={option.value} type="button" role="menuitemradio" aria-checked={stage === option.value} $selected={stage === option.value} onClick={() => updateQuery({ stage: option.value })}>{option.label}</FilterOption>)}
                        {name === 'status' && STATUSES.map((option) => <FilterOption key={option.value} type="button" role="menuitemradio" aria-checked={status === option.value} $selected={status === option.value} onClick={() => updateQuery({ status: option.value, ...(option.value === 'waiting_review' ? {} : { priority: undefined, filter: undefined }) })}>{option.label}</FilterOption>)}
                        {name === 'assignee' && assigneeOptions.map(([code, label]) => <FilterOption key={code} type="button" role="menuitemradio" aria-checked={assignee === code} $selected={assignee === code} onClick={() => updateQuery({ assignee: code })}>{label}</FilterOption>)}
                        {name === 'month' && <input type="month" aria-label="등록 월" value={month ?? ''} onChange={(event) => updateQuery({ month: event.target.value || undefined })} />}
                      </FilterMenu>
                    )}
                  </FilterGroup>
                )
              })}
              <FilterSummary>{data?.total_count ?? 0}건</FilterSummary>
              {hasActiveFilter && <ClearFilters type="button" onClick={clearFilters}>필터 초기화</ClearFilters>}
              {([30, 50, 100] as DashboardPageSize[]).map((value) => <GhostButton key={value} type="button" onClick={() => updateQuery({ page_size: String(value), page: '1' })} style={{ opacity: pageSize === value ? 1 : 0.55 }}>{value}개</GhostButton>)}
            </SortBar>
          </SectionHeader>
          <TableContainer>
            <TableHeaderRow>
              <Cell $width={160}>요청번호</Cell><Cell $width={180}>고객사명</Cell><Cell $flex>작업명</Cell><Cell $width={120}>담당자</Cell><Cell $width={100}>진행률</Cell><SortHeaderButton type="button" $width={110} onClick={toggleCreatedSort} aria-label={`등록일 ${createdSort === 'desc' ? '오름차순' : '내림차순'}으로 정렬`}>등록일 <SortDirectionIcon $ascending={createdSort === 'asc'}>{createdSort === 'asc' ? '↑' : '↓'}</SortDirectionIcon></SortHeaderButton><Cell $width={140}>상태</Cell>
            </TableHeaderRow>
            <TableBody>
              {items.length === 0 && <EmptyState>선택한 조건에 해당하는 작업이 없습니다.</EmptyState>}
              {items.map((item: DashboardTaskItem) => {
                const tone = dashboardStatusTone(item.status_group_code)
                return <TableRowEl key={item.request_no} role="link" tabIndex={0} style={{ cursor: 'pointer' }} aria-label={`${item.request_no} 작업 상세 보기`} onClick={() => navigate(item.detail_route)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate(item.detail_route) } }}>
                  <ReqIdCell $width={160}>{item.request_no}</ReqIdCell><ClientCell $width={180}>{item.client}</ClientCell><Cell $flex>{item.title}</Cell><Cell $width={120}>{item.assignee_name}</Cell><Cell $width={100}>{item.progress_percent}%</Cell><MutedCell $width={110}>{formatDate(item.created_at)}</MutedCell><StatusCell $width={140}><StatusPill $bg={tone.bg} $color={tone.color}>{tone.label}</StatusPill></StatusCell>
                </TableRowEl>
              })}
            </TableBody>
          </TableContainer>
          <Pagination>
            <PageNav type="button" disabled={page === 1} onClick={() => updateQuery({ page: String(page - 1) })}><NavIcon src={chevronLeftSrc} alt="이전" /></PageNav>
            <PageNumbers>{Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 10).map((number) => <PageNumber key={number} type="button" $active={number === page} onClick={() => updateQuery({ page: String(number) })}>{number}</PageNumber>)}</PageNumbers>
            <PageNav type="button" disabled={page === pageCount} onClick={() => updateQuery({ page: String(page + 1) })}><NavIcon src={chevronRightSrc} alt="다음" /></PageNav>
          </Pagination>
        </TableSection>
      </MainContent>
    <Footer />
    </PageWrapper>
  )
}
