import { Lock, LockKeyhole, Ticket, Unlock } from '@tamagui/lucide-icons'

import { SelectOption } from '@/components/base/Select/SelectV3'

import { RestUserScopesResponse } from '@/services/profile/schema'

import { EventFormData } from './schema'

const ALL_VISIBILITY_OPTIONS: SelectOption<EventFormData['visibility']>[] = [
  {
    value: 'public',
    icon: Unlock,
    label: 'Ouvert au public',
    subLabel: 'Tout le monde peut s’y inscrire avec un prénom, un email et un code postal pour découvrir le Parti.',
  },
  {
    value: 'private',
    icon: Lock,
    theme: 'blue',
    label: 'Réservé aux millitants',
    subLabel: 'Les externes ne pourront pas s’y inscrire sans adhérer ou créer un compte. Un aperçu sera visible publiquement.',
  },
  {
    value: 'adherent',
    icon: Lock,
    theme: 'yellow',
    label: 'Réservé aux adhérents',
    subLabel: 'Les sympathisants ne pourront pas s’y inscrire sans adhérer. Il ne sera pas visible publiquement.',
  },
  {
    value: 'adherent_dues',
    icon: LockKeyhole,
    theme: 'yellow',
    label: 'Réservé aux adhérents à jour',
    subLabel: 'Les adhérents non-à-jour et les sympathisants ne pourront pas s’y inscrire sans cotiser cette année. Il ne sera pas visible publiquement.',
  },
  {
    value: 'invitation',
    icon: Ticket,
    theme: 'orange',
    label: 'Réservé aux membres invités',
    subLabel: 'Seules les personnes invitées nominativement peuvent voir et s’inscrire à l’événement.',
  },
]

type SelectedScopeData = RestUserScopesResponse[number] | null | undefined

const isCommitteeScope = (selectedScopeData?: SelectedScopeData) => {
  if (selectedScopeData?.attributes?.committees?.length) {
    return true
  }

  return selectedScopeData?.code?.toLowerCase() === 'animator'
}

export const getVisibilityOptions = (selectedScopeData?: SelectedScopeData): SelectOption<EventFormData['visibility']>[] => {
  const scope = selectedScopeData?.code ?? ''

  if (!scope) {
    return ALL_VISIBILITY_OPTIONS
  }

  if (scope?.startsWith('agora_')) {
    return ALL_VISIBILITY_OPTIONS
  }

  if (isCommitteeScope(selectedScopeData)) {
    return ALL_VISIBILITY_OPTIONS
  }

  return ALL_VISIBILITY_OPTIONS.filter((opt) => opt.value !== 'invitation')
}

export default getVisibilityOptions
