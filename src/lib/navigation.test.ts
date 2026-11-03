import { describe, expect, it } from 'vitest'
import { getSafeInternalPath } from './navigation'

describe('getSafeInternalPath', () => {
  it('keeps an internal path with its query and fragment', () => {
    expect(getSafeInternalPath('/pedido?modelo=1#detalhes', '/cliente')).toBe('/pedido?modelo=1#detalhes')
  })

  it('rejects absolute, protocol-relative and backslash destinations', () => {
    expect(getSafeInternalPath('https://example.com', '/cliente')).toBe('/cliente')
    expect(getSafeInternalPath('//example.com', '/cliente')).toBe('/cliente')
    expect(getSafeInternalPath('/\\example.com', '/cliente')).toBe('/cliente')
  })
})
