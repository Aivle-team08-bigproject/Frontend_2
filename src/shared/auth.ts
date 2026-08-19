const LOCAL_TOKEN_KEY = 'lumen.access-token'
const SESSION_TOKEN_KEY = 'lumen.session-access-token'

export function getAccessToken(): string | null {
  return window.sessionStorage.getItem(SESSION_TOKEN_KEY) ?? window.localStorage.getItem(LOCAL_TOKEN_KEY)
}

export function remembersLogin(): boolean {
  return window.localStorage.getItem(LOCAL_TOKEN_KEY) !== null
}

export function saveAccessToken(token: string, rememberMe: boolean) {
  window.localStorage.removeItem(LOCAL_TOKEN_KEY)
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(rememberMe ? LOCAL_TOKEN_KEY : SESSION_TOKEN_KEY, token)
}

export function clearAccessToken() {
  window.localStorage.removeItem(LOCAL_TOKEN_KEY)
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
}

export function redirectToLoginForSessionExpiry(reason: 'max-session' | 'session-expired' = 'session-expired') {
  const from = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const query = new URLSearchParams({ reason, from })
  window.location.assign(`/login?${query.toString()}`)
}
