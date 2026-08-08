import { liveDotSrc, refreshCwSrc } from './icons'
import {
  AgentTag,
  LiveDot,
  LogCardEl,
  LogHeader,
  LogLine,
  LogMessage,
  LogTime,
  MetaRow,
  RefreshGroup,
  RefreshIcon,
  RefreshLabel,
  RightPanel,
  Terminal,
  TitleGroup,
  LogTitle,
} from './LiveLogPanel.styles'

export type LiveLogLine = {
  time: string
  agent: string
  agentColor: string
  message: string
  /** 없으면 INFO로 본다. WARN/ERROR는 본문 색을 달리해서 눈에 띄게 한다. */
  level?: 'INFO' | 'WARN' | 'ERROR'
}

type LiveLogPanelProps = {
  lines: LiveLogLine[]
}

export default function LiveLogPanel({ lines }: LiveLogPanelProps) {
  return (
    <RightPanel>
      <LogCardEl>
        <LogHeader>
          <TitleGroup>
            <LiveDot src={liveDotSrc} alt="" />
            <LogTitle>실시간 에이전트 로그</LogTitle>
          </TitleGroup>
          <RefreshGroup>
            <RefreshIcon src={refreshCwSrc} alt="" />
            <RefreshLabel>실시간</RefreshLabel>
          </RefreshGroup>
        </LogHeader>
        <Terminal>
          {lines.map((line, index) => (
            <LogLine key={`${line.time}-${index}`}>
              <MetaRow>
                <LogTime>{line.time}</LogTime>
                <AgentTag $color={line.agentColor}>[{line.agent}]</AgentTag>
              </MetaRow>
              <LogMessage $level={line.level}>{line.message}</LogMessage>
            </LogLine>
          ))}
        </Terminal>
      </LogCardEl>
    </RightPanel>
  )
}
