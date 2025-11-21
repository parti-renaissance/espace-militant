/**
 * Checks if a navigation item is active based on the current pathname.
 * An item is active if:
 * - The pathname exactly matches the item's href, OR
 * - The pathname starts with the item's href followed by a slash (for sub-routes)
 * 
 * @param pathname - The current pathname
 * @param href - The href of the navigation item
 * @returns true if the item should be active, false otherwise
 */
export function isNavItemActive(pathname: string, href?: string): boolean {
  if (!href) return false
  
  const normalizedPathname = pathname.replace(/\/$/, '') || '/'
  const normalizedHref = href.replace(/\/$/, '') || '/'
  
  // Check exact match or if pathname starts with the href (for sub-routes)
  return normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + '/')
}

