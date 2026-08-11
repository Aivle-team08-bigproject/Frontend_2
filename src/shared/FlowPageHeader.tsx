import { BackButton, Badge, Header, Title, TitleGroup } from './FlowPageHeader.styles'
import { colors } from './theme'

type FlowPageHeaderProps = {
  title: string
  badgeLabel: string
  badgeBg?: string
  badgeColor?: string
  onBack?: () => void
  backLabel?: string
}

export default function FlowPageHeader({
  title,
  badgeLabel,
  badgeBg = colors.flowPrimary,
  badgeColor = colors.white,
  onBack,
  backLabel = '작업 상세로',
}: FlowPageHeaderProps) {
  return (
    <Header>
      <TitleGroup>
        {onBack && (
          <BackButton type="button" onClick={onBack}>
            ← {backLabel}
          </BackButton>
        )}
        <Title>{title}</Title>
        <Badge $bg={badgeBg} $color={badgeColor}>
          {badgeLabel}
        </Badge>
      </TitleGroup>
    </Header>
  )
}
