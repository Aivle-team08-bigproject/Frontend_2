# 공지사항 기능 Frontend PR 문서

## 대상 브랜치

- Source: `feature/notices-frontend`
- Target: `develop`

## 변경 내용

- Dashboard에 최신 공지 한 줄 배너 추가
- 공지사항 목록/상세 페이지 추가
- 관리자 공지 관리/작성/수정 페이지 분리
- 관리자 메뉴와 라우팅 권한 제어 추가
- Docker Compose same-origin API 연동 반영

## 검증

- 관리자 로그인 후 `/notices/manage`, `/notices/new`, 수정 화면 확인
- 일반 공지 목록/상세 및 Dashboard 배너 확인
- Docker Compose 환경 화면 캡처 확인

Backend 연계 PR 문서는 `Backend-fastapi/docs/PR_notice_feature_to_develop.md`를 참고합니다.
