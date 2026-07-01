import { RestProfilResponse } from '@/services/profile/schema'
import { Calendar, CircleUser, Home, Zap } from '@tamagui/lucide-icons'
import { ThemeName } from 'tamagui'
import { IconComponent } from '@/models/common.model'
import * as magicLinkTypes from '@/services/magic-link/schema'

export type TabRoute = {
  name: '(home)' | 'evenements' | 'actions' | 'news' | 'profil' | 'messages' | 'scanner'
  screenName: string
  highlighted?: boolean
  icon: IconComponent
  hidden?: boolean | ((profile?: RestProfilResponse) => boolean)
  hiddenMobile?: boolean | ((profile?: RestProfilResponse) => boolean)
  disabled?: boolean
  href?: string
  externalSlug?: magicLinkTypes.Slugs
  theme: ThemeName
}

export const ROUTES: TabRoute[] = [
  {
    name: '(home)',
    screenName: 'Accueil',
    icon: Home,
    theme: 'gray',
  },
  {
    name: 'evenements',
    screenName: 'Événements',
    icon: Calendar,
    theme: 'blue',
  },
  {
    name: 'actions',
    screenName: 'Actions',
    icon: Zap,
    theme: 'green',
  },
  {
    name: 'profil',
    screenName: 'Mon profil',
    icon: CircleUser,
    theme: 'gray',
    hidden: true,
    hiddenMobile: true,
  },
]
