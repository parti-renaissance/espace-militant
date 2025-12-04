import { ComponentProps, useMemo } from 'react'
import { Home, Calendar, Zap, HeartHandshake, GraduationCap, Link, ClipboardCheck, ScrollText, Flag, Users, Network, Goal, Vote, CircleUser, Globe } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/AppStructure/Navigation/NavItem'
import type { IconComponent } from '@/models/common.model'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useSession } from '@/ctx/SessionProvider'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

export type NavItemConfig = {
  id: string
  iconLeft: IconComponent
  text: string
  href?: ComponentProps<typeof NavItem>['href']
  routeName?: string
  isNew?: boolean
  externalLink?: boolean
  externalUrlSlug?: string
  disabled?: boolean
  active?: boolean
  hasAccess?: boolean
  onPress?: () => void
  theme?: 'blue' | 'purple' | 'green' | 'orange'
  frame?: 'default' | 'cadre'
  displayIn?: 'sidebar' | 'tabbar' | 'all'
}

// Configuration des items du menu militant pour utilisateurs connectés
const militantNavItemsAuthConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Home, text: 'Accueil', href: '/(militant)', routeName: '(militant)/index' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(militant)/evenements', routeName: '(militant)/evenements' },
  // { id: 'actions', iconLeft: Zap, text: 'Actions', href: '/(militant)/actions', routeName: '(militant)/actions', theme: 'blue' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', href: '/(militant)/parrainages', routeName: '(militant)/parrainages' },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', externalUrlSlug: '/formations' },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', href: '/(militant)/ressources', routeName: '(militant)/ressources' },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', href: '/(militant)/questionnaires', routeName: '(militant)/questionnaires' },
  { id: 'profil', iconLeft: CircleUser, text: 'Profil', href: '/(militant)/profil', routeName: '(militant)/profil', displayIn: 'tabbar' },
] as const;

// Configuration des items du menu militant pour utilisateurs non connectés
const militantNavItemsPublicConfig: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Globe, text: 'parti-renaissance.fr', externalUrlSlug: 'https://parti-renaissance.fr/' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/(militant)/evenements', routeName: '(militant)/evenements' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', disabled: true },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', disabled: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', disabled: true },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', disabled: true },
] as const;

export const useMilitantNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession();
  const openExternalContentHook = useOpenExternalContent({ slug: 'formation' });

  return useMemo(() => {
    // Choisir la bonne configuration selon l'état d'authentification
    const baseConfig = isAuth ? militantNavItemsAuthConfig : militantNavItemsPublicConfig;

    // Ajouter les onPress pour les liens externes
    return baseConfig.map((item) => {
      const config: NavItemConfig = {
        ...item,
        externalLink: item.externalUrlSlug ? true : false,
      };

      if (item.externalUrlSlug) {
        const externalUrl = item.externalUrlSlug;
        // Si c'est une URL complète (commence par http), on ouvre directement
        if (externalUrl.startsWith('http')) {
          config.onPress = () => {
            if (isWeb) {
              window.open(externalUrl, '_blank');
            } else {
              WebBrowser.openBrowserAsync(externalUrl);
            }
          };
        } else {
          // Sinon, on utilise le hook pour les slugs internes
          config.onPress = () => {
            openExternalContentHook.open({ state: externalUrl })();
          };
        }
      }

      return config;
    });
  }, [openExternalContentHook, isAuth]);
};

export const militantNavItems: NavItemConfig[] = []

const cadreNavItemsConfig: NavItemConfig[] = [
  { id: 'publications', iconLeft: ScrollText, text: 'Mes publications', theme: 'purple', href: '/cadre/publications', routeName: 'cadre/publications'  },
  { id: 'contacts', iconLeft: Flag, text: 'Mes militants', theme: 'purple', externalUrlSlug: '/militants' },
  { id: 'my_team', iconLeft: Users, text: 'Mon équipe', theme: 'purple', externalUrlSlug: '/mon-equipe' },
  { id: 'committee', iconLeft: Network, text: 'Gestion des comités', theme: 'purple', externalUrlSlug: '/comites' },
  { id: 'circonscriptions', iconLeft: Goal, text: 'Gestion des circonscriptions', theme: 'purple', externalUrlSlug: '/circonscriptions' },
  { id: 'votes', iconLeft: Vote, text: 'Votes et consultations', theme: 'purple', externalUrlSlug: '/votes-et-consultations' },
] as const;

export const useCadreNavItems = (): NavItemConfig[] => {
  const { isAuth } = useSession()
  const { data } = useGetExecutiveScopes();
  const openExternalContentHook = useOpenExternalContent({ slug: 'cadre' });

  const defaultScope = data?.default;
  const defaultScopeCode = defaultScope?.code ?? '';
  const defaultScopeFeatures = defaultScope?.features ?? [];

  const defaultScopeFeaturesKey = JSON.stringify([...defaultScopeFeatures].sort());

  return useMemo(() => {
    if (!isAuth) {
      return []
    }

    const hasFeatureInDefaultScope = (featureId: string) => defaultScopeFeatures.includes(featureId);

    return cadreNavItemsConfig.map((item) => {
      const hasAccess = hasFeatureInDefaultScope(item.id);
      
      const config: NavItemConfig = {
        ...item,
        disabled: !hasAccess,
        hasAccess: hasAccess,
        externalLink: item.externalUrlSlug ? true : false,
      } as NavItemConfig;

      if (hasAccess && item.externalUrlSlug) {
        const stateUrl = `${item.externalUrlSlug}?scope=${defaultScopeCode}`;
        
        config.onPress = () => {
          openExternalContentHook.open({ state: stateUrl })();
        };
      }

      return config;
    });
  }, [isAuth, defaultScopeCode, defaultScopeFeaturesKey, openExternalContentHook]);
};

export const cadreNavItems: NavItemConfig[] = []
