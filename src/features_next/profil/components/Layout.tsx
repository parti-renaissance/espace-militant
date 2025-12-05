import { LogOut, PenLine, QrCode, DoorOpen, GraduationCap, Zap } from "@tamagui/lucide-icons"
import { isNavItemActive } from "@/components/AppStructure/utils"
import { Href, usePathname } from "expo-router"
import { useMedia } from "tamagui"
import Layout from "@/components/AppStructure/Layout/Layout"
import VoxCard from "@/components/VoxCard/VoxCard"
import { NavItem } from "@/components/AppStructure/Navigation/NavItem"
import { useSession } from "@/ctx/SessionProvider"
import { pageConfigs } from "../configs"
import { useUserStore } from "@/store/user-store"
import BoundarySuspenseWrapper from "@/components/BoundarySuspenseWrapper"
import { SkeCard } from "@/components/Skeleton/CardSkeleton"
import LayoutScrollView from "@/components/AppStructure/Layout/LayoutScrollView"
import { useGetProfil } from "@/services/profile/hook"
import clientEnv from "@/config/clientEnv"
import Text from "@/components/base/Text"

function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const media = useMedia()
  const { signOut } = useSession()
  const { user: credentials } = useUserStore()
  const { data: profile } = useGetProfil({ enabled: true })

  console.log('ProfilLayout', pathname)

  const visibleItems = Object.entries(pageConfigs)
    .filter(([key, config]) => {
      if (key === 'index' && !media.gtSm) return false
      const hiddenInMenu = 'hiddenInMenu' in config ? config.hiddenInMenu : false
      if (typeof hiddenInMenu === 'function') {
        return !hiddenInMenu(profile)
      }
      return !hiddenInMenu
    })

  const SkeletonCard = () => (
    <LayoutScrollView>
      <SkeCard>
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
      <Layout.Main>
        <BoundarySuspenseWrapper fallback={<SkeletonCard />}>
          {children}
        </BoundarySuspenseWrapper>
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
                  active={config.id === 'index'
                    ? pathname === '/profil'
                    : isNavItemActive(pathname, config.href as string)}
                />
              ))}
            </VoxCard.Content>
          </VoxCard>

          {clientEnv.ENVIRONMENT === 'staging' && (
            <VoxCard borderRadius={16}>
              <VoxCard.Content padding="$small" gap={4}>
                <Text.SM semibold secondary mx="$small" mt="$small">Outils de développement</Text.SM>
                <NavItem
                  text="StoryBook"
                  iconLeft={PenLine}
                  href="/tools/storybook"
                />
                <Text.SM semibold secondary mx="$small" mt="$medium">Anciens outils</Text.SM>
                <NavItem
                  text="Actions"
                  iconLeft={Zap}
                  href="/old/actions"
                />
                <NavItem
                  text="Scanner"
                  iconLeft={QrCode}
                  href="/old/scanner"
                />
                <NavItem
                  text="Porte à porte"
                  iconLeft={DoorOpen}
                  href="/old/porte-a-porte"
                />
                <NavItem
                  text="Formations"
                  iconLeft={GraduationCap}
                  href="/old/formations"
                />
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