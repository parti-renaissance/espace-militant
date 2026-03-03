import React from 'react'
import type { User } from '@/store/user-store'

export type AuthContextType = {
  signIn: (props?: { code?: string; isAdmin?: boolean; state?: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: (props?: { utm_campaign?: string }) => Promise<void>
  isAuth: boolean
  isAdmin: boolean
  session?: User | null
  isLoading: boolean
  user: unknown
  scope: unknown
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function useSession(): AuthContextType {
  const value = React.useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }
  return value!
}
