export type MilestoneItem = {
  title: string
  time: string
  description: string
}

export type OutputFile = {
  name: string
  size: string
  kind: 'csv' | 'xlsx'
}

export type TaskCompleteData = {
  reqId: string
  requestTitle: string
  milestones: MilestoneItem[]
  files: OutputFile[]
  endpointUrl: string
  apiKeyMasked: string
  recipientEmail: string
  emailSubject: string
}

const mockData: TaskCompleteData = {
  reqId: 'REQ-2024-0847',
  requestTitle: '(주)ABC마케팅 데이터 가공 요청의 건',
  milestones: [
    { title: '요구사항 분석', time: '14:23', description: '완료, 매칭률 94.2%' },
    { title: '데이터 선별', time: '14:58', description: '완료, 254,320건 추출' },
    { title: '데이터 가공', time: '16:57', description: '완료, 품질 98.7점' },
    { title: 'QA 검증', time: '17:02', description: '완료, 합격' },
  ],
  files: [
    { name: 'Final_Dataset.csv', size: '42.8MB', kind: 'csv' },
    { name: 'Final_Dataset.xlsx', size: '51.2MB', kind: 'xlsx' },
  ],
  endpointUrl: 'https://api.example.com/v1/outputs/847',
  apiKeyMasked: '••••••••••••••••',
  recipientEmail: 'recipient@customer.com',
  emailSubject: '[Lumen Platform] 데이터 가공 산출물 송부',
}

export function fetchTaskCompleteData(): Promise<TaskCompleteData> {
  return Promise.resolve(mockData)
}
