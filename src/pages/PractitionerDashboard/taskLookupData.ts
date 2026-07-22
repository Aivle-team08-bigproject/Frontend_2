import type { TaskStatus } from './data'
import { taskStatusColors } from './data'

export type LookupRow = {
  reqId: string
  client: string
  dataType: string
  detail: string
  assignee: string
  createdAt: string
  updatedAt: string
  status: TaskStatus
}

export type TaskLookupData = {
  bannerTitle: string
  bannerDescription: string
  rows: LookupRow[]
}

const mockData: TaskLookupData = {
  bannerTitle: '경고: 요구사항 가이드 미확정 관련 작업 (2건)',
  bannerDescription: '가이드 미달성 및 고객사 피드백이 지연되어 추가 조치 대기 중인 작업 리스트입니다.',
  rows: [
    {
      reqId: 'REQ-2024-0847',
      client: '(주)ABC마케팅',
      dataType: '소비 트렌드 분석',
      detail: 'ABC마케팅 가이드 미달성 오류 피드백 지연',
      assignee: '홍길동 책임',
      createdAt: '2024.11.12',
      updatedAt: '2024.11.12',
      status: '요구사항 분석',
    },
    {
      reqId: 'REQ-2024-0812',
      client: '(주)AI산업혁신원',
      dataType: '의료 영상 분석 가공',
      detail: '의료 영상 뼈 분할 라벨 가이드라인 누락',
      assignee: '홍길동 책임',
      createdAt: '2024.11.08',
      updatedAt: '2024.11.09',
      status: '진행중',
    },
  ],
}

export { taskStatusColors }

export function fetchTaskLookupData(): Promise<TaskLookupData> {
  return Promise.resolve(mockData)
}
