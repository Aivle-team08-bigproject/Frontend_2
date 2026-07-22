import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'

export type AnalysisInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

const mockData: AnalysisInProgressData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  timelineItems: [
    { title: '요건 파싱', time: '14:23:05', description: '텍스트 형태의 자연어 요청 전문을 정형 필드로 구조화 완료', state: 'done' },
    { title: '데이터셋 매칭', time: '14:23:12', description: '분석을 위해 요구되는 매장 테이블 및 카드 매핑율 94.2% 검증', state: 'done' },
    { title: '실현가능성 검증', time: '14:23:45', description: '보유 및 가용 데이터 자원 제공 가능 한도 및 적합성 통과', state: 'done' },
  ],
  logLines: [
    { time: '14:23:00', agent: 'Agent-Parser', agentColor: '#22c55e', message: 'Parsing requirements text segment... success.' },
    { time: '14:23:05', agent: 'Agent-Parser', agentColor: '#22c55e', message: 'Entities matching schema mapping completed.' },
    { time: '14:23:12', agent: 'Agent-Matcher', agentColor: '#008485', message: 'Validating client targets with internal datasets...' },
    { time: '14:23:30', agent: 'Agent-Matcher', agentColor: '#22c55e', message: 'Dataset match-rate checks: 94.2% suitability.' },
    { time: '14:23:45', agent: 'Agent-Validator', agentColor: '#008485', message: 'Running compliance audit for Seoul Gangnam area...' },
    { time: '14:23:55', agent: 'Agent-Validator', agentColor: '#22c55e', message: 'Compliance verified. Privacy check cleared.' },
    { time: '14:24:10', agent: 'Agent-Transformer', agentColor: '#eab308', message: 'Parsing custom extraction rules.' },
    { time: '14:24:35', agent: 'Agent-Transformer', agentColor: '#008485', message: 'Initiating raw source query matching local cafe logs.' },
    { time: '14:24:50', agent: 'Agent-Transformer', agentColor: '#eab308', message: 'Processing PII anonymization mask loops (Chunk 12/24)' },
  ],
}

export function fetchAnalysisInProgressData(): Promise<AnalysisInProgressData> {
  return Promise.resolve(mockData)
}
