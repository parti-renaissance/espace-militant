import { ComponentProps, useMemo, useCallback, useRef, useEffect } from 'react'
import { Home, Calendar, Zap, HeartHandshake, GraduationCap, Link, ClipboardCheck, ScrollText, Group, DoorOpen, Network, Goal, Vote, CircleUser, Globe, Download, FileStack, Award, MessageSquareQuote, FileBadge, CopyCheck, Swords, ClipboardList, PhoneOutgoing, MapPin, PartyPopper, UsersRound, TabletSmartphone, Laptop, MessageSquareDot, Mail, Sparkle, Eye, Signature, Map } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/AppStructure/Navigation/NavItem'
import type { IconComponent } from '@/models/common.model'
import { UserTagEnum } from '@/core/entities/UserProfile'
import { useGetExecutiveScopes, useGetTags } from '@/services/profile/hook'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useSession } from '@/ctx/SessionProvider'
import { getMembershipStatus } from '@/utils/membershipStatus'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

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
  frame?: 'default' | 'cadre'
  displayIn?: 'sidebar' | 'tabbar' | 'all' | 'never'
}

// Configuration des items du menu militant pour utilisateurs connectés
const militantNavItemsAuthConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Home, text: 'Accueil', href: '/(tabs)' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(tabs)/evenements' },
  // { id: 'actions', iconLeft: Zap, text: 'Actions', href: '/(militant)/actions', routeName: '(militant)/actions', theme: 'blue' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', href: '/(tabs)/parrainages' },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', externalUrlSlug: '/formations', isNew: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', href: '/(tabs)/ressources' },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', href: '/(tabs)/questionnaires' },
  { id: 'profil', iconLeft: CircleUser, text: 'Profil', href: '/(tabs)/profil', displayIn: 'tabbar' },
] as const;

// Configuration des items du menu militant pour utilisateurs non connectés
const militantNavItemsPublicConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Globe, text: 'parti-renaissance.fr', externalUrlSlug: 'https://parti-renaissance.fr/' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(tabs)/evenements' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', disabled: true },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', disabled: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', disabled: true },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', disabled: true },
] as const;

export const useMilitantNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession();
  const openExternalContentHook = useOpenExternalContent({ slug: 'formation' });
  const { tags } = useGetTags({ tags: [UserTagEnum.SYMPATHISANT, UserTagEnum.ADHERENT] });
  
  const openRef = useRef(openExternalContentHook.open);
  useEffect(() => {
    openRef.current = openExternalContentHook.open;
  }, [openExternalContentHook.open]);

  return useMemo(() => {
    const baseConfig = isAuth ? militantNavItemsAuthConfig : militantNavItemsPublicConfig;
 
    const membershipStatus = tags ? getMembershipStatus(tags) : null;

    return baseConfig.map((item) => {
      // Pour l'item "formations", si le statut n'est pas "valid", utiliser la route locale
      if (item.id === 'formations' && membershipStatus !== 'valid') {
        return {
          ...item,
          href: '/(tabs)/formations',
          externalUrlSlug: undefined,
          externalLink: false,
        };
      }

      const config: NavItemConfig = {
        ...item,
        externalLink: item.externalUrlSlug ? true : false,
      };

      if (item.externalUrlSlug) {
        const externalUrl = item.externalUrlSlug;
        if (externalUrl.startsWith('http')) {
          config.onPress = () => {
            if (isWeb) {
              window.open(externalUrl, '_blank');
            } else {
              WebBrowser.openBrowserAsync(externalUrl);
            }
          };
        } else {
          config.onPress = () => {
            openRef.current({ state: externalUrl })();
          };
        }
      }

      return config;
    });
  }, [isAuth, tags]);
};

export const militantNavItems: NavItemConfig[] = []

