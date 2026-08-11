import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from './api'

describe('resolveApiBaseUrl', () => {
  it('uses the same origin in production when no API URL is injected', () => {
    expect(resolveApiBaseUrl('', false, 'https://operator.example.com/')).toBe('https://operator.example.com')
  })

  it('uses localhost only in development', () => {
    expect(resolveApiBaseUrl(undefined, true, 'https://operator.example.com')).toBe('http://localhost:8000')
  })

  it('uses an explicitly injected API origin', () => {
    expect(resolveApiBaseUrl('https://api.internal.example.com/', false, 'https://operator.example.com')).toBe('https://api.internal.example.com')
  })
})
