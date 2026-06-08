import { Href, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

import clientEnv from '@/config/clientEnv'

type LinkPressEvent = { preventDefault?: () => void }

export type QueryParams = Record<string, string | number | boolean | null | undefined>

export const appendQueryParams = (url: string, params?: QueryParams): string => {
  if (!params) return url

  const entries = Object.entries(params).filter((entry): entry is [string, string | number | boolean] => entry[1] != null && entry[1] !== '')
  if (entries.length === 0) return url

  try {
    const parsed = new URL(url)
    for (const [key, value] of entries) {
      parsed.searchParams.set(key, String(value))
    }
    return parsed.toString()
  } catch {
    const search = new URLSearchParams(Object.fromEntries(entries.map(([key, value]) => [key, String(value)])))
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${search.toString()}`
  }
}

/**
 * Vérifie si une URL est un lien interne (relatif ou vers le domaine associé)
 */
export const isInternalLink = (url: string): boolean => {
  return url.startsWith('/') || url.startsWith(`https://${clientEnv.ASSOCIATED_DOMAIN}`) || url.startsWith(`http://${clientEnv.ASSOCIATED_DOMAIN}`)
}

/**
 * Gère le clic sur un lien en fonction de son type (interne/externe)
 * @param url - L'URL du lien
 * @param onLinkClick - Callback optionnel appelé avant la navigation
 * @param linkText - Texte du lien (pour le callback)
 * @param e - Événement (pour empêcher le comportement par défaut sur web)
 */
export const handleLinkPress = async (url: string, onLinkClick?: (target_url: string, button_name: string) => void, linkText?: string, e?: LinkPressEvent) => {
  if (onLinkClick && linkText) {
    onLinkClick(url, linkText)
  }

  const internal = isInternalLink(url)

  if (isWeb && internal && e) {
    e.preventDefault?.()
  }

  if (url.startsWith('/')) {
    router.push(url as Href)
  } else if (url.startsWith(`https://${clientEnv.ASSOCIATED_DOMAIN}`) || url.startsWith(`http://${clientEnv.ASSOCIATED_DOMAIN}`)) {
    // Extraire le chemin depuis l'URL du domaine associé
    const urlObj = new URL(url)
    router.push(urlObj.pathname as Href)
  } else if (isWeb) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    await WebBrowser.openBrowserAsync(url)
  }
}

export const openExternalLink = async (url: string, params?: QueryParams) => {
  await handleLinkPress(appendQueryParams(url, params))
}
