import type { Session } from '@supabase/supabase-js'
import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    }).catch(() => {
      if (active) setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
