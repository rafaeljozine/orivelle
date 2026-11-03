const internalOrigin = 'https://app.invalid'

export function getSafeInternalPath(value: string | null | undefined, fallback: string) {
  if (!value || value.includes('\\')) return fallback

  try {
    const url = new URL(value, internalOrigin)
    if (url.origin !== internalOrigin || !url.pathname.startsWith('/')) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
