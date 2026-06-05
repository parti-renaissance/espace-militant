import { Href, router } from 'expo-router'

export function navigateToSignup() {
  router.replace('/(signup)/inscription' as Href)
}
