import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { MainContent, PageWrapper, SectionHeader, SectionTitle, SectionTitleGroup } from '../../shared/layout.styles'
import {
  AlertBadge, AlertsRow, AlertsSection, CardBottom, CardTop, ColHeader, ColHeaderMeta, ColHeaderTitle,
  CountBadge, FootNote, InsightCol, InsightRow, ItemSubtitle, ItemTexts, ItemTitle, ListCol, RankNumber,
  RankedRow, SmallTag, StatCaption, StatCardEl, StatLabel, StatNumbers, StatUnit, StatValue, StatsRow,
  WarningCardEl, WarningDesc, WarningTitle, ActionLink,
} from '../PractitionerDashboard/PractitionerDashboardMain.styles'
import { colors } from '../../shared/theme'
import { fetchDashboard } from '../../shared/api'
import { useAsyncData } from '../../shared/hooks'

export default function TestDashboard() {
  const navigate = useNavigate()
  const { data } = useAsyncData(fetchDashboard)
  if (!data) return null
  const livePriorities = data.priority_cards.map((item) => ({ label: item.label, value: item.count, caption: '승인·반려가 필요한 작업', highlight: item.count > 0, filter: item.priority_code === 'REQUIREMENT' ? 'requirement' : item.priority_code === 'SAMPLE' ? 'sample' : 'final' }))
  const livePriorityActions = data.priority_actions.slice(0, 5).map((item) => ({
    requestNo: item.request_no,
    title: item.title,
    description: `${item.request_no} · ${item.client} · 담당 ${item.assignee_name}`,
    stageLabel: item.stage_label,
    route: `${item.detail_route}${item.detail_route.includes('?') ? '&' : '?'}requestNo=${encodeURIComponent(item.request_no)}`,
  }))
  const liveProducts = data.popular_products.map((item) => `${item.product_name} (${item.request_count}건)`)
  const liveApprovalTasks = data.approval_tasks.slice(0, 5).map((item) => [item.request_no, item.title, item.stage_label, item.detail_route] as const)
  return <PageWrapper><GNB /><SubNav activeTo="/dashboard" items={[{ label: '대시보드', to: '/dashboard' }, { label: '내 작업 현황', to: '/dashboard/my-tasks' }, { label: '전체 작업 관리 리스트', to: '/dashboard/tasks' }]} /><MainContent>
    <StatsRow>{livePriorities.map((item) => <StatCardEl key={item.label} $highlight={item.highlight} role="link" tabIndex={0} aria-label={`${item.label} 작업 목록 보기`} onClick={() => navigate(`/dashboard/tasks?filter=${item.filter}`)} style={{ cursor: 'pointer' }}><StatLabel $highlight={item.highlight}>{item.label}</StatLabel><StatNumbers><StatValue $highlight={item.highlight}>{item.value}</StatValue><StatUnit $highlight={item.highlight}>건</StatUnit></StatNumbers><StatCaption $highlight={item.highlight}>{item.caption}</StatCaption></StatCardEl>)}</StatsRow>
    <AlertsSection><SectionHeader><SectionTitleGroup><SectionTitle>우선 조치 TOP 5 (Human Intervention Required)</SectionTitle><AlertBadge>{livePriorityActions.length}건 우선 확인</AlertBadge></SectionTitleGroup></SectionHeader><AlertsRow style={{ flexWrap: 'wrap' }}>{livePriorityActions.map((item, index) => <WarningCardEl key={item.requestNo} $urgent={index === 0} style={{ minWidth: 'calc(33.333% - 11px)' }}><CardTop><WarningTitle>{item.title}</WarningTitle><CountBadge $bg={index === 0 ? colors.dangerBg : colors.warningBg} $color={index === 0 ? colors.danger : colors.warning}>승인 대기</CountBadge></CardTop><WarningDesc>{item.description}</WarningDesc><CardBottom><FootNote>{item.stageLabel} · 즉시 확인 필요</FootNote><ActionLink type="button" onClick={() => navigate(item.route)}>상세 조치 &gt;</ActionLink></CardBottom></WarningCardEl>)}</AlertsRow></AlertsSection>
    <InsightRow><InsightCol><ColHeader><ColHeaderTitle>인기 데이터 상품 TOP 5</ColHeaderTitle><ColHeaderMeta>최근 7일 기준</ColHeaderMeta></ColHeader><ListCol>{liveProducts.map((title, index) => <RankedRow key={title}><RankNumber>{index + 1}</RankNumber><ItemTexts><ItemTitle>{title}</ItemTitle><ItemSubtitle>실제 API 집계 데이터</ItemSubtitle></ItemTexts><SmallTag $bg={colors.successBg} $color={colors.success}>요청</SmallTag></RankedRow>)}</ListCol></InsightCol><InsightCol><ColHeader><ColHeaderTitle>승인·반려 대기 작업 TOP 5</ColHeaderTitle><ColHeaderMeta $danger>HITL 우선 처리</ColHeaderMeta></ColHeader><ListCol>{liveApprovalTasks.map(([requestNo, title, hitlStage, route], index) => <RankedRow key={requestNo} role="link" tabIndex={0} onClick={() => navigate(`${route}?requestNo=${requestNo}`)} style={{ cursor: 'pointer' }}><RankNumber>{index + 1}</RankNumber><ItemTexts><ItemTitle>{title}</ItemTitle><ItemSubtitle>{requestNo} · {hitlStage}</ItemSubtitle></ItemTexts><SmallTag $bg={colors.dangerBg} $color={colors.danger}>결정 대기</SmallTag></RankedRow>)}</ListCol></InsightCol></InsightRow>
  </MainContent></PageWrapper>
}
