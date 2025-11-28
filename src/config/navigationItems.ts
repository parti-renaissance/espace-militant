import { ComponentProps, useMemo } from 'react'
import { Home, Calendar, Zap, HeartHandshake, GraduationCap, Link, ClipboardCheck, ScrollText, Flag, Users, Network, Goal, Vote, CircleUser } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/Navigation/NavItem'
import type { IconComponent } from '@/models/common.model'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'

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

// Configuration des items du menu militant
export const militantNavItems: NavItemConfig[] = [
  { id: 'accueil', iconLeft: Home, text: 'Accueil', href: '/dev/accueil', routeName: '(militant)/accueil', theme: 'blue' },
  { id: 'evenements', iconLeft: Calendar, text: 'Événements', href: '/dev/evenements', routeName: '(militant)/evenements', theme: 'blue' },
  { id: 'actions', iconLeft: Zap, text: 'Actions', href: '/dev/actions', routeName: '(militant)/actions', theme: 'blue' },
  { id: 'parrainages', iconLeft: HeartHandshake, text: 'Parrainages', href: '/dev/parrainages', routeName: '(militant)/parrainages', theme: 'blue' },
  { id: 'formations', iconLeft: GraduationCap, text: 'Formations', externalLink: true, disabled: true },
  { id: 'ressources', iconLeft: Link, text: 'Ressources', href: '/dev/ressources', routeName: '(militant)/ressources' },
  { id: 'questionnaires', iconLeft: ClipboardCheck, text: 'Questionnaires', isNew: true, href: '/dev/questionnaires', routeName: '(militant)/questionnaires' },
  { id: 'profil', iconLeft: CircleUser, text: 'Profil', href: '/dev/profil', routeName: '(militant)/profil', theme: 'blue', displayIn: 'tabbar' },
]

const cadreNavItemsConfig: NavItemConfig[] = [
  { id: 'publications', iconLeft: ScrollText, text: 'Mes publications', theme: 'purple', href: '/dev/cadre/publications', routeName: 'cadre/publications'  },
  { id: 'contacts', iconLeft: Flag, text: 'Mes militants', theme: 'purple', externalUrlSlug: '/militants' },
  { id: 'my_team', iconLeft: Users, text: 'Mon équipe', theme: 'purple', externalUrlSlug: '/mon-equipe' },
  { id: 'committee', iconLeft: Network, text: 'Gestion des comités', theme: 'purple', externalUrlSlug: '/comites' },
  { id: 'circonscriptions', iconLeft: Goal, text: 'Gestion des circonscriptions', theme: 'purple', externalUrlSlug: '/circonscriptions' },
  { id: 'votes', iconLeft: Vote, text: 'Votes et consultations', theme: 'purple', externalUrlSlug: '/votes-et-consultations' },
] as const;

export const useCadreNavItems = (): NavItemConfig[] => {
  const { data } = useGetExecutiveScopes();
  const defaultScope = data?.default;
  const defaultScopeCode = defaultScope?.code ?? '';
  const defaultScopeFeatures = defaultScope?.features ?? [];

  const openExternalContentHook = useOpenExternalContent({ slug: 'cadre' });

  const defaultScopeFeaturesKey = JSON.stringify(defaultScopeFeatures.sort());

  return useMemo(() => {
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
  }, [defaultScopeCode, defaultScopeFeaturesKey, openExternalContentHook]);
};

export const cadreNavItems: NavItemConfig[] = []
