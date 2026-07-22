export type CurrentUser = {
  name: string
  role: string
}

const mockCurrentUser: CurrentUser = {
  name: '홍길동 책임',
  role: '시스템 관리자',
}

export function fetchCurrentUser(): Promise<CurrentUser> {
  return Promise.resolve(mockCurrentUser)
}
