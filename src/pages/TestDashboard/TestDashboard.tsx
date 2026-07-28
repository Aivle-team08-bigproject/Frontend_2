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

const priorities = [
  { label: '요구사항 승인·반려', value: 12, caption: '요구사항 분석 후 HITL', highlight: true, filter: 'requirement' },
  { label: '샘플 데이터 승인·반려', value: 8, caption: '샘플 생성 후 HITL', filter: 'sample' },
  { label: '최종 산출물 승인·반려', value: 5, caption: '최종 산출물 제작 후 HITL', filter: 'final' },
]

const alerts = [
  ['요구사항 승인·반려 대기', 'REQ-2026-0148 · 포트폴리오 데모', '대기 4건', '/tasks/review'],
  ['샘플 데이터 승인·반려 대기', 'REQ-2026-0142 · 하나금융', '대기 3건', '/tasks/sample-feedback'],
  ['최종 산출물 승인·반려 대기', 'REQ-2026-0137 · 하나생명', '대기 5건', '/tasks/final-feedback'],
]

const topProducts = ['카드 결제·승인 데이터', '고객 행동 분석 데이터', '가맹점 매출 데이터', '금융상품 가입 데이터', '고객센터 상담 데이터']
const approvalTasks = [
  ['REQ-2026-0148', '요구사항 분석 결과 승인·반려', '요구사항 HITL', '/tasks/review'],
  ['REQ-2026-0145', '샘플 데이터 컬럼 생성 결과 승인·반려', '샘플 데이터 HITL', '/tasks/sample-feedback'],
  ['REQ-2026-0141', '더미 데이터 생성 결과 승인·반려', '샘플 데이터 HITL', '/tasks/sample-feedback'],
  ['REQ-2026-0139', '최종 산출물 제작 결과 승인·반려', '최종 산출물 HITL', '/tasks/final-feedback'],
  ['REQ-2026-0136', '최종 데이터 가공 결과 승인·반려', '최종 산출물 HITL', '/tasks/final-feedback'],
]

export default function TestDashboard() {
  const navigate = useNavigate()
  return <PageWrapper><GNB /><SubNav activeTo="/test/dashboard" items={[{ label: '대시보드', to: '/test/dashboard' }, { label: '내 작업 현황', to: '/dashboard/my-tasks' }, { label: '전체 작업 관리 리스트', to: '/test/tasks' }]} /><MainContent>
    <StatsRow>{priorities.map((item) => <StatCardEl key={item.label} $highlight={item.highlight} role="link" tabIndex={0} aria-label={`${item.label} 작업 목록 보기`} onClick={() => navigate(`/test/tasks?filter=${item.filter}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/test/tasks?filter=${item.filter}`) }} style={{ cursor: 'pointer' }}><StatLabel $highlight={item.highlight}>{item.label}</StatLabel><StatNumbers><StatValue $highlight={item.highlight}>{item.value}</StatValue><StatUnit $highlight={item.highlight}>건</StatUnit></StatNumbers><StatCaption $highlight={item.highlight}>{item.caption} · 목록 보기</StatCaption></StatCardEl>)}</StatsRow>
    <AlertsSection><SectionHeader><SectionTitleGroup><SectionTitle>우선 조치 TOP 5 (Human Intervention Required)</SectionTitle><AlertBadge>5건 우선 확인</AlertBadge></SectionTitleGroup></SectionHeader><AlertsRow style={{ flexWrap: 'wrap' }}>{alerts.map(([title, description, count, route], index) => <WarningCardEl key={title} $urgent={index === 0} style={{ minWidth: 'calc(33.333% - 11px)' }}><CardTop><WarningTitle>{title}</WarningTitle><CountBadge $bg={index === 0 ? colors.dangerBg : colors.warningBg} $color={index === 0 ? colors.danger : colors.warning}>{count}</CountBadge></CardTop><WarningDesc>{description}</WarningDesc><CardBottom><FootNote>즉시 확인 필요</FootNote><ActionLink type="button" onClick={() => navigate(route)}>상세 조치 &gt;</ActionLink></CardBottom></WarningCardEl>)}</AlertsRow></AlertsSection>
    <InsightRow><InsightCol><ColHeader><ColHeaderTitle>인기 데이터 상품 TOP 5</ColHeaderTitle><ColHeaderMeta>최근 7일 기준</ColHeaderMeta></ColHeader><ListCol>{topProducts.map((title, index) => <RankedRow key={title}><RankNumber>{index + 1}</RankNumber><ItemTexts><ItemTitle>{title}</ItemTitle><ItemSubtitle>테스트 샘플 데이터</ItemSubtitle></ItemTexts><SmallTag $bg={colors.successBg} $color={colors.success}>요청 {38 - index * 5}건</SmallTag></RankedRow>)}</ListCol></InsightCol><InsightCol><ColHeader><ColHeaderTitle>승인·반려 대기 작업 TOP 5</ColHeaderTitle><ColHeaderMeta $danger>HITL 우선 처리</ColHeaderMeta></ColHeader><ListCol>{approvalTasks.map(([requestNo, title, hitlStage, route], index) => <RankedRow key={requestNo} role="link" tabIndex={0} onClick={() => navigate(`${route}?requestNo=${requestNo}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`${route}?requestNo=${requestNo}`) }} style={{ cursor: 'pointer' }}><RankNumber>{index + 1}</RankNumber><ItemTexts><ItemTitle>{title}</ItemTitle><ItemSubtitle>{requestNo} · {hitlStage}</ItemSubtitle></ItemTexts><SmallTag $bg={colors.dangerBg} $color={colors.danger}>결정 대기</SmallTag></RankedRow>)}</ListCol></InsightCol></InsightRow>
  </MainContent></PageWrapper>
}
