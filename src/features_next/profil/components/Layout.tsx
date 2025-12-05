import { LogOut } from "@tamagui/lucide-icons"
import { isNavItemActive } from "@/components/AppStructure/utils"
import { Href, usePathname } from "expo-router"
import { useMedia } from "tamagui"
import Layout from "@/components/AppStructure/Layout/Layout"
import VoxCard from "@/components/VoxCard/VoxCard"
import { NavItem } from "@/components/AppStructure/Navigation/NavItem"
import { useSession } from "@/ctx/SessionProvider"
import { pageConfigs } from "../configs"
import { useUserStore } from "@/store/user-store"

function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const media = useMedia()
  const { signOut } = useSession()
  const { user: credentials } = useUserStore()

  return (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>
      {media.gtMd ? (
        <Layout.SideBar isSticky gap="$medium">
          <VoxCard borderRadius={16}>
            <VoxCard.Content padding="$small" gap={4}>
              {Object.values(pageConfigs).map((config) => (
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