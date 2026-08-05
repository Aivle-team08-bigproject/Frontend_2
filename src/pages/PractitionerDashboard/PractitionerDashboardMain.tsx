import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper, SectionHeader, SectionTitle, SectionTitleGroup } from '../../shared/layout.styles'
import { EMPTY_PRACTITIONER_DASHBOARD, fetchPractitionerDashboardData, PRACTITIONER_NAV_ITEMS } from './data'
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
  EmptyState,
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
  WarningCardEl,
  WarningDesc,
  WarningTitle,
} from './PractitionerDashboardMain.styles'

export default function PractitionerDashboardMain() {
  const { data, loading, error } = useAsyncData(fetchPractitionerDashboardData)
  const view = data ?? EMPTY_PRACTITIONER_DASHBOARD
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <GNB />
      <SubNav activeTo="/dashboard" items={PRACTITIONER_NAV_ITEMS} />
      <MainContent>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && view.statCards.length === 0} subject="대시보드 데이터" />
        <StatsRow>
          {view.statCards.map((stat) => (
            <StatCardEl
              key={stat.label}
              $highlight={stat.highlight}
              role={stat.linkTo ? 'link' : undefined}
              tabIndex={stat.linkTo ? 0 : undefined}
              onClick={stat.linkTo ? () => navigate(stat.linkTo!) : undefined}
              onKeyDown={
                stat.linkTo
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(stat.linkTo!)
                      }
                    }
                  : undefined
              }
              style={stat.linkTo ? { cursor: 'pointer' } : undefined}
              aria-label={stat.linkTo ? `${stat.label} 작업 리스트로 이동` : undefined}
            >
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
              <AlertBadge>{view.alertBannerCount}건 지속 관리 필요</AlertBadge>
            </SectionTitleGroup>
          </SectionHeader>
          <AlertsRow>
            {view.warningCards.map((card, index) => (
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
              {view.preferredItems.map((item) => (
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
              {view.supplementItems.map((item) => (
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

          <InsightCol>
            <ColHeader>
              <ColHeaderTitle>마감 임박 작업 TOP {view.deadlineItems.length}</ColHeaderTitle>
              <ColHeaderMeta $danger>마감일 순</ColHeaderMeta>
            </ColHeader>
            <ListCol>
              {view.deadlineItems.length === 0 ? (
                <EmptyState>마감 임박 작업이 없습니다.</EmptyState>
              ) : (
                view.deadlineItems.map((item, index) => (
                  <RankedRow
                    key={item.requestNo}
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(item.route)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(item.route)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                    aria-label={`${item.title} 작업 상세 보기`}
                  >
                    <RankNumber>{index + 1}</RankNumber>
                    <ItemTexts>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemSubtitle>{item.subtitle}</ItemSubtitle>
                    </ItemTexts>
                    <SmallTag $bg={item.tagBg} $color={item.tagColor}>
                      {item.tag}
                    </SmallTag>
                  </RankedRow>
                ))
              )}
            </ListCol>
          </InsightCol>
        </InsightRow>
      </MainContent>
    </PageWrapper>
  )
}
