import { describe, it, expect, beforeEach } from 'vitest'
import { generateSecret, generateApiKey } from './index'

describe('Crypto utilities', () => {
  beforeEach(() => {
    // Reset any mocks
  })

  describe('generateSecret', () => {
    it('should generate a secret key of specified length in hex format', () => {
      const key = generateSecret(32, 'hex')
      expect(key).toHaveLength(64) // 32 bytes = 64 hex chars
      expect(/^[0-9a-f]+$/.test(key)).toBe(true)
    })

    it('should generate different keys on subsequent calls', () => {
      const key1 = generateSecret(16, 'hex')
      const key2 = generateSecret(16, 'hex')
      expect(key1).not.toBe(key2)
    })

    it('should generate base64url format', () => {
      const key = generateSecret(16, 'base64url')
      expect(key).toBeDefined()
      expect(key.length).toBeGreaterThan(10)
    })
  })

  describe('generateApiKey', () => {
    it('should generate an API key with prefix', () => {
      const apiKey = generateApiKey('sk', 32, 'base64url')
      expect(apiKey).toBeDefined()
      expect(apiKey.startsWith('sk_')).toBe(true)
      expect(apiKey.length).toBeGreaterThan(10)
    })
  })
})