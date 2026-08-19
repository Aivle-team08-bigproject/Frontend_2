import type { SubNavItem } from '../../shared/SubNav'

/** 회원 관리 페이지의 내비게이션. 토큰 사용량 개발자 페이지는 제거했다. */
export const MEMBER_NAV_ITEMS: SubNavItem[] = [
  { label: '회원 관리', to: '/dev-dashboard/members' },
]
