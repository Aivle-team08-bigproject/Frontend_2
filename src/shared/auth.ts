const LOCAL_TOKEN_KEY = 'lumen.access-token'
const SESSION_TOKEN_KEY = 'lumen.session-access-token'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(SESSION_TOKEN_KEY) ?? localStorage.getItem(LOCAL_TOKEN_KEY)
}

export function remembersLogin(): boolean {
  return localStorage.getItem(LOCAL_TOKEN_KEY) !== null
}

export function saveAccessToken(token: string, rememberMe: boolean) {
  localStorage.removeItem(LOCAL_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(rememberMe ? LOCAL_TOKEN_KEY : SESSION_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(LOCAL_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
}
