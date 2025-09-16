import { Href } from 'expo-router'

export const parseHref = (x: unknown, source?: string): Href | null => {
  if (typeof x !== 'string') return null
  
  let href: string
  
  if (x.startsWith('/')) {
    href = x
  } else if (x.startsWith('https')) {
    try {
      const url = new URL(x)
      href = url.pathname + url.search
    } catch (e) {
      return null
    }
  } else {
    return null
  }
  
  // Ajouter le paramètre source si fourni
  if (source) {
    const separator = href.includes('?') ? '&' : '?'
    href = `${href}${separator}source=${encodeURIComponent(source)}`
  }
  
  return href as Href
}
