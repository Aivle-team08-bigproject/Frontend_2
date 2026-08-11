# PR: 최종 산출물 이메일·고객 API UI

- Source: `feature/email-delivery-sample`
- Target: `develop`
- Latest commit: `5743270`

## 변경 목적

작업 완료 화면에서 최종 산출물을 파일·고객 API·이메일로 제공하고, 이메일 발송 시
고객이 API에 접근할 수 있는 URL과 API Key를 함께 전달한다.

## 주요 변경

- 최종 산출물 메일 발송 시 API Key 자동 발급
- 메일 API 요청에 `api_endpoint_url`, `api_key` 포함
- API URL 전체 표시 및 URL/Key 복사
- API URL·Key CSV 다운로드
- API Key 발급 후에도 산출물 파일 다운로드 유지
- 실제 산출물이 없는 프로세스 결과 요약 카드 제거
- 메일 발송 상태 SSE 추적 유지

## 검증

- `npm run build`
- `npm run lint`
- `git diff --check`
- Docker Frontend 이미지 빌드 및 컨테이너 기동

## 확인 요청

- API Key 최초 발급·재발급 UX 확인
- CSV에 포함되는 API URL·Key의 고객 전달 정책 확인
- 실제 고객 환경에서 `localhost`가 아닌 외부 API URL로 표시되는지 확인
