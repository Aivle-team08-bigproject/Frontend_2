import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'

export type DataSelectionInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

const mockData: DataSelectionInProgressData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  timelineItems: [
    { title: '데이터 소스 탐색', time: '15:01:22', description: '강남구 외식업 관련 데이터 소스 5개 식별 완료', state: 'done' },
    { title: '샘플 데이터 추출', time: '15:08:47', description: '대표 샘플 200건 추출 및 데이터 정합성 검증 중', state: 'done' },
    { title: '품질 스코어 산정', time: '15:12:30', description: '데이터 완결성 88.5%, 정확도 92.1% 측정 진행 중', state: 'done' },
  ],
  logLines: [
    { time: '15:01:00', agent: 'Agent-Scanner', agentColor: '#22c55e', message: 'Initiating data source discovery for Gangnam F&B...' },
    { time: '15:01:22', agent: 'Agent-Scanner', agentColor: '#22c55e', message: '5 data sources identified. Relevance score: 94.8%' },
    { time: '15:05:10', agent: 'Agent-Selector', agentColor: '#008485', message: 'Sampling strategy: stratified random, n=200' },
    { time: '15:08:47', agent: 'Agent-Selector', agentColor: '#22c55e', message: 'Sample extraction complete. Integrity check: PASS' },
    { time: '15:10:00', agent: 'Agent-QA', agentColor: '#008485', message: 'Running quality metrics on extracted samples...' },
    { time: '15:11:30', agent: 'Agent-QA', agentColor: '#22c55e', message: 'Completeness: 88.5%, Accuracy: 92.1%' },
    { time: '15:12:00', agent: 'Agent-Selector', agentColor: '#eab308', message: 'Applying deduplication filters on candidate set...' },
    { time: '15:12:20', agent: 'Agent-Selector', agentColor: '#008485', message: 'Outlier detection running (batch 3/5)...' },
    { time: '15:12:30', agent: 'Agent-QA', agentColor: '#eab308', message: 'Quality scoring in progress... ETA 2 minutes' },
  ],
}

export function fetchDataSelectionInProgressData(): Promise<DataSelectionInProgressData> {
  return Promise.resolve(mockData)
}
