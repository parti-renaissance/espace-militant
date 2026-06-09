import { Href, router } from 'expo-router'

export const AuthRoutes = {
  BIENVENUE: '/(signup)/bienvenue',
  INSCRIPTION: '/(signup)/inscription',
} as const

export type AuthRoutePath = (typeof AuthRoutes)[keyof typeof AuthRoutes]

export function getAuthHref(route: AuthRoutePath, redirectUri?: string): Href {
  if (redirectUri && redirectUri !== '/') {
    return `${route}?redirectUri=${encodeURIComponent(redirectUri)}` as Href
  }

  return route as Href
}

/** Première ouverture et action volontaire « Je m'inscris ». */
export function navigateToWelcome(redirectUri?: string) {
  router.replace(getAuthHref(AuthRoutes.BIENVENUE, redirectUri))
}
