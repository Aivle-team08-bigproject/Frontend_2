import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App route smoke tests', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('redirects an anonymous root request to the login page', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(await screen.findByText('회사 이메일')).toBeInTheDocument()
  })

  it('renders the 404 route for an unknown path', async () => {
    window.history.pushState({}, '', '/unknown-route')
    render(<App />)

    expect(await screen.findByText('페이지를 찾을 수 없습니다')).toBeInTheDocument()
  })
})
