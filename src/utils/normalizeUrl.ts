/**
 * Normalise une URL en ajoutant https:// si nécessaire
 * @param url - L'URL à normaliser
 * @returns L'URL normalisée
 */
export const normalizeUrl = (url: string | null | undefined): string => {
  if (!url?.trim()) return url || ''
  
  const trimmed = url.trim()
  
  // Ne pas toucher aux protocoles existants
  const hasProtocol = 
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') || 
    trimmed.startsWith('tel:') || 
    trimmed.startsWith('sms:') ||
    trimmed.startsWith('ftp://') ||
    trimmed.startsWith('file://')
  
  if (hasProtocol) {
    return trimmed
  }
  
  // Ajouter https:// par défaut
  return `https://${trimmed}`
}

/**
 * Normalise les liens dans le HTML
 */
export const normalizeHtmlLinks = (html: string): string => {
  return html.replace(/href="([^"]+)"/g, (match, url) => {
    const normalized = normalizeUrl(url)
    return `href="${normalized}"`
  })
}

/**
 * Normalise les liens dans la structure JSON de TipTap
 */
export const normalizeJsonLinks = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeJsonLinks)
  }
  
  const result = { ...obj }
  
  // Si c'est un mark de type link, normaliser l'href
  if (result.type === 'link' && result.attrs?.href) {
    result.attrs = { 
      ...result.attrs, 
      href: normalizeUrl(result.attrs.href) 
    }
  }
  
  // Parcourir récursivement tous les champs
  Object.keys(result).forEach(key => {
    result[key] = normalizeJsonLinks(result[key])
  })
  
  return result
}

