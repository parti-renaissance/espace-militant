import { AsyncStorage } from '@/hooks/useStorageState'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { BotChatMessage } from '@/services/bot/schema'

type SetMessagesArg = BotChatMessage[] | ((prev: BotChatMessage[]) => BotChatMessage[])

type BotState = {
  threadId: string | null
  messages: BotChatMessage[]
  setThreadId: (id: string | null) => void
  setMessages: (messages: SetMessagesArg) => void
  clearThread: () => void
}

export const useBotStore = create<BotState>()(
  persist(
    (set) => ({
      threadId: null,
      messages: [],
      setThreadId: (id) => set({ threadId: id }),
      setMessages: (arg) =>
        set((state) => ({
          messages: typeof arg === 'function' ? arg(state.messages) : arg,
        })),
      clearThread: () => set({ threadId: null, messages: [] }),
    }),
    {
      name: 'bot-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
