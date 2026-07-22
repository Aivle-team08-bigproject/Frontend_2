import type { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from './theme'

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
`

const LeftInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const IdBadge = styled.span`
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${colors.flowPrimaryBg};
  color: ${colors.flowPrimary};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`

const RequestTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.text};
  white-space: nowrap;
`

type RequestHeaderCardProps = {
  reqId: string
  title: string
  right?: ReactNode
}

export default function RequestHeaderCard({ reqId, title, right }: RequestHeaderCardProps) {
  return (
    <Card>
      <LeftInfo>
        <IdBadge>{reqId}</IdBadge>
        <RequestTitle>{title}</RequestTitle>
      </LeftInfo>
      {right}
    </Card>
  )
}
