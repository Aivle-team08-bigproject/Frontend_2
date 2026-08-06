import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import SubNav from '../../shared/SubNav'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper, SectionHeader, SectionTitle } from '../../shared/layout.styles'
import { EMPTY_PRACTITIONER_DASHBOARD, fetchPractitionerDashboardData, PRACTITIONER_NAV_ITEMS } from './data'
import {
  CalendarDay,
  CalendarDayCell,
  CalendarEventDot,
  CalendarEventDots,
  CalendarGrid,
  CalendarHeader,
  CalendarLegend,
  CalendarMonth,
  CalendarNav,
  CalendarNavButton,
  CalendarPopover,
  CalendarPopoverDot,
  CalendarPopoverHeader,
  CalendarPopoverItem,
  CalendarPopoverLabel,
  CalendarPopoverMeta,
  CalendarPopoverText,
  CalendarPopoverTitle,
  CalendarWeekday,
  EmptyState,
  FootNote,
  LegendDot,
  LegendItem,
  QueueAction,
  QueueItemRow,
  QueueList,
  QueueMeta,
  QueueRank,
  QueueTexts,
  QueueTitle,
  StatCaption,
  StatCardEl,
  StatLabel,
  StatNumbers,
  StatUnit,
  StatValue,
  StatsRow,
  WorkArea,
  WorkPanel,
} from './PractitionerDashboardMain.styles'

const EVENT_LABELS = {
  CONTRACT_START: '계약 시작',
  CONTRACT_END: '계약 종료',
  DELIVERY_DUE: '최종 납기',
} as const

