import { getNavigationType } from './navigationType'

/**
 * Resolves the appropriate source value based on navigation type and URL parameters
 * @param urlSource - The source parameter from URL (if any)
 * @param defaultSource - The default source to use if no URL source is provided
 * @returns The appropriate source value
 */
export function resolveSource(urlSource?: string, defaultSource = 'direct_link'): string {
  const navigationType = getNavigationType()
  
  // If it's a reload, always use 'reload' as source
  if (navigationType === 'reload') {
    return 'reload'
  }
  
  // Otherwise, use URL source or default
  return urlSource || defaultSource
}
