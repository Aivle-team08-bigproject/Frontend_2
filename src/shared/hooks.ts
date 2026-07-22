import { useEffect, useState } from 'react'

type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: unknown
}

export function useAsyncData<T>(fetcher: () => Promise<T>, options?: { intervalMs?: number }): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const intervalMs = options?.intervalMs

  useEffect(() => {
    let cancelled = false

    function load() {
      fetcher()
        .then((data) => {
          if (!cancelled) setState({ data, loading: false, error: null })
        })
        .catch((error: unknown) => {
          if (!cancelled) setState({ data: null, loading: false, error })
        })
    }

    setState({ data: null, loading: true, error: null })
    load()

    if (!intervalMs) {
      return () => {
        cancelled = true
      }
    }

    const id = setInterval(load, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [fetcher, intervalMs])

  return state
}