const cadreNavItemsConfig: NavItemConfig[] = [
  { id: 'dashboard', iconLeft: Eye, text: "Vue d'ensemble", theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
  { id: 'my_team', iconLeft: Sparkle, text: 'Mon équipe cadre', theme: 'purple', externalUrlSlug: '/mon-equipe', externalLink: true },
  { id: 'publications', iconLeft: ScrollText, text: 'Mes publications', theme: 'purple', href: '/cadre/publications', },
  { id: 'messages', iconLeft: Mail, text: 'Messagerie', theme: 'purple', externalUrlSlug: '/messagerie', externalLink: true },
  { id: 'news', iconLeft: MessageSquareDot, text: 'Notifications', theme: 'purple', externalUrlSlug: '/notifications', externalLink: true },
  { id: 'department_site', iconLeft: Laptop, text: 'Site départemental', theme: 'purple', externalUrlSlug: '/site-departemental', externalLink: true },
  { id: 'mobile_app', iconLeft: TabletSmartphone, text: 'Application mobile', theme: 'purple', externalUrlSlug: '/', externalLink: true },
  { id: 'contacts', iconLeft: UsersRound, text: 'Militants', theme: 'purple', externalUrlSlug: '/militants', externalLink: true },
  { id: 'referrals', iconLeft: HeartHandshake, text: 'Suivi des parrainages', theme: 'purple', externalUrlSlug: '/parrainages', externalLink: true },
  { id: 'rentree', iconLeft: PartyPopper, text: 'Rentrée', theme: 'purple', externalUrlSlug: '/rentree', externalLink: true },
  { id: 'events', iconLeft: Calendar, text: 'Mes événements', theme: 'purple', externalUrlSlug: '/evenements', externalLink: true, displayIn: 'never' },
  { id: 'adherent_formations', iconLeft: GraduationCap, text: 'Mes formations', theme: 'purple', externalUrlSlug: '/formations', externalLink: true },
  { id: 'eaggle', iconLeft: Map, text: 'Cartographie électorale', theme: 'purple', externalUrlSlug: '/cartographie-electorale', externalLink: true },
  { id: 'survey', iconLeft: ClipboardList, text: 'Questionnaires', theme: 'purple', externalUrlSlug: '/questionnaires', externalLink: true },
  { id: 'phoning_campaign', iconLeft: PhoneOutgoing, text: 'Phoning', theme: 'purple', externalUrlSlug: '/phoning', externalLink: true },
  { id: 'pap', iconLeft: DoorOpen, text: 'Porte-à-porte', theme: 'purple', externalUrlSlug: '/porte-a-porte', externalLink: true },
  { id: 'ripostes', iconLeft: Swords, text: 'Ripostes', theme: 'purple', externalUrlSlug: '/ripostes', externalLink: true },
  { id: 'team', iconLeft: Group, text: 'Groupes', theme: 'purple', externalUrlSlug: '/groupes', externalLink: true },
  { id: 'procurations', iconLeft: Signature, text: 'Procurations', theme: 'purple', externalUrlSlug: '/procurations', externalLink: true },
  { id: 'committee', iconLeft: Network, text: 'Comités locaux', theme: 'purple', externalUrlSlug: '/comites', externalLink: true },
  { id: 'circonscriptions', iconLeft: Goal, text: 'Circonscriptions', theme: 'purple', externalUrlSlug: '/circonscriptions', externalLink: true },
  { id: 'designation', iconLeft: CopyCheck, text: 'Désignations', theme: 'purple', externalUrlSlug: '/votes-et-consultations', externalLink: true },
  { id: 'elections', iconLeft: Vote, text: 'Votes et consultations', theme: 'purple', externalUrlSlug: '/votes-et-consultations', externalLink: true },
  { id: 'statutory_message', iconLeft: MessageSquareQuote, text: 'Message statutaire', theme: 'purple', externalUrlSlug: '/mails-statutaires', externalLink: true },
  { id: 'general_meeting_reports', iconLeft: FileBadge, text: 'Procès-verbaux d’AG', theme: 'purple', externalUrlSlug: '/proces-verbal', externalLink: true },
  { id: 'documents', iconLeft: FileStack, text: 'Documents', theme: 'purple', externalUrlSlug: '/documents', externalLink: true },
  { id: 'elected_representative', iconLeft: Award, text: 'Élus', theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
  { id: 'actions', iconLeft: Zap, text: 'Actions', theme: 'purple', externalUrlSlug: '/actions', externalLink: true, displayIn: 'never' },
  { id: 'contacts_export', iconLeft: Download, text: 'Export contacts', theme: 'purple', externalUrlSlug: '/', externalLink: true, displayIn: 'never' },
] as const;

export const useCadreNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession()
  const { data } = useGetExecutiveScopes();
  const openExternalContentHook = useOpenExternalContent({ slug: 'cadre' });

  const defaultScope = data?.default;
  const defaultScopeCode = defaultScope?.code ?? '';
  const defaultScopeFeatures = defaultScope?.features ?? [];

  const defaultScopeFeaturesKey = JSON.stringify([...defaultScopeFeatures].sort());

  // Utiliser useRef pour stabiliser la référence de la fonction open
  const openRef = useRef(openExternalContentHook.open);
  useEffect(() => {
    openRef.current = openExternalContentHook.open;
  }, [openExternalContentHook.open]);

  return useMemo(() => {
    if (!isAuth) {
      return []
    }

    const hasFeatureInDefaultScope = (featureId: string) => defaultScopeFeatures.includes(featureId);

    return cadreNavItemsConfig
      .filter((item) => hasFeatureInDefaultScope(item.id))
      .map((item) => {
        const config: NavItemConfig = {
          ...item,
          hasAccess: true,
          externalLink: item.externalUrlSlug ? true : false,
        } as NavItemConfig;

        if (item.externalUrlSlug) {
          const stateUrl = `${item.externalUrlSlug}?scope=${defaultScopeCode}`;

          config.onPress = () => {
            openRef.current({ state: stateUrl })();
          };
        }

        return config;
      });
  }, [isAuth, defaultScopeCode, defaultScopeFeaturesKey]);
};

export const cadreNavItems: NavItemConfig[] = []
