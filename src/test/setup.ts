import '@testing-library/jest-dom/vitest'

function createStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  }
}

// Node 25's experimental storage global conflicts with JSDOM in the local
// runtime. The app only requires the standard Storage contract.
Object.defineProperty(window, 'localStorage', { configurable: true, value: createStorage() })
Object.defineProperty(window, 'sessionStorage', { configurable: true, value: createStorage() })
