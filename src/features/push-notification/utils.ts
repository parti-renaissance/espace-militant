import { Href } from 'expo-router'

export const parseHref = (x: unknown): Href | null => {
  if (typeof x !== 'string') return null
  if (x.startsWith('/')) return x as Href
  if (x.startsWith('https')) {
    try {
      const url = new URL(x)
      return (url.pathname + url.search) as Href
    } catch (e) {
      return null
    }
  }
  return null
}
