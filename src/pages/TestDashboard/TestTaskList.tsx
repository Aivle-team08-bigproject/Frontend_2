import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import { GhostButton } from '../../shared/layout.styles'
import { Cell, MutedCell, ReqIdCell, SortBar, StatusCell, StatusPill, TableBody, TableContainer, TableHeaderRow, TableRowEl } from '../../shared/Table.styles'
import { colors } from '../../shared/theme'
import { fetchDashboardTasks, type DashboardTaskItem } from '../../shared/api'
import { useAsyncData } from '../../shared/hooks'

const statuses = ['전체 단계', '요구사항 분석', '샘플 데이터', '최종 산출물', '완료']
const detailStatuses = ['요구사항 분석', '요구사항 분석 진행', '요구사항 완료 피드백', '데이터 선별 진행', '샘플데이터 및 피드백', '데이터 가공 진행', '최종 산출물 및 피드백', '작업완료']
const tones = [{ bg: colors.dangerBg, color: colors.danger }, { bg: colors.warningBg, color: colors.warning }, { bg: colors.warningBg, color: colors.warning }, { bg: colors.infoBg, color: colors.info }, { bg: colors.warningBgAlt, color: colors.warningAlt }, { bg: '#fce7f3', color: '#db2777' }, { bg: colors.dangerBg, color: colors.danger }, { bg: colors.successBg, color: colors.success }] as const
const priorityFilters = ['requirement', 'sample', 'final'] as const
type PriorityFilter = (typeof priorityFilters)[number]
const priorityLabels: Record<PriorityFilter, string> = { requirement: '요구사항 승인·반려', sample: '샘플 데이터 승인·반려', final: '최종 산출물 승인·반려' }

function taskFromApi(item: DashboardTaskItem, index: number) {
  const stageIndex = detailStatuses.findIndex((status) => status === item.stage_label)
  const safeStage = stageIndex >= 0 ? stageIndex : index % detailStatuses.length
  return {
    no: item.request_no,
    client: item.client,
    title: item.title,
    person: item.assignee_name,
    status: item.stage_label || detailStatuses[safeStage],
    group: item.stage_group_code === 'REQUIREMENT_ANALYSIS' ? '요구사항 분석' : item.stage_group_code === 'SAMPLE_DATA' ? '샘플 데이터' : item.stage_group_code === 'FINAL_OUTPUT' ? '최종 산출물' : '완료',
    tone: tones[safeStage],
    priority: item.priority_code === 'REQUIREMENT' ? 'requirement' : item.priority_code === 'SAMPLE' ? 'sample' : item.priority_code === 'FINAL' ? 'final' : null,
    requiresAction: item.requires_action,
    date: item.created_at.slice(0, 10),
    route: item.detail_route,
  }
}

export default function TestTaskList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPriority = searchParams.get('filter')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter | 'all'>(priorityFilters.includes(initialPriority as PriorityFilter) ? initialPriority as PriorityFilter : 'all')
  const [filter, setFilter] = useState('전체 단계')
  const [pageSize, setPageSize] = useState<30 | 50>(30)
  const loadTasks = useCallback(() => fetchDashboardTasks({ page_size: 50 }), [])
  const { data: apiData } = useAsyncData(loadTasks)
  const liveTasks = useMemo(() => apiData?.items.map(taskFromApi) ?? [], [apiData])
  const visibleTasks = liveTasks
  const filtered = useMemo(() => visibleTasks.filter((task) => (priorityFilter === 'all' || (task.priority === priorityFilter && task.requiresAction)) && (filter === '전체 단계' || task.group === filter)), [filter, priorityFilter, visibleTasks])
  function updatePriorityFilter(value: PriorityFilter | 'all') {
    setPriorityFilter(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('filter')
    else next.set('filter', value)
    setSearchParams(next)
  }
  return <PageWrapper><GNB /><SubNav activeTo="/dashboard/tasks" items={[{ label: '대시보드', to: '/dashboard' }, { label: '내 작업 현황', to: '/dashboard/my-tasks' }, { label: '전체 작업 관리 리스트', to: '/dashboard/tasks' }]} /><MainContent><SectionHeader><SectionTitle>{priorityFilter === 'all' ? '전체 작업 관리 리스트' : `${priorityLabels[priorityFilter]} 작업 리스트`}</SectionTitle><SortBar><select aria-label="우선순위 필터" value={priorityFilter} onChange={(event) => updatePriorityFilter(event.target.value as PriorityFilter | 'all')} style={{ padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.white, color: colors.textSecondary, fontSize: 13 }}><option value="all">전체 우선순위</option>{priorityFilters.map((value) => <option key={value} value={value}>{priorityLabels[value]}</option>)}</select><select aria-label="작업 단계 필터" value={filter} onChange={(event) => setFilter(event.target.value)} style={{ padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.white, color: colors.textSecondary, fontSize: 13 }}><option value="전체 단계">전체 단계</option>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select><GhostButton type="button" onClick={() => setPageSize(30)} style={{ color: pageSize === 30 ? colors.primary : colors.textMuted }}>30개</GhostButton><GhostButton type="button" onClick={() => setPageSize(50)} style={{ color: pageSize === 50 ? colors.primary : colors.textMuted }}>50개</GhostButton><span style={{ color: colors.textMuted, fontSize: 12 }}>{filtered.length}건 중 {Math.min(filtered.length, pageSize)}건</span></SortBar></SectionHeader><TableContainer><TableHeaderRow><Cell $width={150}>요청번호</Cell><Cell $width={140}>고객사</Cell><Cell $flex>작업명</Cell><Cell $width={110}>담당자</Cell><Cell $width={190}>상세 단계</Cell><Cell $width={110}>등록일</Cell><Cell $width={120}>상태 그룹</Cell></TableHeaderRow><TableBody>{filtered.slice(0, pageSize).map((task) => { const detailUrl = `${task.route}${task.route.includes('?') ? '&' : '?'}requestNo=${encodeURIComponent(task.no)}`; return <TableRowEl key={task.no} role="link" tabIndex={0} onClick={() => navigate(detailUrl)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(detailUrl) }} style={{ cursor: 'pointer' }}><ReqIdCell $width={150}>{task.no}</ReqIdCell><Cell $width={140}>{task.client}</Cell><Cell $flex>{task.title}</Cell><Cell $width={110}>{task.person}</Cell><Cell $width={190}>{task.status}</Cell><MutedCell $width={110}>{task.date}</MutedCell><StatusCell $width={120}><StatusPill $bg={task.tone.bg} $color={task.tone.color}>{task.group}</StatusPill></StatusCell></TableRowEl> })}</TableBody></TableContainer></MainContent></PageWrapper>
}
