import { checkSmSrc } from './icons'
import {
  AccentBar,
  ActiveDot,
  CheckIcon,
  Circle,
  ConnectorLine,
  IndicatorCol,
  ItemDescription,
  ItemTime,
  ItemTitle,
  ProcessCard,
  SectionHeader,
  SectionTitle,
  StatusBadge,
  SubHeader,
  TextCol,
  TimelineItemEl,
  TimelineList,
  TitleGroup,
} from './Timeline.styles'

export type TimelineStepState = 'done' | 'active' | 'pending'

export type TimelineItem = {
  title: string
  time: string
  description: string
  state: TimelineStepState
}

type TimelineProps = {
  sectionTitle: string
  statusLabel: string
  statusBg: string
  statusColor: string
  items: TimelineItem[]
}

export default function Timeline({ sectionTitle, statusLabel, statusBg, statusColor, items }: TimelineProps) {
  return (
    <ProcessCard>
      <SectionHeader>
        <TitleGroup>
          <AccentBar />
          <SectionTitle>{sectionTitle}</SectionTitle>
        </TitleGroup>
        <StatusBadge $bg={statusBg} $color={statusColor}>
          {statusLabel}
        </StatusBadge>
      </SectionHeader>
      <TimelineList>
        {items.map((item, index) => (
          <TimelineItemEl key={item.title}>
            <IndicatorCol>
              <Circle $state={item.state}>
                {item.state === 'done' && <CheckIcon src={checkSmSrc} alt="완료" />}
                {item.state === 'active' && <ActiveDot />}
              </Circle>
              {index < items.length - 1 && <ConnectorLine />}
            </IndicatorCol>
            <TextCol>
              <SubHeader>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemTime>{item.time}</ItemTime>
              </SubHeader>
              <ItemDescription>{item.description}</ItemDescription>
            </TextCol>
          </TimelineItemEl>
        ))}
      </TimelineList>
    </ProcessCard>
  )
}
