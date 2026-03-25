import React from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { User } from '@/store/user-store'
import type { RestProfilResponse } from '@/services/profile/schema'

export type AuthContextType = {
  signIn: (props?: { code?: string; isAdmin?: boolean; state?: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: (props?: { utm_campaign?: string }) => Promise<void>
  isAuth: boolean
  isAdmin: boolean
  session?: User | null
  isLoading: boolean
  user: UseQueryResult<RestProfilResponse>
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
