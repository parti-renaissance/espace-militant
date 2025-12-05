import Menu from '@/components/menu/Menu'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { LogOut, PenLine } from '@tamagui/lucide-icons'
import { Href, Link, usePathname } from 'expo-router'
import { isWeb, useMedia, YStack } from 'tamagui'
import { pageConfigs } from '../configs'

const ProfilMenu = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { signOut } = useSession()
  const { data: profile } = useGetProfil({ enabled: true })
  const { user: credentials } = useUserStore()

  const size = media.sm ? 'lg' : 'sm'
  const showArrow = media.sm

  // Filtrer les items selon la taille d'écran et les permissions
  const visibleItems = Object.entries(pageConfigs)
    .filter(([key, config]) => {
      // Cacher "Mon profil" sur petit écran
      if (key === 'index' && !media.gtSm) return false
      // Vérifier hiddenInMenu si la propriété existe
      const hiddenInMenu = 'hiddenInMenu' in config ? config.hiddenInMenu : false
      if (typeof hiddenInMenu === 'function') {
        return !hiddenInMenu(profile)
      }
      return !hiddenInMenu
    })

  return (
    <YStack gap="$medium">
      <Menu>
        {visibleItems.map(([key, config], index) => (
          <Link key={key} asChild={!isWeb} href={config.href as Href} replace={media.gtSm}>
            <Menu.Item 
              active={config.href === pathname} 
              size={size}
              showArrow={showArrow}
              icon={config.icon}
              last={index === visibleItems.length - 1}
            >
              {config.text}
            </Menu.Item>
          </Link>
        ))}
      </Menu>

      {clientEnv.ENVIRONMENT === 'staging' && (
        <Menu>
          <Link href="/tools/storybook" asChild={!isWeb}>
            <Menu.Item theme="orange" size={size} showArrow={showArrow} icon={PenLine} last>
              StoryBook
            </Menu.Item>
          </Link>
        </Menu>
      )}

      <Menu>
        <Menu.Item theme="orange" size={size} showArrow={showArrow} onPress={signOut} icon={LogOut} last>
          {credentials?.isAdmin ? 'Quitter l‘impersonnification' : 'Me déconnecter'}
        </Menu.Item>
      </Menu>
    </YStack>
  )
}

export default ProfilMenu
