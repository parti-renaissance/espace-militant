import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AsyncStorage } from '@/hooks/useStorageState';
import { ErrorMonitor } from '@/utils/ErrorMonitor';


export interface User {
  accessToken: string
  refreshToken?: string
  sessionId?: string
  isAdmin?: boolean
  accessTokenExpiresIn?: number
  accessTokenExpiresAt?: number
}

export type SignupTunnelStatus = 'pending' | 'skipped' | 'completed'

interface UserSessionData {
  user: User | null
  onboardingOpenedAt: string | null
  hideResubscribeAlert: string | null
  defaultScope: string | null
  lastAvailableScopes: string[] | null
  signupTunnelStatus: SignupTunnelStatus
}

const initialUserData: UserSessionData = {
  user: null,
  onboardingOpenedAt: null,
  hideResubscribeAlert: null,
  defaultScope: null,
  lastAvailableScopes: null,
  signupTunnelStatus: 'pending',
}

interface UserState extends UserSessionData {
  setCredentials: (user: User) => void
  removeCredentials: () => void
  setOnboardingOpenedAt: (date: string | null) => void
  setHideReSubscribeAlert: (x: string | null) => void
  setDefaultScope: (scope: string) => void
  setLastAvailableScopes: (scopes: string[]) => void
  setSignupTunnelSkipped: () => void
  _hasHydrated: boolean
  _setHasHydrated: (hasHydrated: boolean) => void
  rehydrateFromStorage: () => Promise<void>
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  ...initialUserData,
  _hasHydrated: false,
  setDefaultScope: (scope) => set({ defaultScope: scope }),
  setLastAvailableScopes: (scopes) => set({ lastAvailableScopes: scopes }),
  setSignupTunnelSkipped: () => set({ signupTunnelStatus: 'skipped' }),
  setCredentials: (user) => {
    const userWithExpiration: User = {
      ...user,
      accessTokenExpiresAt: user.accessTokenExpiresIn
        ? Date.now() + user.accessTokenExpiresIn * 1000
        : user.accessTokenExpiresAt,
    }
    set({ ...initialUserData, user: userWithExpiration, signupTunnelStatus: 'completed' })
  },
  removeCredentials: () =>
    set((state) => {
      // eslint-disable-next-line no-console
      console.log('[AUTH] removeCredentials', { hadUser: !!state.user, stack: new Error().stack })
      return { ...initialUserData, signupTunnelStatus: state.signupTunnelStatus }
    }),
  setOnboardingOpenedAt: (onboardingOpenedAt) => set({ onboardingOpenedAt }),
  _setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
  setHideReSubscribeAlert: (hideResubscribeAlert) => set({ hideResubscribeAlert }),
  rehydrateFromStorage: async () => {
    // Force la réhydratation depuis le storage pour éviter les désynchronisations entre onglets
    try {
      const stored = await AsyncStorage.getItem('user')
      const storedSecure = await AsyncStorage.secure.getItem('user')
      // eslint-disable-next-line no-console
      console.log('[AUTH] rehydrateFromStorage read', { hasStored: stored != null, hasStoredSecure: storedSecure != null })
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.state?.user) {
          set({ user: parsed.state.user })
        }
      }
    } catch (error) {
      ErrorMonitor.log('Failed to rehydrate from storage', { error })
    }
  },
})

const persistedUserStore = persist<UserState>(userStoreSlice, {
  name: 'user',
  storage: createJSONStorage(() => ({
    getItem: (key) => AsyncStorage.secure.getItem(key),
    setItem: (key, value) => AsyncStorage.secure.setItem(key, value),
    removeItem: (key) => AsyncStorage.secure.removeItem(key),
  })),
  onRehydrateStorage: () => (state, error) => {
    if (state) {
      state._setHasHydrated(true)
    } else {
      if (error && error instanceof Error) {
        useUserStore.setState({ _hasHydrated: true })
        ErrorMonitor.log('Failed to rehydrate user store', {
          error: error,
        })
      } else {
        ErrorMonitor.log('Failed to rehydrate user store')
      }
    }
  },
})

export const useUserStore = create(persistedUserStore)
