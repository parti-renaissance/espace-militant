import { CircleUser, Sparkle, HelpingHand, LandPlot, Settings2, MessageCircle, TreeDeciduous, KeyRound } from "@tamagui/lucide-icons"
import { RestProfilResponse } from "@/services/profile/schema"
import { UserTagEnum } from "@/core/entities/UserProfile"

export type ProfilNavItemConfig = {
  id: string
  href: string
  text: string
  title: string
  icon: typeof CircleUser
  iconLeft: typeof CircleUser
  hiddenInMenu?: boolean | ((profile?: RestProfilResponse) => boolean)
}

export const pageConfigs: Record<string, ProfilNavItemConfig> = {
  index: {
    id: 'index',
    href: '/(militant)/profil',
    text: 'Mon profil',
    title: 'Mon profil',
    icon: CircleUser,
    iconLeft: CircleUser,
  },
  'acces-cadre': {
    id: 'acces-cadre',
    href: '/(militant)/profil/acces-cadre',
    text: 'Accès cadre',
    title: 'Accès cadre',
    icon: Sparkle,
    iconLeft: Sparkle,
    hiddenInMenu: (profile) => !profile?.cadre_access,
  },
  'cotisations-et-dons': {
    id: 'cotisations-et-dons',
    href: '/(militant)/profil/cotisations-et-dons',
    text: 'Cotisations et dons',
    title: 'Cotisations et dons',
    icon: HelpingHand,
    iconLeft: HelpingHand,
  },
  'mes-instances': {
    id: 'mes-instances',
    href: '/(militant)/profil/mes-instances',
    text: 'Mes instances',
    title: 'Mes instances',
    icon: LandPlot,
    iconLeft: LandPlot,
  },
  'informations-personnelles': {
    id: 'informations-personnelles',
    href: '/(militant)/profil/informations-personnelles',
    text: 'Informations personnelles',
    title: 'Informations personnelles',
    icon: Settings2,
    iconLeft: Settings2,
  },
  communications: {
    id: 'communications',
    href: '/(militant)/profil/communications',
    text: 'Communications',
    title: 'Communications',
    icon: MessageCircle,
    iconLeft: MessageCircle,
  },
  'informations-elu': {
    id: 'informations-elu',
    href: '/(militant)/profil/informations-elu',
    text: 'Informations élu',
    title: 'Informations élu',
    icon: TreeDeciduous,
    iconLeft: TreeDeciduous,
    hiddenInMenu: (profile) => !profile?.tags?.some((tag) => tag.type === UserTagEnum.ELU),
  },
  'mot-de-passe': {
    id: 'mot-de-passe',
    href: '/(militant)/profil/mot-de-passe',
    text: 'Mot de passe',
    title: 'Mot de passe',
    icon: KeyRound,
    iconLeft: KeyRound,
  },
}
