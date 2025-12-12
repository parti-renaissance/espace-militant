/**
 * Checks if a navigation item is active based on the current pathname.
 * An item is active if:
 * - The pathname exactly matches the item's href, OR
 * - The pathname starts with the item's href followed by a slash (for sub-routes)
 * 
 * Route groups (text in parentheses like /(app)/ or /(militant)/) are removed before comparison
 * because they don't appear in the actual browser URL.
 * 
 * @param pathname - The current pathname
 * @param href - The href of the navigation item
 * @returns true if the item should be active, false otherwise
 */
export function isNavItemActive(pathname: string, href?: string): boolean {
  if (!href) return false
  
  // Remove trailing slashes
  let normalizedPathname = pathname.replace(/\/$/, '') || '/'
  let normalizedHref = href.replace(/\/$/, '') || '/'
  
  // Remove all route groups (text in parentheses) from both pathname and href
  // because route groups don't appear in the actual URL
  // e.g., /(app)/(militant)/evenements -> /evenements
  normalizedPathname = normalizedPathname.replace(/\/\([^)]+\)/g, '')
  normalizedHref = normalizedHref.replace(/\/\([^)]+\)/g, '')
  
  // Handle empty paths (home page)
  if (normalizedPathname === '') normalizedPathname = '/'
  if (normalizedHref === '') normalizedHref = '/'

  // Check exact match or if pathname starts with the href (for sub-routes)
  return normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + '/')
}

