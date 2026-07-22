import type { TimelineItem } from '../../shared/Timeline'
import type { LiveLogLine } from '../../shared/LiveLogPanel'

export type DataProcessingInProgressData = {
  reqId: string
  requestTitle: string
  timelineItems: TimelineItem[]
  logLines: LiveLogLine[]
}

const mockData: DataProcessingInProgressData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  timelineItems: [
    { title: '결측값 보정', time: '16:05:10', description: 'NULL 값 432건 보정 및 이상치 클렌징 완료', state: 'done' },
    { title: '형식 변환', time: '16:18:33', description: 'CSV 포맷 변환 및 UTF-8 인코딩 적용 진행 중', state: 'done' },
    { title: '익명화 처리', time: '16:25:00', description: 'PII 마스킹 12/24 청크 처리 중 (50% 완료)', state: 'done' },
  ],
  logLines: [
    { time: '16:05:00', agent: 'Agent-Cleaner', agentColor: '#22c55e', message: 'Starting null value imputation on 432 records...' },
    { time: '16:05:10', agent: 'Agent-Cleaner', agentColor: '#22c55e', message: 'Null imputation complete. Outlier cleansing applied.' },
    { time: '16:10:00', agent: 'Agent-Transformer', agentColor: '#008485', message: 'Column mapping initiated: 24 fields → CSV schema' },
    { time: '16:15:20', agent: 'Agent-Transformer', agentColor: '#22c55e', message: 'Encoding conversion: EUC-KR → UTF-8 (batch 2/3)' },
    { time: '16:18:33', agent: 'Agent-Transformer', agentColor: '#008485', message: 'CSV format validation pass. Header alignment OK.' },
    { time: '16:20:00', agent: 'Agent-Privacy', agentColor: '#22c55e', message: 'PII detection scan initiated on output dataset...' },
    { time: '16:22:15', agent: 'Agent-Privacy', agentColor: '#eab308', message: 'Found 1,247 PII instances. Masking strategy: SHA-256' },
    { time: '16:24:00', agent: 'Agent-Privacy', agentColor: '#008485', message: 'Anonymization chunk processing (12/24)...' },
    { time: '16:25:00', agent: 'Agent-Privacy', agentColor: '#eab308', message: 'Progress: 50% — ETA 3 minutes remaining' },
  ],
}

export function fetchDataProcessingInProgressData(): Promise<DataProcessingInProgressData> {
  return Promise.resolve(mockData)
}
