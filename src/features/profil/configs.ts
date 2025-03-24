import { IconProps } from '@tamagui/helpers-icon'
import { CircleUser, HeartHandshake, HelpingHand, KeyRound, LandPlot, MessageCircle, Settings2, Sparkle, TreeDeciduous } from '@tamagui/lucide-icons'

export type PageConfig = {
  title: string
  icon: React.NamedExoticComponent<IconProps>
}

export const pageConfigs: {
  [key: string]: PageConfig
} = {
  index: {
    title: 'Mon profil',
    icon: CircleUser,
  },
  'acces-cadre': {
    title: 'Accès cadre',
    icon: Sparkle,
  },
  'cotisations-et-dons': {
    title: 'Cotisations et dons',
    icon: HelpingHand,
  },
  // parrainages: {
  //   title: 'Parrainages',
  //   icon: HeartHandshake,
  // },
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

  // certification: {
  //   title: 'Certification',
  //   icon: BadgeCheck,
  // },
}
