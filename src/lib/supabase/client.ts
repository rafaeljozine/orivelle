import { createClient } from '@supabase/supabase-js'
import { appEnv } from '../../config/env'

export const supabase = appEnv.hasSupabase
  ? createClient(appEnv.supabaseUrl!, appEnv.supabaseAnonKey!, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
    })
  : null