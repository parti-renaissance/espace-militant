import { useState } from 'react'
import { usePathname } from 'expo-router'
import { useMedia, XStack } from 'tamagui'
import { Bot, DoorOpen, Globe, GraduationCap, LogOut, PenLine, QrCode, Wrench, X, Zap } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { NavItem } from '@/components/AppStructure/Navigation/NavItem'
import { isNavItemActive } from '@/components/AppStructure/utils'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { SkeCard } from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'

import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'

import { pageConfigs } from '../configs'

function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const media = useMedia()
  const { signOut } = useSession()
  const { user: credentials } = useUserStore()
  const { data: profile } = useGetProfil({ enabled: true })
  const [devMode, setDevMode] = useState(false)

  const visibleItems = Object.entries(pageConfigs).filter(([key, config]) => {
    if (key === 'index' && !media.gtSm) return false
    const hiddenInMenu = 'hiddenInMenu' in config ? config.hiddenInMenu : false
    if (typeof hiddenInMenu === 'function') {
      return !hiddenInMenu(profile)
    }
    return !hiddenInMenu
  })

  const SkeletonCard = () => (
    <LayoutScrollView style={{ flexGrow: 1 }}>
      <SkeCard flex={1}>
        <SkeCard.Content>
          <SkeCard.Title />
          <SkeCard.Image />
          <SkeCard.Description />
        </SkeCard.Content>
      </SkeCard>
    </LayoutScrollView>
  )

  return (
    <>
      <Layout.Main style={{ width: '100%' }}>
        <BoundarySuspenseWrapper fallback={<SkeletonCard />}>{children}</BoundarySuspenseWrapper>
      </Layout.Main>
      {media.gtMd ? (
        <Layout.SideBar isSticky gap="$medium">
          <VoxCard borderRadius={16}>
            <VoxCard.Content padding="$small" gap={4}>
              {visibleItems.map(([key, config]) => (
                <NavItem
                  key={config.id}
                  text={config.text}
                  iconLeft={config.iconLeft}
                  // @ts-expect-error - href type mismatch due to config type definition
                  href={config.href}
                  active={config.id === 'index' ? pathname === '/profil' : isNavItemActive(pathname, config.href as string)}
                />
              ))}
            </VoxCard.Content>
          </VoxCard>

          {clientEnv.ENVIRONMENT === 'staging' && !devMode && (
            <VoxCard borderRadius={16}>
              <VoxCard.Content padding="$small" gap={4}>
                <NavItem text="Mode développeur" iconLeft={Wrench} onPress={() => setDevMode(true)} />
              </VoxCard.Content>
            </VoxCard>
          )}

          {clientEnv.ENVIRONMENT === 'staging' && devMode && (
            <VoxCard borderRadius={16}>
              <VoxCard.Content padding="$small" gap={4}>
                <XStack
                  onPress={() => setDevMode(false)}
                  alignItems="center"
                  gap="$small"
                  justifyContent="space-between"
                  px="$small"
                  pt="$small"
                  cursor="pointer"
                >
                  <Text.SM semibold secondary>
                    Outils de développement
                  </Text.SM>
                  <X size={16} color="$textDisabled" />
                </XStack>
                <NavItem text="Chatbot" iconLeft={Bot} href="/chatbot" />
                <NavItem text="Webview" iconLeft={Globe} href="/webview" />
                <NavItem text="StoryBook" iconLeft={PenLine} href="/tools/storybook" />
                <Text.SM semibold secondary mx="$small" mt="$medium">
                  Anciens outils
                </Text.SM>
                <NavItem text="Actions" iconLeft={Zap} href="/old/actions" />
                <NavItem text="Scanner" iconLeft={QrCode} href="/scanner" />
                <NavItem text="Porte à porte" iconLeft={DoorOpen} href="/old/porte-a-porte" />
                <NavItem text="Formations" iconLeft={GraduationCap} href="/old/formations" />
              </VoxCard.Content>
            </VoxCard>
          )}

          <VoxCard borderRadius={16}>
            <VoxCard.Content padding="$small" gap={4}>
              <NavItem
                text={credentials?.isAdmin ? 'Quitter l‘impersonnification' : 'Me déconnecter'}
                iconLeft={LogOut}
                onPress={() => {
                  signOut()
                }}
              />
            </VoxCard.Content>
          </VoxCard>
        </Layout.SideBar>
      ) : null}
    </>
  )
}

export default ProfilLayout
