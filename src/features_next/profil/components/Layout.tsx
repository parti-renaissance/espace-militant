import { CircleUser, Sparkle, HelpingHand, LandPlot, Settings2, MessageCircle, TreeDeciduous, KeyRound, LogOut } from "@tamagui/lucide-icons"
import { isNavItemActive } from "@/components/AppStructure/utils"
import { usePathname } from "expo-router"
import { useMedia } from "tamagui"
import Layout from "@/components/AppStructure/Layout/Layout"
import VoxCard from "@/components/VoxCard/VoxCard"
import { NavItem } from "@/components/AppStructure/Navigation/NavItem"
import { useSession } from "@/ctx/SessionProvider"

function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const media = useMedia()
  const { signOut } = useSession()

  const navItems = [
    {
      id: 'index',
      href: '/(militant)/profil' as const,
      text: 'Mon profil',
      iconLeft: CircleUser,
      active: pathname === '/profil'
    },
    {
      id: 'acces-cadre',
      href: '/(militant)/profil/acces-cadre' as const,
      text: 'Accès cadre',
      iconLeft: Sparkle,
      active: isNavItemActive(pathname, '/(militant)/profil/acces-cadre'),
    },
    {
      id: 'cotisations-et-dons',
      href: '/(militant)/profil/cotisations-et-dons' as const,
      text: 'Cotisations et dons',
      iconLeft: HelpingHand,
      active: isNavItemActive(pathname, '/(militant)/profil/cotisations-et-dons'),
    },
    {
      id: 'mes-instances',
      href: '/(militant)/profil/mes-instances' as const,
      text: 'Mes instances',
      iconLeft: LandPlot,
      active: isNavItemActive(pathname, '/(militant)/profil/mes-instances'),
    },
    {
      id: 'informations-personnelles',
      href: '/(militant)/profil/informations-personnelles' as const,
      text: 'Informations personnelles',
      iconLeft: Settings2,
      active: isNavItemActive(pathname, '/(militant)/profil/informations-personnelles'),
    },
    {
      id: 'communications',
      href: '/(militant)/profil/communications' as const,
      text: 'Communications',
      iconLeft: MessageCircle,
      active: isNavItemActive(pathname, '/(militant)/profil/communications'),
    },
    {
      id: 'informations-elu',
      href: '/(militant)/profil/informations-elu' as const,
      text: 'Informations élu',
      iconLeft: TreeDeciduous,
      active: isNavItemActive(pathname, '/(militant)/profil/informations-elu'),
    },
    {
      id: 'mot-de-passe',
      href: '/(militant)/profil/mot-de-passe' as const,
      text: 'Mot de passe',
      iconLeft: KeyRound,
      active: isNavItemActive(pathname, '/(militant)/profil/mot-de-passe'),
    },
  ]

  return (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>
      {media.gtMd ? (
        <Layout.SideBar isSticky gap="$medium">
          <VoxCard borderRadius={16}>
            <VoxCard.Content padding="$small" gap={4}>
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
          <VoxCard borderRadius={16}>
            <VoxCard.Content padding="$small" gap={4}>
              <NavItem
                text="Déconnexion"
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