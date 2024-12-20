import AsyncStorage from '@react-native-async-storage/async-storage'
import { CacheMissError } from '../../core/errors'

const NAME_SPACE = 'lrem_data_cache'
class CacheManager {
  private static instance: CacheManager

  private constructor() {}

  private async getNamespaceCache(): Promise<Record<string, unknown>> {
    const cacheString = await AsyncStorage.getItem(NAME_SPACE)
    if (cacheString === null) {
      await AsyncStorage.setItem(NAME_SPACE, JSON.stringify({}))
    }

    if (cacheString) {
      try {
        return JSON.parse(cacheString) as Record<string, unknown>
      } catch {
        await AsyncStorage.setItem(NAME_SPACE, JSON.stringify({}))
        return {}
      }
    }
    return {}
  }

  async setInCache(cacheKey: string, payload: unknown): Promise<void> {
    const cache = await this.getNamespaceCache()
    return AsyncStorage.setItem(NAME_SPACE, JSON.stringify({ ...cache, [cacheKey]: payload }))
  }

  async getFromCache(cacheKey: string): Promise<unknown> {
    const cache = await this.getNamespaceCache()
    if (cache[cacheKey] === undefined || cache[cacheKey] === null) {
      throw new CacheMissError()
    }
    return cache[cacheKey]
  }

  async removeFromCache(cacheKey: string) {
    const cache = await this.getNamespaceCache()
    delete cache[cacheKey]
    return AsyncStorage.setItem(NAME_SPACE, JSON.stringify(cache))
  }

  purgeCache(): Promise<void> {
    return AsyncStorage.removeItem(NAME_SPACE)
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }

    return CacheManager.instance
  }
}

export default CacheManager
