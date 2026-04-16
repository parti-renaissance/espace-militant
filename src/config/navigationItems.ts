import { ComponentProps, useEffect, useMemo, useRef } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'
import {
  Award,
  Bot,
  Calendar,
  CircleUser,
  ClipboardCheck,
  ClipboardList,
  CopyCheck,
  DoorOpen,
  Download,
  Eye,
  FileBadge,
  FileStack,
  Globe,
  Goal,
  GraduationCap,
  Group,
  HeartHandshake,
  Home,
  Laptop,
  Link,
  Mail,
  Map,
  MessageSquareDot,
  MessageSquareQuote,
  Network,
  PartyPopper,
  PhoneOutgoing,
  ScrollText,
  Signature,
  Sparkle,
  Swords,
  TabletSmartphone,
  UsersRound,
  Vote,
  Zap,
} from '@tamagui/lucide-icons'

import { NavItem } from '@/components/AppStructure/Navigation/NavItem'

import { useSession } from '@/ctx/SessionProvider'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import type { IconComponent } from '@/models/common.model'
import { useGetExecutiveScopes, useHasRecentMembership } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export type NavItemConfig = {
  id: string
  iconLeft: IconComponent
  text: string
  href?: ComponentProps<typeof NavItem>['href']
  isNew?: boolean
  externalLink?: boolean
  externalUrlSlug?: string
  disabled?: boolean
  active?: boolean
  hasAccess?: boolean
  onPress?: () => void
  theme?: 'blue' | 'purple' | 'green' | 'orange'
  frame?: 'primary' | 'secondary' | 'cadre'
  displayIn?: 'sidebar' | 'tabbar' | 'all' | 'never'
}

// Configuration des items du menu militant pour utilisateurs connectés
const militantNavItemsAuthConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Home, text: 'Accueil', href: '/' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(tabs)/evenements' },
  // { id: 'actions', iconLeft: Zap, text: 'Actions', href: '/actions', routeName: '/actions', theme: 'blue' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', href: '/(tabs)/parrainages' },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', externalUrlSlug: '/formations' },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', href: '/(tabs)/ressources' },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', href: '/(tabs)/questionnaires' },
  { id: 'profil', iconLeft: CircleUser, text: 'Profil', href: '/(tabs)/profil', displayIn: 'tabbar' },
] as const

// Configuration des items du menu militant pour utilisateurs non connectés
const militantNavItemsPublicConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Globe, text: 'parti-renaissance.fr', externalUrlSlug: 'https://parti-renaissance.fr/' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(tabs)/evenements' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', disabled: true },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', disabled: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', disabled: true },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', disabled: true },
] as const

export const useMilitantNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession()
  const openExternalContentHook = useOpenExternalContent({ slug: 'formation' })
  const { hasAccess: hasFormationsAccess } = useHasRecentMembership()

  const openRef = useRef(openExternalContentHook.open)
  useEffect(() => {
    openRef.current = openExternalContentHook.open
  }, [openExternalContentHook.open])

  return useMemo(() => {
    const baseConfig = isAuth ? militantNavItemsAuthConfig : militantNavItemsPublicConfig

    return baseConfig.map((item) => {
      // Pour l'item "formations", si le statut n'est pas "valid", utiliser la route locale
      if (item.id === 'formations' && !hasFormationsAccess) {
        return {
          ...item,
          href: '/(tabs)/formations',
          externalUrlSlug: undefined,
          externalLink: false,
        }
      }

      const config: NavItemConfig = {
        ...item,
        externalLink: item.externalUrlSlug ? true : false,
      }

      if (item.externalUrlSlug) {
        const externalUrl = item.externalUrlSlug
        if (externalUrl.startsWith('http')) {
          config.onPress = () => {
            if (isWeb) {
              window.open(externalUrl, '_blank')
            } else {
              WebBrowser.openBrowserAsync(externalUrl)
            }
          }
        } else {
          config.onPress = () => {
            openRef.current({ state: externalUrl })()
          }
        }
      }

      return config
    })
  }, [isAuth, hasFormationsAccess])
}

export const militantNavItems: NavItemConfig[] = []

