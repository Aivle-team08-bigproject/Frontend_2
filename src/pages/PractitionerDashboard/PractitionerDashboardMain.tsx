import { useMemo, useState } from 'react'
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
import { fetchPractitionerDashboardData, taskStatusColors } from './data'
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
  const navigate = useNavigate()

  const taskDetailRoute = {
    '요구사항 분석': '/tasks/review',
    진행중: '/tasks/selection',
    가공중: '/tasks/processing',
    완료: '/tasks/complete',
  } as const

  const pageSize = data?.pageSize ?? 4
  const totalPages = data ? Math.max(1, Math.ceil(data.taskRows.length / pageSize)) : 1
  const pagedRows = useMemo(() => {
    if (!data) return []
    const start = (page - 1) * pageSize
    return data.taskRows.slice(start, start + pageSize)
  }, [data, page, pageSize])

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
            <SortBar>
              <SortChip type="button">
                단계별 상태
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
              <SortChip type="button">
                담당자
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
              <SortChip type="button">
                날짜
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
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
