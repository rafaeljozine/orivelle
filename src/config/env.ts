import type { CurrencyCode } from '../types/common'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const appEnv = {
  supabaseUrl: supabaseUrl || undefined,
  supabaseAnonKey: supabaseAnonKey || undefined,
  hasSupabase: Boolean(supabaseUrl && supabaseAnonKey),
  timezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'Africa/Maputo',
  currency: 'MZN' satisfies CurrencyCode,
} as const