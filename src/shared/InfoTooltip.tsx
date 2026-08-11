import type { ReactNode } from 'react'
import { TooltipPanel, TooltipTrigger, TooltipWrapper } from './InfoTooltip.styles'

type InfoTooltipProps = {
  label: string
  children: ReactNode
}

/** 마우스 호버(또는 키보드 포커스)로 여는 짧은 설명 팝오버. 클릭 모달보다 가볍게 쓸 때. */
export default function InfoTooltip({ label, children }: InfoTooltipProps) {
  return (
    <TooltipWrapper>
      <TooltipTrigger type="button" aria-label={label}>
        ?
      </TooltipTrigger>
      <TooltipPanel role="tooltip">{children}</TooltipPanel>
    </TooltipWrapper>
  )
}