const cadreNavItemsConfig: NavItemConfig[] = [
  { id: FEATURES.DASHBOARD, iconLeft: Eye, text: "Vue d'ensemble", theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
  { id: FEATURES.MY_TEAM, iconLeft: Sparkle, text: 'Mon équipe cadre', theme: 'purple', externalUrlSlug: '/mon-equipe', externalLink: true },
  { id: FEATURES.PUBLICATIONS, iconLeft: ScrollText, text: 'Mes publications', theme: 'purple', href: '/cadre/publications' },
  { id: FEATURES.MESSAGES, iconLeft: Mail, text: 'Messagerie', theme: 'purple', externalUrlSlug: '/messagerie', externalLink: true },
  { id: FEATURES.NEWS, iconLeft: MessageSquareDot, text: 'Notifications', theme: 'purple', externalUrlSlug: '/notifications', externalLink: true },
  { id: FEATURES.DEPARTMENT_SITE, iconLeft: Laptop, text: 'Site départemental', theme: 'purple', externalUrlSlug: '/site-departemental', externalLink: true },
  { id: FEATURES.MOBILE_APP, iconLeft: TabletSmartphone, text: 'Application mobile', theme: 'purple', externalUrlSlug: '/', externalLink: true },
  { id: FEATURES.CONTACTS, iconLeft: UsersRound, text: 'Mes militants', theme: 'purple', href: '/cadre/militants' },
  { id: FEATURES.CHATBOT, iconLeft: Bot, text: 'Chatbot', theme: 'purple', href: '/chatbot' },
  { id: FEATURES.REFERRALS, iconLeft: HeartHandshake, text: 'Suivi des parrainages', theme: 'purple', externalUrlSlug: '/parrainages', externalLink: true },
  {
    id: FEATURES.NATIONAL_EVENT,
    iconLeft: PartyPopper,
    text: 'Événements nationaux',
    theme: 'purple',
    externalUrlSlug: '/evenements-nationaux',
    externalLink: true,
  },
  { id: FEATURES.EVENTS, iconLeft: Calendar, text: 'Mes événements', theme: 'purple', externalUrlSlug: '/evenements', externalLink: true, displayIn: 'never' },
  { id: FEATURES.ADHERENT_FORMATIONS, iconLeft: GraduationCap, text: 'Mes formations', theme: 'purple', externalUrlSlug: '/formations', externalLink: true },
  { id: FEATURES.EAGGLE, iconLeft: Map, text: 'Cartographie électorale', theme: 'purple', externalUrlSlug: '/cartographie-electorale', externalLink: true },
  { id: FEATURES.SURVEY, iconLeft: ClipboardList, text: 'Questionnaires', theme: 'purple', externalUrlSlug: '/questionnaires', externalLink: true },
  { id: FEATURES.PHONING_CAMPAIGN, iconLeft: PhoneOutgoing, text: 'Phoning', theme: 'purple', externalUrlSlug: '/phoning', externalLink: true },
  { id: FEATURES.PAP, iconLeft: DoorOpen, text: 'Porte-à-porte', theme: 'purple', externalUrlSlug: '/porte-a-porte', externalLink: true },
  { id: FEATURES.RIPOSTES, iconLeft: Swords, text: 'Ripostes', theme: 'purple', externalUrlSlug: '/ripostes', externalLink: true },
  { id: FEATURES.TEAM, iconLeft: Group, text: 'Groupes', theme: 'purple', externalUrlSlug: '/groupes', externalLink: true },
  { id: FEATURES.PROCURATIONS, iconLeft: Signature, text: 'Procurations', theme: 'purple', externalUrlSlug: '/procurations', externalLink: true },
  { id: FEATURES.COMMITTEE, iconLeft: Network, text: 'Comités locaux', theme: 'purple', externalUrlSlug: '/comites', externalLink: true },
  { id: FEATURES.CIRCONSCRIPTIONS, iconLeft: Goal, text: 'Circonscriptions', theme: 'purple', externalUrlSlug: '/circonscriptions', externalLink: true },
  { id: FEATURES.DESIGNATION, iconLeft: CopyCheck, text: 'Désignations', theme: 'purple', externalUrlSlug: '/votes-et-consultations', externalLink: true },
  { id: FEATURES.ELECTIONS, iconLeft: Vote, text: 'Votes et consultations', theme: 'purple', externalUrlSlug: '/votes-et-consultations', externalLink: true },
  {
    id: FEATURES.STATUTORY_MESSAGE,
    iconLeft: MessageSquareQuote,
    text: 'Message statutaire',
    theme: 'purple',
    externalUrlSlug: '/mails-statutaires',
    externalLink: true,
  },
  {
    id: FEATURES.GENERAL_MEETING_REPORTS,
    iconLeft: FileBadge,
    text: 'Procès-verbaux d’AG',
    theme: 'purple',
    externalUrlSlug: '/proces-verbal',
    externalLink: true,
  },
  { id: FEATURES.DOCUMENTS, iconLeft: FileStack, text: 'Documents', theme: 'purple', externalUrlSlug: '/documents', externalLink: true },
  { id: FEATURES.ELECTED_REPRESENTATIVE, iconLeft: Award, text: 'Élus', theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
  { id: FEATURES.ACTIONS, iconLeft: Zap, text: 'Actions', theme: 'purple', externalUrlSlug: '/actions', externalLink: true, displayIn: 'never' },
  { id: FEATURES.CONTACTS_EXPORT, iconLeft: Download, text: 'Export contacts', theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
] as const

export const useCadreNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession()
  const { data } = useGetExecutiveScopes()
  const openExternalContentHook = useOpenExternalContent({ slug: 'cadre' })

  const defaultScope = data?.default
  const defaultScopeCode = defaultScope?.code ?? ''
  const defaultScopeFeatures = defaultScope?.features ?? []

  const defaultScopeFeaturesKey = JSON.stringify([...defaultScopeFeatures].sort())

  // Utiliser useRef pour stabiliser la référence de la fonction open
  const openRef = useRef(openExternalContentHook.open)
  useEffect(() => {
    openRef.current = openExternalContentHook.open
  }, [openExternalContentHook.open])

  return useMemo(() => {
    if (!isAuth) {
      return []
    }

    const hasFeatureInDefaultScope = (featureId: string) => defaultScopeFeatures.includes(featureId)

    return cadreNavItemsConfig
      .filter((item) => hasFeatureInDefaultScope(item.id))
      .map((item) => {
        const config: NavItemConfig = {
          ...item,
          hasAccess: true,
          externalLink: item.externalUrlSlug ? true : false,
        } as NavItemConfig

        if (item.externalUrlSlug) {
          const stateUrl = `${item.externalUrlSlug}?scope=${defaultScopeCode}`

          config.onPress = () => {
            openRef.current({ state: stateUrl })()
          }
        }

        return config
      })
  }, [isAuth, defaultScopeCode, defaultScopeFeaturesKey, defaultScopeFeatures])
}

export const cadreNavItems: NavItemConfig[] = []
