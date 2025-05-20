import { HomeIcon } from '@/assets/icons/nav'
import { RestProfilResponse } from '@/services/profile/schema'
import { Calendar, CircleUser, ClipboardCheck, DoorOpen, GraduationCap, Home, Link, Zap, HeartHandshake } from '@tamagui/lucide-icons'
import { ThemeName } from 'tamagui'

export type TabRoute = {
  name: '(home)' | 'evenements' | 'actions' | 'news' | 'ressources' | 'porte-a-porte' | 'formations' | 'profil' | 'messages' | 'etats-generaux' | 'parrainages'
  screenName: string
  highlighted?: boolean
  icon: typeof HomeIcon
  hidden?: boolean | ((profile?: RestProfilResponse) => boolean)
  hiddenMobile?: boolean | ((profile?: RestProfilResponse) => boolean)
  href?: string
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
    name: 'parrainages',
    screenName: 'Parrainages',
    icon: HeartHandshake,
    theme: 'orange',
    hidden: false,
    hiddenMobile: (profile) => !profile?.tags?.find((tag) => tag.code.startsWith('adherent:')),
  },
  {
    name: 'actions',
    screenName: 'Actions',
    icon: Zap,
    theme: 'green',
  },
  {
    name: 'etats-generaux',
    screenName: 'États généraux',
    icon: ClipboardCheck,
    theme: 'orange',
    hidden: true,
    hiddenMobile: true,
  },
  {
    name: 'formations',
    screenName: 'Formations',
    icon: GraduationCap,
    theme: 'gray',
    hidden: true,
    hiddenMobile: true,
  },
  {
    name: 'ressources',
    screenName: 'Ressources',
    icon: Link,
    theme: 'gray',
    hidden: true,
    hiddenMobile: true,
  },
  {
    name: 'porte-a-porte',
    screenName: 'Porte à Porte',
    icon: DoorOpen,
    theme: 'orange',
    hiddenMobile: true,
    hidden: true,
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
