# PR 문서: `feature/pipeline-sse-progress` → `develop`

## 1. 변경 목적

파이프라인 실행이 실패했을 때 진행 화면이 실패 단계를 진행 중처럼 표시하고, 새로고침 또는 SSE
재접속 후에는 실패 사유가 사라지는 문제를 수정한다.

## 2. `develop` 대비 주요 변경

### 실패 단계 시각화

- `TimelineStepState`에 `failed` 상태를 추가한다.
- `FAILED` 서브스텝은 노란 진행 점 대신 빨간 원형 `×` 아이콘으로 표시한다.
- 완료·진행 중·대기 상태의 기존 표시 방식은 변경하지 않는다.

### Snapshot 실패 정보 복원

- SSE 최초 연결과 재접속 때 받는 `snapshot`의 `run_status`, `error_message`, `failure`를 처리한다.
- 실행 상태가 `FAILED`이면 실패 알림을 표시하고, `failure.details.validation_errors`를 에이전트
  로그 패널에 `ERROR` 로그로 복원한다.
- 실시간 `status` 이벤트로 이미 처리하던 실패 로그 처리와 동일한 공개 SSE 계약을 사용한다.

## 3. 영향 범위

- `src/shared/Timeline.tsx`
- `src/shared/Timeline.styles.ts`
- `src/shared/pipelineLabels.ts`
- `src/shared/usePipelineRunStream.ts`

API endpoint, 요청·응답 스키마, 라우트, DB migration 변경은 없다. backend가 기존 SSE `snapshot`에
제공하는 `run_status`, `error_message`, `failure.details.validation_errors`를 프론트가 누락 없이
표시하도록 보완하는 변경이다.

## 4. 검증 체크리스트

- [x] `npm run build`
- [x] `npm run lint`
- [x] `git diff --check`
- [ ] `FAILED` 데이터 가공 서브스텝이 빨간 `×` 아이콘으로 표시되는지 확인
- [ ] 실패 실행 화면을 새로고침한 뒤 실패 알림과 상세 오류 로그가 유지되는지 확인

## 5. 리뷰 포인트

- `FAILED`만 `failed` 타임라인 상태로 변환되고 `RUNNING`은 기존 `active` 표시를 유지하는지 확인한다.
- snapshot 로그는 실행 상태가 `FAILED`일 때만 복원해 정상 실행 로그와 섞이지 않는지 확인한다.
- `failure.details.validation_errors`가 없더라도 `error_message`만으로 실패 사실이 표시되는지 확인한다.

## 6. 배포 시 유의사항

backend 변경 없이도 배포할 수 있다. 다만 상세 오류 목록은 backend SSE snapshot이
`failure.details.validation_errors`를 제공하는 경우에만 표시된다.
