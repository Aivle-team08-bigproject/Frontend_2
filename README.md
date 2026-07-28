# Frontend_2

데이터 활용 요청을 등록하고, 작업 진행 상태와 운영 현황을 확인하는 React + TypeScript 프론트엔드입니다. 현재 `joungs` 브랜치는 목업 화면을 백엔드 API 응답에 연결하는 수직 흐름을 우선 구현한 상태입니다.

## 실행

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`의 `VITE_API_BASE_URL`은 FastAPI 서버 주소입니다. 기본값은 `http://localhost:8000`이며, 백엔드와 프론트를 다른 주소에서 실행할 때 해당 값을 변경합니다.

검증 명령:

```bash
npm run lint
npm run build
```

## 화면 경로

| 경로 | 화면 | 데이터 상태 |
| --- | --- | --- |
| `/login` | 로그인 | `POST /api/auth/login` |
| `/dashboard` | 전체 작업 대시보드 | `GET /api/v1/dashboard` + 클라이언트 필터/페이지네이션 |
| `/dashboard/my-tasks` | 내 작업 현황 | `GET /api/v1/dashboard/my-tasks` |
| `/dashboard/task-lookup` | 작업 조회 | `GET /api/v1/dashboard/task-lookup` |
| `/dev-dashboard` | 개발자 대시보드 | `GET /api/v1/dashboard/developer?period=daily\|weekly\|monthly` |
| `/dev-dashboard/members` | 회원 관리 | `GET /api/v1/dashboard/members` 및 관리자 변경 API |
| `/tasks/register` | 요구사항 등록 | `GET /api/v1/tasks/{requestNo}/views/register`, 등록 시 `POST /api/v1/data-requests` |
| `/tasks/{requestNo}/runs/{runId}/analyzing` | 분석 실행 상태 | `GET /api/v1/runs/{runId}` 3초 폴링 |
| `/tasks/review`, `/tasks/selection`, `/tasks/sample-feedback` | 검토·데이터 선택·샘플 피드백 | `GET /api/v1/tasks/{requestNo}/views/{viewCode}` |
| `/tasks/processing`, `/tasks/final-feedback`, `/tasks/complete` | 가공·최종 산출물·완료 | 동일한 task view API |
| `/404`, `/500` | 시스템 오류 화면 | 프론트 전용 |

작업 상세 화면은 `requestNo` 쿼리 파라미터를 사용합니다. 예: `/tasks/review?requestNo=REQ-20260714-001`.

## 백엔드 연동 규칙

공통 요청 래퍼는 [`src/shared/api.ts`](src/shared/api.ts)에서 관리합니다.

- 모든 요청은 `Authorization: Bearer <access_token>`과 `credentials: include`를 사용합니다.
- `401` 응답이면 `/api/auth/refresh`를 한 번 호출해 새 토큰으로 원 요청을 재시도합니다. 갱신에 실패하면 토큰을 지우고 `/login`으로 이동합니다.
- 로그인 토큰은 `기억하기` 선택에 따라 `localStorage` 또는 `sessionStorage`의 `lumen.*` 키에 저장됩니다.
- 백엔드 오류 응답의 `detail.message`를 사용자 알림에 표시합니다.

현재 실행 진행 화면은 SSE가 아니라 `GET /api/v1/runs/{runId}`를 3초마다 폴링합니다. SSE로 전환할 경우 API 래퍼와 `AnalysisInProgress`의 상태 수신부를 함께 변경해야 합니다.

## 권한 기반 UI

`GET /api/auth/me`의 `permissions`를 기준으로 회원 관리 기능을 표시합니다.

- `EMPLOYEE_PERMISSION_MANAGE`: 권한 변경 버튼과 역할 변경 모달
- `EMPLOYEE_UPDATE`: 활성화/비활성화 버튼
- `EMPLOYEE_CREATE`: 신규 직원 등록 버튼

권한이 없는 사용자는 해당 관리 헤더, 테이블 열, 버튼을 렌더링하지 않습니다. 실제 권한 검증은 FastAPI에서 수행하므로 프론트의 숨김은 UX 제어이고 보안 경계가 아닙니다.

## 디렉터리 구조

```text
src/
├── pages/                 # 대시보드, 회원 관리, 작업 단계별 화면
├── shared/api.ts          # 인증·대시보드·작업·관리자 API
├── shared/auth.ts         # 토큰 저장/삭제
├── shared/hooks.ts        # 비동기 조회 및 폴링
├── shared/ProtectedRoute.tsx
└── shared/*.styles.ts     # 공통 레이아웃 및 반응형 스타일
```

작업 단계의 화면별 응답 매핑은 각 페이지 폴더의 `*Data.ts` 파일에서 담당합니다. 테이블은 좁은 화면에서 가로 스크롤을 사용하고, 긴 텍스트는 줄바꿈/말줄임 규칙으로 레이아웃을 보호합니다.

## 로컬 테스트 계정

백엔드 데모 시드 기준 관리자 계정은 `DEMO-001` / `@x!Df96@Q4&H#axh`입니다. 계정과 데이터는 백엔드의 시드 스크립트와 로컬 DB 상태에 의존하므로 공유 환경에서는 각 개발자가 백엔드 README의 시드 절차를 먼저 실행해야 합니다.

## 현재 범위와 다음 연동 지점

현재 구현 범위는 로그인, 대시보드 조회, 회원 권한/상태 변경, 요구사항 등록, 실행 상태 조회와 작업 단계별 view 조회입니다. 에이전트 실행 결과의 실시간 스트리밍, 파일 업로드/다운로드, 신규 직원 등록 API 연결은 백엔드 계약이 확정된 뒤 확장합니다.
