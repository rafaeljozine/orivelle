import { createContext, useContext } from 'react'
import type { AuthState } from '../types/auth'

export const AuthContext = createContext<AuthState>({ session: null, user: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}