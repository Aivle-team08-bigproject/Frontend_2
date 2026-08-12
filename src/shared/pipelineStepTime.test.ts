import { describe, expect, it } from 'vitest'

import { applyStepStatus } from './usePipelineRunStream'
import { buildStepTimelineItems } from './pipelineLabels'
import type { PipelineStreamItem } from './pipelineEventStream'

const STEPS = [
  { code: 'SOURCE_COLUMN_SELECTION', title: '원본 컬럼 선별' },
  { code: 'DERIVED_COLUMN_DESIGN', title: '파생 컬럼 정의' },
]

const RUNNING_AT = '2026-08-12T13:09:27.402275+00:00'
const DONE_AT = '2026-08-12T13:09:43.856191+00:00'

function pending(code: string): PipelineStreamItem {
  return {
    item_code: code,
    status: 'PENDING',
    started_at: null,
    completed_at: null,
    metadata: null,
    error_message: null,
  }
}

const INITIAL = STEPS.map((step) => pending(step.code))

describe('진행 화면 단계 시각', () => {
  it('상태 이벤트에 시각이 없어도 완료 시각을 채운다', () => {
    // 상태 이벤트 payload에는 started_at/completed_at이 없다. 채우지 않으면
    // 완료된 단계가 계속 '-'로 남는다(2026-08-12 회귀).
    const running = applyStepStatus(INITIAL, 'SOURCE_COLUMN_SELECTION', 'RUNNING', RUNNING_AT, '선별 중')
    const completed = applyStepStatus(running, 'SOURCE_COLUMN_SELECTION', 'COMPLETED', DONE_AT, '완료')

    const source = completed[0]
    expect(source.started_at).toBe(RUNNING_AT)
    expect(source.completed_at).toBe(DONE_AT)
    expect(buildStepTimelineItems(completed, STEPS)[0].time).not.toBe('-')
  })

  it('아직 시작하지 않은 단계는 시각을 채우지 않는다', () => {
    const running = applyStepStatus(INITIAL, 'SOURCE_COLUMN_SELECTION', 'RUNNING', RUNNING_AT, '선별 중')

    const derived = running[1]
    expect(derived.status).toBe('PENDING')
    expect(derived.completed_at).toBeNull()
    expect(buildStepTimelineItems(running, STEPS)[1].time).toBe('-')
  })

  it('실패도 종료 시각을 남기고 사유를 담는다', () => {
    const running = applyStepStatus(INITIAL, 'DERIVED_COLUMN_DESIGN', 'RUNNING', RUNNING_AT, '정의 중')
    const failed = applyStepStatus(running, 'DERIVED_COLUMN_DESIGN', 'FAILED', DONE_AT, '검증 실패')

    expect(failed[1].completed_at).toBe(DONE_AT)
    expect(failed[1].error_message).toBe('검증 실패')
  })

  it('서버 스냅샷이 준 정본 시각을 이벤트가 덮지 않는다', () => {
    const fromSnapshot: PipelineStreamItem[] = [
      { ...pending('SOURCE_COLUMN_SELECTION'), status: 'COMPLETED', started_at: RUNNING_AT, completed_at: DONE_AT },
      pending('DERIVED_COLUMN_DESIGN'),
    ]

    const applied = applyStepStatus(fromSnapshot, 'SOURCE_COLUMN_SELECTION', 'COMPLETED', '2026-08-12T14:00:00+00:00', '완료')

    expect(applied[0].completed_at).toBe(DONE_AT)
  })
})
