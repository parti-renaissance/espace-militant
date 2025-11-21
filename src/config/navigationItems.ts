import { ComponentProps } from 'react'
import { Home, Calendar, Zap, HeartHandshake, GraduationCap, Link, ClipboardCheck, ScrollText, Flag, Users, Network, Goal, Vote, CircleUser } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/Navigation/NavItem'
import type { IconComponent } from '@/models/common.model'

export type NavItemConfig = {
  id: string
  iconLeft: IconComponent
  text: string
  href?: ComponentProps<typeof NavItem>['href']
  isNew?: boolean
  externalLink?: boolean
  disabled?: boolean
  active?: boolean
  onPress?: () => void
  theme?: 'blue' | 'purple' | 'green' | 'orange'
  frame?: 'default' | 'cadre'
  displayIn?: 'sidebar' | 'tabbar' | 'all'
}

// Configuration des items du menu militant
export const militantNavItems: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Home, text: 'Accueil', href: '/dev/accueil', theme: 'blue' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/dev/evenements', theme: 'blue' },
  { id: 'actions', iconLeft: Zap, text: 'Actions', href: '/dev/actions', theme: 'blue' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', href: '/dev/parrainages', theme: 'blue' },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', externalLink: true, disabled: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', href: '/dev/ressources' },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', isNew: true, href: '/dev/questionnaires' },
  { id: 'profil', iconLeft: CircleUser, text: 'Profil', href: '/dev/profil', theme: 'blue', displayIn: 'tabbar' },
]

// Configuration des items du menu cadre
export const cadreNavItems: NavItemConfig[] = [
  { id: 'publications', iconLeft: ScrollText, text: 'Mes publications', theme: 'purple', href: '/dev/cadre/publications' },
  { id: 'militants', iconLeft: Flag, text: 'Mes militants', theme: 'purple', externalLink: true },
  { id: 'equipe', iconLeft: Users, text: 'Mon équipe', theme: 'purple', externalLink: true },
  { id: 'comites', iconLeft: Network, text: 'Gestion des comités', theme: 'purple', externalLink: true },
  { id: 'circonscriptions', iconLeft: Goal, text: 'Gestion des circonscriptions', theme: 'purple', disabled: true, externalLink: true },
  { id: 'votes', iconLeft: Vote, text: 'Votes et consultations', theme: 'purple', externalLink: true },
]
