import { CircleUser, Sparkle, HelpingHand, LandPlot, Settings2, MessageCircle, TreeDeciduous, KeyRound } from '@tamagui/lucide-icons'
import { NavItem } from '@/components/Navigation/NavItem'
import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { usePathname } from 'expo-router'
import React from 'react'
import { View, styled, YStack } from 'tamagui'
import { isNavItemActive } from '@/components/Navigation/utils'
import { useMedia } from 'tamagui'
import Text from '@/components/base/Text'

const CenterContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
})

const RouteName = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$textPrimary',
})

export default function CommunicationsPage() {
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
                <RouteName>Communications</RouteName>
                <YStack gap={16}>
                  <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis sollicitudin nunc. Pellentesque facilisis malesuada augue ac maximus. Pellentesque faucibus elementum tellus, a hendrerit magna faucibus et. Fusce sodales aliquam posuere. Pellentesque odio sem, pellentesque ut posuere in, posuere sit amet quam. Donec congue lorem ut erat sollicitudin malesuada vitae in augue. Etiam nec quam in magna mollis suscipit. Fusce sed lorem at ex feugiat sollicitudin. Etiam scelerisque imperdiet mi, id interdum lorem. Sed aliquet a ipsum ut dignissim. Aliquam elementum, lorem vel auctor sodales, ex metus placerat massa, vel aliquet magna risus vitae turpis. Duis a dolor ac odio sagittis aliquam.</Text.MD>
                  <Text.MD>Nunc ornare quam eu felis venenatis, ac scelerisque dolor consectetur. Aenean viverra tortor ac euismod scelerisque. Aenean molestie libero quis dolor aliquam, fringilla condimentum sapien porttitor. Integer placerat non augue quis congue. Pellentesque at enim vitae massa ultrices placerat. Vestibulum lobortis at odio at blandit. Aliquam ultrices elit a felis tristique dapibus. Ut in tempor justo.</Text.MD>
                  <Text.MD>Suspendisse a euismod elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam nunc metus, elementum id ex quis, ultricies congue velit. Vivamus eu semper nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex libero, ac rhoncus libero ullamcorper sit amet. Phasellus ex velit, sagittis eu pharetra non, porta in odio. Donec aliquet tempor augue, eget condimentum lectus scelerisque eu. Etiam cursus ipsum dui, vel laoreet nibh varius tincidunt. Cras scelerisque odio non posuere euismod. Aliquam consectetur blandit ligula sit amet scelerisque. Fusce venenatis consequat lorem non egestas.</Text.MD>
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

