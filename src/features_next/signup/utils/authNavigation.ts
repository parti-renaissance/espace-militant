import { Href, router } from 'expo-router'

export const AuthRoutes = {
  BIENVENUE: '/(signup)/bienvenue',
  INSCRIPTION: '/(signup)/inscription',
} as const

export type AuthRoutePath = (typeof AuthRoutes)[keyof typeof AuthRoutes]

export type AuthHrefParams = {
  redirectUri?: string
  ref?: string
  utm_source?: string
}

export function getAuthHref(route: AuthRoutePath, params?: string | AuthHrefParams): Href {
  const { redirectUri, ref, utm_source } = typeof params === 'string' ? { redirectUri: params } : (params ?? {})
  const query = new URLSearchParams()

  if (redirectUri && redirectUri !== '/') {
    query.set('redirectUri', redirectUri)
  }
  if (ref) {
    query.set('ref', ref)
  }
  if (utm_source) {
    query.set('utm_source', utm_source)
  }

  const qs = query.toString()
  return (qs ? `${route}?${qs}` : route) as Href
}

/** Première ouverture et action volontaire « Je m'inscris ». */
export function navigateToWelcome(redirectUri?: string) {
  router.replace(getAuthHref(AuthRoutes.BIENVENUE, redirectUri))
}
