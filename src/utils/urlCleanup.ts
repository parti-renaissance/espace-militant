import { Platform } from 'react-native'

/**
 * Removes specified parameters from the current URL (web only)
 * This is used to clean up tracking parameters after they've been used once
 * to prevent false stats on subsequent shares or copy/paste operations
 * 
 * @param paramsToClean - Array of parameter names to remove from the URL
 */
export function cleanupUrlParams(paramsToClean: string[]): void {
  if (Platform.OS !== 'web') {
    return
  }

  try {
    const url = new URL(window.location.href)
    let hasChanges = false
    
    paramsToClean.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param)
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      // Use history.replaceState to update the URL without triggering a page reload
      window.history.replaceState({}, '', url.toString())
    }
  } catch (error) {
    // Silently fail if URL manipulation is not possible
    console.warn('[urlCleanup] Failed to clean URL parameters:', error)
  }
}
