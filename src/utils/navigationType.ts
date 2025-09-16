import { Platform } from 'react-native'

export type NavigationType = 'reload' | 'navigate' | 'back_forward' | 'prerender' | 'unknown'

/**
 * Gets the navigation type for the current page load (web only)
 * @returns The navigation type or 'unknown' if not available
 */
export function getNavigationType(): NavigationType {
  if (Platform.OS !== 'web') {
    return 'unknown'
  }

  try {
    if (typeof window === 'undefined' || !window.performance) {
      return 'unknown'
    }

    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navigationEntries.length > 0) {
      const navigationType = navigationEntries[0].type
      return navigationType as NavigationType
    }
  } catch (error) {
    console.warn('[navigationType] Failed to get navigation type:', error)
  }

  return 'unknown'
}


