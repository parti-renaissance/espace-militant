import type { Href } from 'expo-router'

import type { RestDetailedProfileResponse } from '@/services/profile/schema'

/** Routes de création — utilisées par le guard et les écrans `creer`. */
export const CREER_EVENEMENT_HREF = '/evenements/creer' as const satisfies Href
export const CREER_ACTION_HREF = '/actions/creer' as const satisfies Href

/** Étape 2 du modal « Compléter le profil » (identité). */
export const isProfileIdentityIncomplete = (profile: RestDetailedProfileResponse) =>
  !profile.birthdate || !profile.first_name?.trim() || !profile.last_name?.trim() || !profile.gender

/**
 * Profil considéré complet pour les guards (pages + actions).
 * Aligné sur le modal CompleteProfil : identité + adresse postale.
 */
export const isProfileComplete = (profile: RestDetailedProfileResponse) =>
  !isProfileIdentityIncomplete(profile) && Boolean(profile.post_address?.address?.trim())
