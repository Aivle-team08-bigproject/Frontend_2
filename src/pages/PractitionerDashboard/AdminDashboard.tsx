import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { fetchAdminDashboard } from '../../shared/api'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import { PRACTITIONER_NAV_ITEMS } from './data'
import { EmptyState, TableSection } from './PractitionerDashboardMain.styles'
import { Cell, StatusCell, StatusPill, StrongCell, TableBody, TableContainer, TableHeaderRow, TableRowEl } from '../../shared/Table.styles'
import { dashboardStatusTone } from '../../shared/pipelineLabels'

const ATTENTION_LABELS: Record<string, string> = {
  deadline_soon: '마감 임박 작업',
  overdue: '기한 초과 작업',
  repeated_failures: '반복 실패 작업',
  final_outputs_for_review: '최종 산출물 검토 대기',
}

export default function AdminDashboard() {
  const fetcher = useCallback(fetchAdminDashboard, [])
  const { data, loading, error } = useAsyncData(fetcher)
  const navigate = useNavigate()
  const summary = data?.summary

  return <PageWrapper>
    <GNB />
    <SubNav activeTo="/dashboard/overview" items={[...PRACTITIONER_NAV_ITEMS, { label: '관리자 Dashboard', to: '/dashboard/overview' }]} />
    <MainContent>
      <DataStateNotice loading={loading} error={error} empty={!loading && !error && !data} subject="관리자 Dashboard" />
      {summary && <TableSection>
        <SectionHeader><SectionTitle>전체 작업 현황 · 총 {summary.total_count}건 / 진행 {summary.active_count}건 / 검토 대기 {summary.waiting_review_count}건 / 실패 {summary.failed_count}건</SectionTitle></SectionHeader>
      </TableSection>}
      {data && <>
        <TableSection>
          <SectionHeader><SectionTitle>담당자별 진행도</SectionTitle></SectionHeader>
          <TableContainer><TableHeaderRow><Cell $width={180}>담당자</Cell><Cell $width={120}>전체</Cell><Cell $width={120}>완료</Cell><Cell $width={120}>검토 대기</Cell><Cell $width={120}>실패</Cell><Cell $flex>평균 진행률</Cell></TableHeaderRow><TableBody>{data.assignee_progress.map((row) => <TableRowEl key={row.assignee_code ?? 'unassigned'}><StrongCell $width={180}>{row.assignee_name}</StrongCell><Cell $width={120}>{row.total_count}</Cell><Cell $width={120}>{row.completed_count}</Cell><Cell $width={120}>{row.waiting_review_count}</Cell><Cell $width={120}>{row.failed_count}</Cell><Cell $flex>{row.progress_percent}%</Cell></TableRowEl>)}</TableBody></TableContainer>
        </TableSection>
        {Object.entries(data.attention_items).map(([key, items]) => <TableSection key={key}>
          <SectionHeader><SectionTitle>{ATTENTION_LABELS[key] ?? key} · {items.length}건</SectionTitle></SectionHeader>
          <TableContainer><TableHeaderRow><Cell $width={160}>요청번호</Cell><Cell $flex>작업명</Cell><Cell $width={150}>담당자</Cell><Cell $width={120}>상태</Cell></TableHeaderRow><TableBody>{items.length === 0 ? <EmptyState>해당 작업이 없습니다.</EmptyState> : items.map((item) => { const tone = dashboardStatusTone(item.status_group_code); return <TableRowEl key={item.request_no} role="link" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => navigate(item.detail_route)}><StrongCell $width={160}>{item.request_no}</StrongCell><Cell $flex>{item.title}</Cell><Cell $width={150}>{item.assignee_name}</Cell><StatusCell $width={120}><StatusPill $bg={tone.bg} $color={tone.color}>{tone.label}</StatusPill></StatusCell></TableRowEl> })}</TableBody></TableContainer>
        </TableSection>)}
      </>}
    </MainContent>
  </PageWrapper>
}
