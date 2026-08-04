import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import type { PriorityCode } from '../../shared/api'
import { chevronDownSrc, chevronLeftSrc, chevronRightSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { GhostButton, MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import { colors } from '../../shared/theme'
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
  fetchTaskListRows,
  PRACTITIONER_NAV_ITEMS,
  PRIORITY_LABELS,
  TASK_FILTER_STAGES,
  taskFilterStageForStatus,
  taskStatusColors,
  type TaskFilterStage,
  type TaskRow,
} from './data'
import {
  ClearFilters,
  EmptyState,
  FilterGroup,
  FilterMenu,
  FilterOption,
  FilterSummary,
  TableSection,
} from './PractitionerDashboardMain.styles'

const VALID_PRIORITIES = new Set<PriorityCode>(['REQUIREMENT', 'SAMPLE', 'FINAL'])
const EMPTY_ROWS: TaskRow[] = []

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

/**
 * /dashboard의 우선순위 StatCard·경고카드는 ?priority=REQUIREMENT|SAMPLE|FINAL 로 여기 도착한다
 * (백엔드 priority_cards[].detail_route가 이미 이 규격). 여기서 /api/v1/dashboard/tasks를
 * 직접 호출해 서버사이드로 필터링한다 — /dashboard가 쓰는 priority_actions/approval_tasks는
 * 백엔드에서 상위 5건으로 캡되어 있어(action_items[:5]) 우선순위 카드 count와 실제 표시 가능한
 * 행 수가 안 맞았기 때문.
 */
export default function TaskList() {
  const [searchParams] = useSearchParams()
  const priorityParam = searchParams.get('priority')
  const priority = VALID_PRIORITIES.has(priorityParam as PriorityCode) ? (priorityParam as PriorityCode) : undefined

  const fetcher = useCallback(() => fetchTaskListRows(priority), [priority])
  const { data, loading, error } = useAsyncData(fetcher)
  const rows = data ?? EMPTY_ROWS

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<30 | 50>(30)
  const [statusFilter, setStatusFilter] = useState<TaskFilterStage | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [openFilter, setOpenFilter] = useState<'status' | 'assignee' | 'month' | null>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const assigneeOptions = useMemo(
    () => [...new Set(rows.map((row) => row.assignee))].sort((a, b) => a.localeCompare(b, 'ko')),
    [rows],
  )
  const monthOptions = useMemo(
    () => [...new Set(rows.map((row) => row.createdAt.slice(0, 7)))].sort().reverse(),
    [rows],
  )
  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter !== 'all' && taskFilterStageForStatus[row.status] !== statusFilter) return false
        if (assigneeFilter !== 'all' && row.assignee !== assigneeFilter) return false
        if (monthFilter !== 'all' && row.createdAt.slice(0, 7) !== monthFilter) return false
        return true
      }),
    [assigneeFilter, monthFilter, statusFilter, rows],
  )

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

  return (
    <PageWrapper>
      <GNB />
      <SubNav activeTo="/dashboard/tasks" items={PRACTITIONER_NAV_ITEMS} />
      <MainContent>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && rows.length === 0} subject="작업 리스트 데이터" />
        <TableSection>
          <SectionHeader>
            <SectionTitle>
              전체 작업 관리 리스트{priority ? ` · ${PRIORITY_LABELS[priority]} 우선순위만 표시 중` : ''}
            </SectionTitle>
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
              <FilterSummary>{rows.length}건 중 {filteredRows.length}건</FilterSummary>
              {hasActiveFilter && <ClearFilters type="button" onClick={clearFilters}>필터 초기화</ClearFilters>}
              <GhostButton
                type="button"
                onClick={() => {
                  setPageSize(30)
                  setPage(1)
                }}
                style={{ color: pageSize === 30 ? colors.primary : colors.textMuted }}
              >
                30개
              </GhostButton>
              <GhostButton
                type="button"
                onClick={() => {
                  setPageSize(50)
                  setPage(1)
                }}
                style={{ color: pageSize === 50 ? colors.primary : colors.textMuted }}
              >
                50개
              </GhostButton>
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
