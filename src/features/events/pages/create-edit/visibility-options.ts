import { SelectOption } from '@/components/base/Select/SelectV3'
import { EventFormData } from '@/features/events/pages/create-edit/schema'
import { Lock, LockKeyhole, Unlock } from '@tamagui/lucide-icons'

const visibilityOptions: SelectOption<EventFormData['visibility']>[] = [
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
]

export default visibilityOptions
