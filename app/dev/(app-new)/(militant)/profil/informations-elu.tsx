import { CircleUser, Sparkle, HelpingHand, LandPlot, Settings2, MessageCircle, TreeDeciduous, KeyRound } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/Navigation/NavItem'
import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { usePathname } from 'expo-router'
import React from 'react'
import { View, Text, styled, YStack } from 'tamagui'
import { isNavItemActive } from '@/components/Navigation/utils'
import { useMedia } from 'tamagui'

const CenterContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
})

const RouteName = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$textPrimary',
})

export default function InformationsEluPage() {
  useHideTabBar()
  const pathname = usePathname()
  const media = useMedia()

  const navItems = [
    {
      id: 'index',
      href: '/dev/profil' as const,
      text: 'Mon profil',
      iconLeft: CircleUser,
      active: pathname === '/dev/profil' || pathname === '/dev/profil/',
    },
    {
      id: 'acces-cadre',
      href: '/dev/profil/acces-cadre' as const,
      text: 'Accès cadre',
      iconLeft: Sparkle,
      active: isNavItemActive(pathname, '/dev/profil/acces-cadre'),
    },
    {
      id: 'cotisations-et-dons',
      href: '/dev/profil/cotisations-et-dons' as const,
      text: 'Cotisations et dons',
      iconLeft: HelpingHand,
      active: isNavItemActive(pathname, '/dev/profil/cotisations-et-dons'),
    },
    {
      id: 'mes-instances',
      href: '/dev/profil/mes-instances' as const,
      text: 'Mes instances',
      iconLeft: LandPlot,
      active: isNavItemActive(pathname, '/dev/profil/mes-instances'),
    },
    {
      id: 'informations-personnelles',
      href: '/dev/profil/informations-personnelles' as const,
      text: 'Informations personnelles',
      iconLeft: Settings2,
      active: isNavItemActive(pathname, '/dev/profil/informations-personnelles'),
    },
    {
      id: 'communications',
      href: '/dev/profil/communications' as const,
      text: 'Communications',
      iconLeft: MessageCircle,
      active: isNavItemActive(pathname, '/dev/profil/communications'),
    },
    {
      id: 'informations-elu',
      href: '/dev/profil/informations-elu' as const,
      text: 'Informations élu',
      iconLeft: TreeDeciduous,
      active: isNavItemActive(pathname, '/dev/profil/informations-elu'),
    },
    {
      id: 'mot-de-passe',
      href: '/dev/profil/mot-de-passe' as const,
      text: 'Mot de passe',
      iconLeft: KeyRound,
      active: isNavItemActive(pathname, '/dev/profil/mot-de-passe'),
    },
  ]

  return (
    <Layout.ScrollView safeArea>
      <Layout.Container>
        <Layout.Main>
          <VoxCard borderRadius={16}>
            <VoxCard.Content>
              <CenterContainer gap={16}>
                <RouteName>Informations élu</RouteName>
                <YStack gap={16}>
                </YStack>
              </CenterContainer>
            </VoxCard.Content>
          </VoxCard>
        </Layout.Main>
        {media.gtSm && (
          <Layout.SideBar maxWidth={280} isSticky>
            <VoxCard borderRadius={16}>
              <VoxCard.Content>
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    text={item.text}
                    iconLeft={item.iconLeft}
                    href={item.href}
                    active={item.active}
                  />
                ))}
              </VoxCard.Content>
            </VoxCard>
          </Layout.SideBar>
        )}
      </Layout.Container>
    </Layout.ScrollView>
  )
}

