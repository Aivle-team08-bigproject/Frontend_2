import { Badge, Header, Title, TitleGroup } from './FlowPageHeader.styles'
import { colors } from './theme'

type FlowPageHeaderProps = {
  title: string
  badgeLabel: string
  badgeBg?: string
  badgeColor?: string
}

export default function FlowPageHeader({ title, badgeLabel, badgeBg = colors.flowPrimary, badgeColor = colors.white }: FlowPageHeaderProps) {
  return (
    <Header>
      <TitleGroup>
        <Title>{title}</Title>
        <Badge $bg={badgeBg} $color={badgeColor}>
          {badgeLabel}
        </Badge>
      </TitleGroup>
    </Header>
  )
}
