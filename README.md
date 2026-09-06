# Frontend

데이터 활용 요청을 등록하고, 단계별 처리 상태·검토 결과·운영 현황을 확인하는 React 웹 애플리케이션입니다.

## Features

- 로그인, 회원가입, 권한 기반 화면 제어
- 데이터 활용 요청 등록과 단계별 검토
- 작업 상태·산출물·대시보드 조회
- 직원 관리와 공지 관리 화면
- 반응형 레이아웃 및 API 오류 상태 안내

## Tech stack

React, TypeScript, Vite, styled-components, Vitest

## Local development

```bash
npm ci
cp .env.example .env
npm run dev
```

`VITE_API_BASE_URL`은 로컬 FastAPI 주소로 설정합니다. 인증 토큰·실제 API 주소 등 민감한 값은 커밋하지 않습니다.

```bash
npm run lint
npm test
npm run build
```

## Main routes

| Route | Description |
| --- | --- |
| `/login` | 로그인 |
| `/dashboard` | 작업 현황 대시보드 |
| `/tasks/register` | 데이터 활용 요청 등록 |
| `/tasks/*` | 분석·선별·가공·검토 흐름 |
| `/dev-dashboard/members` | 권한 기반 직원 관리 |

## Related repositories

- [Backend-fastapi](https://github.com/Aivle-team08-bigproject/Backend-fastapi): 인증·요청·파이프라인 API
- [Backend-spring](https://github.com/Aivle-team08-bigproject/Backend-spring): 산출물 전달·이메일 API
