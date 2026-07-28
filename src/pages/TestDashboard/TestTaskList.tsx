import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import { GhostButton } from '../../shared/layout.styles'
import { Cell, MutedCell, ReqIdCell, SortBar, StatusCell, StatusPill, TableBody, TableContainer, TableHeaderRow, TableRowEl } from '../../shared/Table.styles'
import { colors } from '../../shared/theme'

const statuses = ['전체 단계', '요구사항 분석', '샘플 데이터', '최종 산출물', '완료']
const detailStatuses = ['요구사항 분석', '요구사항 분석 진행', '요구사항 완료 피드백', '데이터 선별 진행', '샘플데이터 및 피드백', '데이터 가공 진행', '최종 산출물 및 피드백', '작업완료']
const people = ['홍길동', '김하나', '이민수', '박지은', '최유진']
const clients = ['포트폴리오 데모', '하나금융', '하나생명', '하나캐피탈', '하나저축은행']
const groups = ['요구사항 분석', '요구사항 분석', '요구사항 분석', '샘플 데이터', '샘플 데이터', '최종 산출물', '최종 산출물', '완료']
const tones = [{ bg: colors.dangerBg, color: colors.danger }, { bg: colors.warningBg, color: colors.warning }, { bg: colors.warningBg, color: colors.warning }, { bg: colors.infoBg, color: colors.info }, { bg: colors.warningBgAlt, color: colors.warningAlt }, { bg: '#fce7f3', color: '#db2777' }, { bg: colors.dangerBg, color: colors.danger }, { bg: colors.successBg, color: colors.success }] as const
const routes = ['/tasks/review', '/tasks/review', '/tasks/review', '/tasks/selection', '/tasks/sample-feedback', '/tasks/processing', '/tasks/final-feedback', '/tasks/complete']
const priorityFilters = ['requirement', 'sample', 'final'] as const
type PriorityFilter = (typeof priorityFilters)[number]
const priorityLabels: Record<PriorityFilter, string> = { requirement: '요구사항 승인·반려', sample: '샘플 데이터 승인·반려', final: '최종 산출물 승인·반려' }
const tasks = Array.from({ length: 50 }, (_, index) => { const stage = index % 8; const priority = priorityFilters[index % priorityFilters.length]; return { no: `REQ-2026-${String(150 - index).padStart(4, '0')}`, client: clients[index % clients.length], title: `${['카드 승인 데이터', '고객 행동 분석', '가맹점 매출', '금융상품 가입'][index % 4]} 정기 요청`, person: people[index % people.length], status: detailStatuses[stage], group: groups[stage], tone: tones[stage], priority, date: `2026-07-${String(28 - (index % 20)).padStart(2, '0')}`, route: routes[stage] } })

export default function TestTaskList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPriority = searchParams.get('filter')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter | 'all'>(priorityFilters.includes(initialPriority as PriorityFilter) ? initialPriority as PriorityFilter : 'all')
  const [filter, setFilter] = useState('전체 단계')
  const [pageSize, setPageSize] = useState<30 | 50>(30)
  const filtered = useMemo(() => tasks.filter((task) => (priorityFilter === 'all' || task.priority === priorityFilter) && (filter === '전체 단계' || task.group === filter)), [filter, priorityFilter])
  function updatePriorityFilter(value: PriorityFilter | 'all') {
    setPriorityFilter(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('filter')
    else next.set('filter', value)
    setSearchParams(next)
  }
  return <PageWrapper><GNB /><SubNav activeTo="/test/tasks" items={[{ label: '대시보드', to: '/test/dashboard' }, { label: '내 작업 현황', to: '/dashboard/my-tasks' }, { label: '전체 작업 관리 리스트', to: '/test/tasks' }]} /><MainContent><SectionHeader><SectionTitle>{priorityFilter === 'all' ? '전체 작업 관리 리스트' : `${priorityLabels[priorityFilter]} 작업 리스트`}</SectionTitle><SortBar><select aria-label="우선순위 필터" value={priorityFilter} onChange={(event) => updatePriorityFilter(event.target.value as PriorityFilter | 'all')} style={{ padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.white, color: colors.textSecondary, fontSize: 13 }}><option value="all">전체 우선순위</option>{priorityFilters.map((value) => <option key={value} value={value}>{priorityLabels[value]}</option>)}</select><select aria-label="작업 단계 필터" value={filter} onChange={(event) => setFilter(event.target.value)} style={{ padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.white, color: colors.textSecondary, fontSize: 13 }}><option value="전체 단계">전체 단계</option>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select><GhostButton type="button" onClick={() => setPageSize(30)} style={{ color: pageSize === 30 ? colors.primary : colors.textMuted }}>30개</GhostButton><GhostButton type="button" onClick={() => setPageSize(50)} style={{ color: pageSize === 50 ? colors.primary : colors.textMuted }}>50개</GhostButton><span style={{ color: colors.textMuted, fontSize: 12 }}>{filtered.length}건 중 {Math.min(filtered.length, pageSize)}건</span></SortBar></SectionHeader><TableContainer><TableHeaderRow><Cell $width={150}>요청번호</Cell><Cell $width={140}>고객사</Cell><Cell $flex>작업명</Cell><Cell $width={110}>담당자</Cell><Cell $width={190}>상세 단계</Cell><Cell $width={110}>등록일</Cell><Cell $width={120}>상태 그룹</Cell></TableHeaderRow><TableBody>{filtered.slice(0, pageSize).map((task) => <TableRowEl key={task.no} role="link" tabIndex={0} onClick={() => navigate(`${task.route}?requestNo=${task.no}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`${task.route}?requestNo=${task.no}`) }} style={{ cursor: 'pointer' }}><ReqIdCell $width={150}>{task.no}</ReqIdCell><Cell $width={140}>{task.client}</Cell><Cell $flex>{task.title}</Cell><Cell $width={110}>{task.person}</Cell><Cell $width={190}>{task.status}</Cell><MutedCell $width={110}>{task.date}</MutedCell><StatusCell $width={120}><StatusPill $bg={task.tone.bg} $color={task.tone.color}>{task.group}</StatusPill></StatusCell></TableRowEl>)}</TableBody></TableContainer></MainContent></PageWrapper>
}
