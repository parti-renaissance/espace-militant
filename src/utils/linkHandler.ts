import { Href, router } from 'expo-router'
import { isWeb } from 'tamagui'
import * as WebBrowser from 'expo-web-browser'
import clientEnv from '@/config/clientEnv'

type LinkPressEvent = { preventDefault?: () => void }

/**
 * Vérifie si une URL est un lien interne (relatif ou vers le domaine associé)
 */
export const isInternalLink = (url: string): boolean => {
  return url.startsWith('/') || 
    url.startsWith(`https://${clientEnv.ASSOCIATED_DOMAIN}`) || 
    url.startsWith(`http://${clientEnv.ASSOCIATED_DOMAIN}`)
}

/**
 * Gère le clic sur un lien en fonction de son type (interne/externe)
 * @param url - L'URL du lien
 * @param onLinkClick - Callback optionnel appelé avant la navigation
 * @param linkText - Texte du lien (pour le callback)
 * @param e - Événement (pour empêcher le comportement par défaut sur web)
 */
export const handleLinkPress = async (
  url: string, 
  onLinkClick?: (target_url: string, button_name: string) => void,
  linkText?: string,
  e?: LinkPressEvent
) => {
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
    window.open(url, '_blank')
  } else {
    await WebBrowser.openBrowserAsync(url)
  }
}
