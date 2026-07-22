import type { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from './theme'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const AccentBar = styled.div<{ $color: string }>`
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

type SectionCardProps = {
  title: string
  accentColor?: string
  children: ReactNode
}

export default function SectionCard({ title, accentColor = colors.flowPrimary, children }: SectionCardProps) {
  return (
    <Card>
      <Header>
        <AccentBar $color={accentColor} />
        <Title>{title}</Title>
      </Header>
      {children}
    </Card>
  )
}
