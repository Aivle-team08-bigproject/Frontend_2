import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import SubNav from '../../shared/SubNav'
import { avatarLgSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper, SectionTitle } from '../../shared/layout.styles'
import { EMPTY_MY_TASK_STATUS, fetchMyTaskStatusData } from './myTaskStatusData'
import { PRACTITIONER_NAV_ITEMS } from './data'
import { useNavigate } from 'react-router-dom'
import {
  ActionButton,
  AvatarLg,
  BarFill,
  BarTrack,
  CardFooter,
  CardHeader,
  CardsGrid,
  CardsSection,
  ClientText,
  Divider,
  FooterDate,
  FooterDue,
  FooterLeft,
  HeaderBadge,
  HeaderLeft,
  HeaderRight,
  ProfileHeader,
  ProfileLeft,
  ProgressLabel,
  ProgressLabels,
  ProgressSection,
  ProgressValue,
  QuickStats,
  ReqIdText,
  RoleBadge,
  StatItem,
  StatItemLabel,
  StatItemValue,
  SummaryText,
  TaskCard,
  TitleRow,
  UserDetails,
  UserMeta,
  UserNameText,
} from './MyTaskStatus.styles'

export default function MyTaskStatus() {
  const { data, loading, error } = useAsyncData(fetchMyTaskStatusData)
  const view = data ?? EMPTY_MY_TASK_STATUS
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <GNB />
      <SubNav activeTo="/dashboard/my-tasks" items={PRACTITIONER_NAV_ITEMS} />
      <MainContent>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && view.cards.length === 0} subject="내 작업" />
        <ProfileHeader>
          <ProfileLeft>
            <AvatarLg src={avatarLgSrc} alt="" />
            <UserDetails>
              <TitleRow>
                <UserNameText>{view.userName}</UserNameText>
                <RoleBadge>{view.roleBadge}</RoleBadge>
              </TitleRow>
              <UserMeta>
                진행 중인 전담 작업 <strong style={{ color: '#0f5a52' }}>{view.activeCount}건</strong> | 대기 긴급 작업{' '}
                <strong style={{ color: '#dc2626' }}>{view.urgentCount}건</strong>
              </UserMeta>
            </UserDetails>
          </ProfileLeft>
          <QuickStats>
            <StatItem>
              <StatItemLabel>완료 작업</StatItemLabel>
              <StatItemValue $color="#0f5a52">{view.completedCount}건</StatItemValue>
            </StatItem>
            <StatItem>
              <StatItemLabel>완료율</StatItemLabel>
              <StatItemValue $color="#22c55e">{view.completionRate}</StatItemValue>
            </StatItem>
          </QuickStats>
        </ProfileHeader>

        <CardsSection>
          <SectionTitle>담당 작업 현황 리스트 (긴급 및 마감 우선 정렬)</SectionTitle>
          <CardsGrid>
            {view.cards.map((card) => {
              const urgent = card.status === 'urgent'
              return (
                <TaskCard key={card.reqId} $urgent={urgent}>
                  <CardHeader>
                    <HeaderLeft>
                      <ReqIdText>{card.reqId}</ReqIdText>
                      <ClientText>{card.client}</ClientText>
                      <Divider>|</Divider>
                      <SummaryText>{card.summary}</SummaryText>
                    </HeaderLeft>
                    <HeaderRight>
                      {card.badges.map((badge) => (
                        <HeaderBadge key={badge.label} $bg={badge.bg} $color={badge.color}>
                          {badge.label}
                        </HeaderBadge>
                      ))}
                    </HeaderRight>
                  </CardHeader>

                  <ProgressSection>
                    <ProgressLabels>
                      <ProgressLabel>작업 진행률</ProgressLabel>
                      <ProgressValue $color={card.progressLabelColor}>{card.progressLabel}</ProgressValue>
                    </ProgressLabels>
                    <BarTrack>
                      <BarFill $percent={card.progress} $urgent={urgent} />
                    </BarTrack>
                  </ProgressSection>

                  <CardFooter>
                    <FooterLeft>
                      <FooterDate>{card.registeredAt}</FooterDate>
                      <FooterDue $color={card.dueColor}>{card.dueLabel}</FooterDue>
                    </FooterLeft>
                    <ActionButton type="button" onClick={() => navigate(card.actionTo)}>{card.actionLabel}</ActionButton>
                  </CardFooter>
                </TaskCard>
              )
            })}
          </CardsGrid>
        </CardsSection>
      </MainContent>
    <Footer />
    </PageWrapper>
  )
}
