import { HIT_SOURCES } from '@/services/hits/constants'

import { getNavigationType } from './navigationType'

/**
 * Resolves the appropriate source value based on navigation type and URL parameters
 * @param urlSource - The source parameter from URL (if any)
 * @param defaultSource - The default source to use if no URL source is provided
 * @returns The appropriate source value
 */
export function resolveSource(urlSource?: string, defaultSource: string = HIT_SOURCES.DIRECT_LINK): string {
  const navigationType = getNavigationType()
  if (urlSource) return urlSource
  if (navigationType === 'reload') return HIT_SOURCES.RELOAD
  return defaultSource
}
