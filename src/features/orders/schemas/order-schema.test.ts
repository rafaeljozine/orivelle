import { describe, expect, it, vi } from 'vitest'
import { orderSchema } from './order-schema'

describe('orderSchema', () => {
  it('accepts today in the Africa/Maputo calendar and coerces guest count', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-29T10:00:00+02:00'))

    const result = orderSchema.safeParse({
      eventName: 'Celebração de teste',
      eventType: 'casamento',
      eventDate: '2026-10-29',
      guestEstimate: '85',
    })

    expect(result.success).toBe(true)
    if (result.success) expect(result.data.guestEstimate).toBe(85)
    vi.useRealTimers()
  })

  it('rejects a past date and out-of-range guest estimate', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-29T10:00:00+02:00'))

    const result = orderSchema.safeParse({
      eventName: 'Celebração de teste',
      eventType: 'casamento',
      eventDate: '2026-10-28',
      guestEstimate: '0',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain('eventDate')
      expect(result.error.issues.map((issue) => issue.path[0])).toContain('guestEstimate')
    }
    vi.useRealTimers()
  })

  it('rejects a date that does not exist in the calendar', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00+02:00'))

    const result = orderSchema.safeParse({
      eventName: 'Celebração de teste',
      eventType: 'casamento',
      eventDate: '2026-02-30',
      guestEstimate: '50',
    })

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues.map((issue) => issue.path[0])).toContain('eventDate')
    vi.useRealTimers()
  })
})