const EVENT_COLORS = {
  CONTRACT_START: '#008485',
  CONTRACT_END: '#7c3aed',
  DELIVERY_DUE: '#dc2626',
} as const

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function dDayLabel(eventDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(eventDate)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return 'D-day'
  return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`
}

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function calendarCells(month: Date): Array<Date | null> {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const cells: Array<Date | null> = Array(firstDay.getDay()).fill(null)
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function PractitionerDashboardMain() {
  const { data, loading, error } = useAsyncData(fetchPractitionerDashboardData)
  const view = data ?? EMPTY_PRACTITIONER_DASHBOARD
  const navigate = useNavigate()
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const [openDateKey, setOpenDateKey] = useState<string | null>(null)
  const calendarGridRef = useRef<HTMLDivElement>(null)
  const cells = useMemo(() => calendarCells(calendarMonth), [calendarMonth])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!calendarGridRef.current?.contains(event.target as Node)) setOpenDateKey(null)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, typeof view.calendarItems>()
    for (const event of view.calendarItems) {
      const key = dateKey(new Date(event.event_date))
      grouped.set(key, [...(grouped.get(key) ?? []), event])
    }
    return grouped
  }, [view.calendarItems])

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
              {stat.caption && <StatCaption $highlight={stat.highlight}>{stat.caption}</StatCaption>}
            </StatCardEl>
          ))}
        </StatsRow>

        <WorkArea>
          <WorkPanel>
            <SectionHeader>
              <SectionTitle>통합 작업 큐</SectionTitle>
              <FootNote>우선순위와 마감일 기준</FootNote>
            </SectionHeader>
            <QueueList>
              {view.queueItems.length === 0 ? (
                <EmptyState>현재 처리할 작업이 없습니다.</EmptyState>
              ) : (
                view.queueItems.map((item, index) => (
                  <QueueItemRow key={item.requestNo} type="button" onClick={() => navigate(item.route)}>
                    <QueueRank>{index + 1}</QueueRank>
                    <QueueTexts>
                      <QueueTitle>{item.title}</QueueTitle>
                      <QueueMeta>{item.client} · {item.stageLabel}{item.dueAt ? ` · 납기 ${new Date(item.dueAt).toLocaleDateString('ko-KR')}` : ''}</QueueMeta>
                    </QueueTexts>
                    <QueueAction $bg={item.priorityBg} $color={item.priorityColor}>
                      {item.actionLabel}
                    </QueueAction>
                  </QueueItemRow>
                ))
              )}
            </QueueList>
          </WorkPanel>

          <WorkPanel>
            <CalendarHeader>
              <CalendarMonth>{calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월</CalendarMonth>
              <CalendarNav>
                <CalendarNavButton type="button" aria-label="이전 달" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>‹</CalendarNavButton>
                <CalendarNavButton type="button" aria-label="다음 달" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>›</CalendarNavButton>
              </CalendarNav>
            </CalendarHeader>
            <CalendarGrid ref={calendarGridRef}>
              {WEEKDAY_LABELS.map((weekday) => <CalendarWeekday key={weekday}>{weekday}</CalendarWeekday>)}
              {cells.map((cell, index) => {
                if (!cell) return <span key={`empty-${index}`} />
                const key = dateKey(cell)
                const events = eventsByDate.get(key) ?? []
                const isToday = key === dateKey(new Date())
                const isOpen = openDateKey === key && events.length > 0
                const rowIndex = Math.floor(index / 7)
                const totalRows = cells.length / 7
                const flipUp = rowIndex >= totalRows - 2
                const alignRight = index % 7 >= 5
                return (
                  <CalendarDayCell key={key}>
                    <CalendarDay
                      type="button"
                      $today={isToday}
                      $hasEvent={events.length > 0}
                      aria-label={events.length ? `${cell.getDate()}일 ${events.map((event) => EVENT_LABELS[event.event_type]).join(', ')}` : `${cell.getDate()}일`}
                      onMouseEnter={() => events.length > 0 && setOpenDateKey(key)}
                      onMouseLeave={() => setOpenDateKey((current) => (current === key ? null : current))}
                      onFocus={() => events.length > 0 && setOpenDateKey(key)}
                      onClick={() => {
                        if (events.length === 1) navigate(events[0].detail_route)
                        else if (events.length > 1) setOpenDateKey((current) => (current === key ? null : key))
                      }}
                    >
                      {cell.getDate()}
                      {events.length > 0 && <CalendarEventDots>{events.slice(0, 3).map((event) => <CalendarEventDot key={`${event.request_no}-${event.event_type}`} $color={EVENT_COLORS[event.event_type]} />)}</CalendarEventDots>}
                    </CalendarDay>
                    {isOpen && (
                      <CalendarPopover $flipUp={flipUp} $alignRight={alignRight} role="dialog" aria-label={`${cell.getDate()}일 작업 목록`}>
                        <CalendarPopoverHeader>{cell.getMonth() + 1}월 {cell.getDate()}일 ({WEEKDAY_LABELS[cell.getDay()]})</CalendarPopoverHeader>
                        {events.map((event) => (
                          <CalendarPopoverItem
                            key={`${event.request_no}-${event.event_type}`}
                            type="button"
                            onClick={() => navigate(event.detail_route)}
                          >
                            <CalendarPopoverDot $color={EVENT_COLORS[event.event_type]} />
                            <CalendarPopoverText>
                              <CalendarPopoverLabel>{EVENT_LABELS[event.event_type]}</CalendarPopoverLabel>
                              <CalendarPopoverTitle>{event.title}</CalendarPopoverTitle>
                              <CalendarPopoverMeta>{event.client} · {dDayLabel(event.event_date)}</CalendarPopoverMeta>
                            </CalendarPopoverText>
                          </CalendarPopoverItem>
                        ))}
                      </CalendarPopover>
                    )}
                  </CalendarDayCell>
                )
              })}
            </CalendarGrid>
            <CalendarLegend>
              {(Object.keys(EVENT_LABELS) as Array<keyof typeof EVENT_LABELS>).map((eventType) => (
                <LegendItem key={eventType}><LegendDot $color={EVENT_COLORS[eventType]} />{EVENT_LABELS[eventType]}</LegendItem>
              ))}
            </CalendarLegend>
          </WorkPanel>
        </WorkArea>
      </MainContent>
    <Footer />
    </PageWrapper>
  )
}
