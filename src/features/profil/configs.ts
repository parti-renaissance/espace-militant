import { NamedExoticComponent } from 'react'
import { RestProfilResponse } from '@/services/profile/schema'
import { IconProps } from '@tamagui/helpers-icon'
import { CircleUser, HeartHandshake, HelpingHand, KeyRound, LandPlot, MessageCircle, Settings2, Sparkle, TreeDeciduous } from '@tamagui/lucide-icons'

export type PageConfig = {
  title: string
  icon: NamedExoticComponent<IconProps>
  hiddenInMenu?: boolean | ((profile?: RestProfilResponse) => boolean)
}

export const pageConfigs: { [key: string]: PageConfig } = {
  index: {
    title: 'Mon profil',
    icon: CircleUser,
  },
  'acces-cadre': {
    title: 'Accès cadre',
    icon: Sparkle,
    hiddenInMenu: (profile) => !profile?.cadre_access,
  },
  'cotisations-et-dons': {
    title: 'Cotisations et dons',
    icon: HelpingHand,
  },
  'mes-instances': {
    title: 'Mes instances',
    icon: LandPlot,
  },
  'informations-personnelles': {
    title: 'Informations personnelles',
    icon: Settings2,
  },
  communications: {
    title: 'Communications',
    icon: MessageCircle,
  },
  'informations-elu': {
    title: 'Informations élu',
    icon: TreeDeciduous,
  },
  'mot-de-passe': {
    title: 'Mot de passe',
    icon: KeyRound,
  },
  invitation: {
    title: 'Invitation',
    icon: HeartHandshake,
    hiddenInMenu: true,
  },
  // certification: {
  //   title: 'Certification',
  //   icon: BadgeCheck,
  // },
}
