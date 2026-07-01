import { Href, Link, usePathname } from 'expo-router'
import { isWeb, useMedia, YStack } from 'tamagui'
import { Bot, Globe, LogOut, PenLine, Video } from '@tamagui/lucide-icons'

import Menu from '@/components/menu/Menu'

import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil, useProfileCompletion } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'

import { pageConfigs, type ProfilNavItemConfig } from '../configs'
import { useCompleteProfil } from '../context/CompleteProfilContext'

const ROUTES_REQUIRING_COMPLETE_PROFILE: ProfilNavItemConfig['id'][] = [
  'mes-instances',
  'cotisations-et-dons',
  'informations-personnelles',
  'informations-elu',
]

const ProfilMenu = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { signOut } = useSession()
  const { data: profile } = useGetProfil({ enabled: true })
  const { user: credentials } = useUserStore()
  const { openCompleteProfil } = useCompleteProfil()
  const { isComplete, isLoading: isProfileCompletionLoading } = useProfileCompletion()

  const size = media.sm ? 'lg' : 'sm'
  const showArrow = media.sm

  // Filtrer les items selon la taille d'écran et les permissions
  const visibleItems = Object.entries(pageConfigs).filter(([key, config]) => {
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
        {visibleItems.map(([key, config], index) => {
          const requiresCompleteProfile = ROUTES_REQUIRING_COMPLETE_PROFILE.includes(config.id)
          const shouldOpenCompleteProfilModal = requiresCompleteProfile && !isProfileCompletionLoading && !isComplete

          if (shouldOpenCompleteProfilModal) {
            return (
              <Menu.Item
                key={key}
                active={config.href === pathname}
                size={size}
                showArrow={showArrow}
                icon={config.icon}
                last={index === visibleItems.length - 1}
                onPress={() => openCompleteProfil({ redirectTo: config.href as Href })}
              >
                {config.text}
              </Menu.Item>
            )
          }

          return (
            <Link key={key} asChild={!isWeb} href={config.href as Href} replace={media.gtSm}>
              <Menu.Item active={config.href === pathname} size={size} showArrow={showArrow} icon={config.icon} last={index === visibleItems.length - 1}>
                {config.text}
              </Menu.Item>
            </Link>
          )
        })}
      </Menu>

      {clientEnv.ENVIRONMENT === 'staging' && (
        <Menu>
          <Link href="/chatbot" asChild={!isWeb}>
            <Menu.Item theme="orange" size={size} showArrow={showArrow} icon={Bot}>
              Chatbot
            </Menu.Item>
          </Link>
          <Link href="/tools/storybook" asChild={!isWeb}>
            <Menu.Item theme="orange" size={size} showArrow={showArrow} icon={PenLine}>
              StoryBook
            </Menu.Item>
          </Link>
          <Link href="/tools/video" asChild={!isWeb}>
            <Menu.Item theme="orange" size={size} showArrow={showArrow} icon={Video}>
              Vidéo (API)
            </Menu.Item>
          </Link>
          <Link href="/webview" asChild={!isWeb}>
            <Menu.Item theme="orange" size={size} showArrow={showArrow} icon={Globe}>
              Webview
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
