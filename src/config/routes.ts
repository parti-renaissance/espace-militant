import { ActionIcon } from '@/assets/icons/ActionIcon'
import { EventIcon } from '@/assets/icons/EventIcon'
import { HomeIcon } from '@/assets/icons/HomeIcon'
import { RipostIcon } from '@/assets/icons/RipostIcon'
import { ToolsIcon } from '@/assets/icons/ToolsIcon'
import { Calendar as CalendarSvg, Home as HomeSvg, Inbox as InboxSvg, Sparkle as SparkleSvg, Zap as ZapSvg } from '@tamagui/lucide-icons'

export type TabRoute = (typeof ROUTES)[number]

export const ROUTES = [
  {
    name: 'home',
    screenName: 'Fil',
    icon: HomeIcon,
    gradiant: ['#8D98FF', '#8050E6'],
  },
  {
    name: 'events',
    screenName: 'Événements',
    icon: EventIcon,
    gradiant: ['#52ABFB', '#0868E7'],
  },
  {
    name: 'actions',
    screenName: 'Actions',
    icon: ActionIcon,
    gradiant: ['#68F984', '#06B827'],
  },
  {
    name: 'news',
    screenName: 'Ripostes',
    icon: RipostIcon,
    gradiant: ['#FDA302', '#F7681E'],
  },
  {
    name: 'tools',
    screenName: 'Ressources',
    icon: ToolsIcon,
    gradiant: ['#E461E8', '#8B2DBF'],
  },
] as const
