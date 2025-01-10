import { AsyncStorage } from '@/hooks/useStorageState'

const ANSWERED_QUICK_POLLS = 'answeredQuickPolls'

class LocalStore {
  private static instance: LocalStore
  private constructor() {}

  async storeAnsweredQuickPoll(quickPollId: string): Promise<void> {
    const pollsIds = await this.getAnsweredQuickPolls()
    const jsonValue = JSON.stringify(pollsIds + quickPollId)
    await AsyncStorage.setItem(ANSWERED_QUICK_POLLS, jsonValue)
  }

  async getAnsweredQuickPolls(): Promise<Array<string>> {
    const rawValue = await AsyncStorage.getItem(ANSWERED_QUICK_POLLS)
    const value = this.parseJSON(rawValue)
    return value ?? []
  }

  public static getInstance(): LocalStore {
    if (!LocalStore.instance) {
      LocalStore.instance = new LocalStore()
    }

    return LocalStore.instance
  }

  private parseJSON(value: string | null) {
    return value != null ? JSON.parse(value) : null
  }
}

export default LocalStore
