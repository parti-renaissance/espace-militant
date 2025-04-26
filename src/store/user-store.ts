import { AsyncStorage } from '@/hooks/useStorageState'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface User {
  accessToken: string
  refreshToken?: string
  sessionId?: string
  isAdmin?: boolean
}

interface UserState {
  user: User | null
  setCredentials: (user: User) => void
  removeCredentials: () => void
  hideResubscribeAlert: string | null
  setHideReSubscribeAlert: (x: string | null) => void
  setDefaultScope: (scope: string) => void
  setLastAvailableScopes: (scopes: string[]) => void
  defaultScope: string | null
  lastAvailableScopes: string[] | null
  _hasHydrated: boolean
  _setHasHydrated: (hasHydrated: boolean) => void
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  user: null,
  _hasHydrated: false,
  hideResubscribeAlert: null,
  defaultScope: null,
  lastAvailableScopes: null,
  setDefaultScope: (scope) => set({ defaultScope: scope }),
  setLastAvailableScopes: (scopes) => set({ lastAvailableScopes: scopes }),
  setCredentials: (user) => set({ user }),
  removeCredentials: () => set({ user: null }),
  _setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
  setHideReSubscribeAlert: (hideResubscribeAlert) => set({ hideResubscribeAlert }),
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
