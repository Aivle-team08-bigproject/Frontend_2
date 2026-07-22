import { liveDotSrc, refreshCwSmSrc, refreshCwSrc } from './icons'
import {
  AgentTag,
  CancelButton,
  LiveDot,
  LogCardEl,
  LogHeader,
  LogLine,
  LogMessage,
  LogTime,
  MetaRow,
  ProgressActions,
  RefreshGroup,
  RefreshIcon,
  RefreshLabel,
  RefreshNotice,
  RefreshNoticeLabel,
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
}

type LiveLogPanelProps = {
  lines: LiveLogLine[]
  refreshNotice?: string
  onCancel?: () => void
}

export default function LiveLogPanel({ lines, refreshNotice = '10초마다 자동 새로고침 중', onCancel }: LiveLogPanelProps) {
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
              <LogMessage>{line.message}</LogMessage>
            </LogLine>
          ))}
        </Terminal>
      </LogCardEl>
      <ProgressActions>
        <RefreshNotice>
          <RefreshIcon src={refreshCwSmSrc} alt="" />
          <RefreshNoticeLabel>{refreshNotice}</RefreshNoticeLabel>
        </RefreshNotice>
        <CancelButton type="button" onClick={onCancel}>
          작업 취소
        </CancelButton>
      </ProgressActions>
    </RightPanel>
  )
}
