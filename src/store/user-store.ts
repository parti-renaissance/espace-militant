import { AsyncStorage } from '@/hooks/useStorageState'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface User {
  accessToken: string
  refreshToken?: string
  sessionId?: string
  isAdmin?: boolean
  accessTokenExpiresIn?: number
  accessTokenExpiresAt?: number
}

interface UserSessionData {
  user: User | null
  onboardingOpenedAt: string | null
  hideResubscribeAlert: string | null
  defaultScope: string | null
  lastAvailableScopes: string[] | null
}

const initialUserData: UserSessionData = {
  user: null,
  onboardingOpenedAt: null,
  hideResubscribeAlert: null,
  defaultScope: null,
  lastAvailableScopes: null,
}

interface UserState extends UserSessionData {
  setCredentials: (user: User) => void
  removeCredentials: () => void
  setOnboardingOpenedAt: (date: string | null) => void
  setHideReSubscribeAlert: (x: string | null) => void
  setDefaultScope: (scope: string) => void
  setLastAvailableScopes: (scopes: string[]) => void
  _hasHydrated: boolean
  _setHasHydrated: (hasHydrated: boolean) => void
  rehydrateFromStorage: () => Promise<void>
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  ...initialUserData,
  _hasHydrated: false,
  setDefaultScope: (scope) => set({ defaultScope: scope }),
  setLastAvailableScopes: (scopes) => set({ lastAvailableScopes: scopes }),
  setCredentials: (user) => {
    const userWithExpiration: User = {
      ...user,
      accessTokenExpiresAt: user.accessTokenExpiresIn
        ? Date.now() + user.accessTokenExpiresIn * 1000
        : user.accessTokenExpiresAt,
    }
    set({ ...initialUserData, user: userWithExpiration })
  },
  removeCredentials: () => set({ ...initialUserData }),
  setOnboardingOpenedAt: (onboardingOpenedAt) => set({ onboardingOpenedAt }),
  _setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
  setHideReSubscribeAlert: (hideResubscribeAlert) => set({ hideResubscribeAlert }),
  rehydrateFromStorage: async () => {
    // Force la réhydratation depuis le storage pour éviter les désynchronisations entre onglets
    try {
      const stored = await AsyncStorage.getItem('user')
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
  storage: createJSONStorage(() => AsyncStorage),
  onRehydrateStorage: () => (state, error) => {
    if (state) {
      state._setHasHydrated(true)
    } else {
      if (error && error instanceof Error) {
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
