import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Mock Web Crypto API for testing
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      generateKey: () => Promise.resolve({}),
      exportKey: () => Promise.resolve(new ArrayBuffer(0)),
      digest: () => Promise.resolve(new ArrayBuffer(0)),
      sign: () => Promise.resolve(new ArrayBuffer(0)),
    },
  },
})

// Reset any global state before each test
beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})