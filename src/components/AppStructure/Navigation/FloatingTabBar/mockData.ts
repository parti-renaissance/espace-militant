import {
  Calendar,
  Eye,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Mail,
  MessageSquareDot,
  Newspaper,
  ScrollText,
  Sparkle,
  Zap,
} from '@tamagui/lucide-icons'

import type { NavItemConfig } from '@/config/navigationItems'

import type { FloatingTabBarItem } from './FloatingTabBar'

const noop = () => {}

export const mockMembreTabItems: FloatingTabBarItem[] = [
  { id: 'accueil', label: "M'informer", icon: Newspaper, theme: 'blue' },
  { id: 'evenements', label: 'Agir', icon: Zap, theme: 'blue' },
  { id: 'soutenir', label: 'Soutenir', icon: HeartHandshake, theme: 'blue' },
  { id: 'idees', label: 'Débattre', icon: Lightbulb, theme: 'blue' },
]

export const mockCadreTabItems: FloatingTabBarItem[] = [
  { id: 'accueil', label: "M'informer", icon: Newspaper, theme: 'blue' },
  { id: 'evenements', label: 'Agir', icon: Zap, theme: 'blue' },
  { id: 'cadreSheet', label: 'Cadre', icon: Sparkle, theme: 'pink' },
  { id: 'soutenir', label: 'Soutenir', icon: HeartHandshake, theme: 'blue' },
  { id: 'idees', label: 'Débattre', icon: Lightbulb, theme: 'blue' },
]

export const mockCadreTabItemsWithBadges: FloatingTabBarItem[] = [
  { id: 'accueil', label: "M'informer", icon: Newspaper, theme: 'blue', badge: 3 },
  { id: 'evenements', label: 'Agir', icon: Zap, theme: 'blue' },
  { id: 'cadreSheet', label: 'Cadre', icon: Sparkle, theme: 'pink', badge: true },
  { id: 'soutenir', label: 'Soutenir', icon: HeartHandshake, theme: 'blue' },
  { id: 'idees', label: 'Débattre', icon: Lightbulb, theme: 'blue', badge: 12 },
]

export const mockCadreSheetItems: NavItemConfig[] = [
  { id: 'dashboard', iconLeft: Eye, text: "Vue d'ensemble", theme: 'pink', externalLink: true, onPress: noop },
  { id: 'team', iconLeft: Sparkle, text: 'Mon équipe cadre', theme: 'pink', externalLink: true, onPress: noop },
  { id: 'publications', iconLeft: ScrollText, text: 'Mes publications', theme: 'pink', onPress: noop },
  { id: 'messages', iconLeft: Mail, text: 'Messagerie', theme: 'pink', externalLink: true, onPress: noop },
  { id: 'news', iconLeft: MessageSquareDot, text: 'Notifications', theme: 'pink', externalLink: true, onPress: noop },
  { id: 'events', iconLeft: Calendar, text: 'Mes événements', theme: 'pink', externalLink: true, onPress: noop },
  { id: 'formations', iconLeft: GraduationCap, text: 'Mes formations', theme: 'pink', externalLink: true, onPress: noop },
]
