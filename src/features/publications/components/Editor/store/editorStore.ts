import { create } from 'zustand'

import type {
  RestAvailableSender,
  RestAvailableSendersResponse,
  RestGetMessageFiltersResponse,
  RestGetMessageResponse,
} from '@/services/publications/schema'

export type EditorStoreState = {
  messageId: string | undefined
  scope: string
  displayToolbar: boolean | undefined
  availableSenders: RestAvailableSendersResponse | undefined
  message: RestGetMessageResponse | undefined
  messageFilters: RestGetMessageFiltersResponse | undefined
  selectedSender: RestAvailableSender | null
  onSenderChange: ((sender: RestAvailableSender) => void) | undefined
}

export type EditorStoreActions = {
  hydrate: (payload: Partial<EditorStoreState>) => void
}

export const useEditorStore = create<EditorStoreState & EditorStoreActions>((set) => ({
  messageId: undefined,
  scope: '',
  displayToolbar: undefined,
  availableSenders: undefined,
  message: undefined,
  messageFilters: undefined,
  selectedSender: null,
  onSenderChange: undefined,

  hydrate: (payload) => set((state) => ({ ...state, ...payload })),
}))
