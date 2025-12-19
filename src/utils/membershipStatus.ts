import { RestProfilResponse } from '@/services/profile/schema'

export type MembershipStatus = 'valid' | 'renew' | 'join' | 'tofinish' | null

/**
 * Détermine le statut d'adhésion d'un utilisateur à partir de ses tags
 * @param tags Les tags de l'utilisateur
 * @returns Le statut d'adhésion : 'valid' (à jour), 'renew' (à renouveler), 'join' (non adhérent), 'tofinish' (incomplet), ou null
 */
export const getMembershipStatus = (tags: RestProfilResponse['tags']): MembershipStatus => {
  const codes = tags.map((tag) => tag.code)

  if (codes.includes('sympathisant:adhesion_incomplete')) {
    return 'tofinish'
  }

  if (codes.includes('sympathisant:')) {
    return 'join'
  }

  if (codes.some((code) => code.startsWith('adherent:plus_a_jour'))) {
    return 'renew'
  }
  if (codes.some((code) => code.startsWith('adherent:a_jour_'))) {
    return 'valid'
  }

  return 'join'
}
