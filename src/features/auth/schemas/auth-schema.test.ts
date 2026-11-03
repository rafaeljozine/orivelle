import { describe, expect, it } from 'vitest'
import { authSchema } from './auth-schema'

describe('authSchema', () => {
  it('accepts a valid email address', () => {
    expect(authSchema.safeParse({ email: 'cliente@example.com', password: 'password123' }).success).toBe(true)
  })

  it('rejects an invalid email address', () => {
    expect(authSchema.safeParse({ email: 'invalido', password: 'password123' }).success).toBe(false)
  })

  it('accepts a password-reset form without email and requires matching passwords', () => {
    expect(authSchema.safeParse({ password: 'password123', confirmPassword: 'password123' }).success).toBe(true)
    expect(authSchema.safeParse({ password: 'password123', confirmPassword: 'different123' }).success).toBe(false)
  })
})