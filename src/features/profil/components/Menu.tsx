import { useMemo } from 'react'
import Menu from '@/components/menu/Menu'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes, useGetProfil } from '@/services/profile/hook'
import { RestProfilResponse } from '@/services/profile/schema'
import { useUserStore } from '@/store/user-store'
import { LogOut, PenLine, Send } from '@tamagui/lucide-icons'
import { Href, Link, usePathname } from 'expo-router'
import omit from 'lodash/omit'
import { isWeb, useMedia, YStack } from 'tamagui'
import { pageConfigs } from '../configs'

const mapPageConfigs = (config: typeof pageConfigs, profile?: RestProfilResponse) =>
  Object.entries(config).map(
    ([screenName, options]) =>
      ({
        key: screenName,
        icon: options.icon,
        children: options.title,
        pathname: ('/profil' + (screenName === 'index' ? '' : '/' + screenName)) as Href,
        hidden: typeof options.hiddenInMenu === 'function' ? options.hiddenInMenu(profile) : !!options.hiddenInMenu,
      }) as const,
  )

const ProfilMenu = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { signOut } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const { data: profile } = useGetProfil({ enabled: true })
  const itemsData = useMemo(
    () => (media.gtSm ? mapPageConfigs(pageConfigs, profile) : mapPageConfigs(omit(pageConfigs, ['index']), profile)),
    [media.gtSm, profile],
  )
  const { user: credentials } = useUserStore()
  const Item = ({ item, index }: { item: (typeof itemsData)[number]; index: number }) => (
    <Link asChild={!isWeb} href={item.pathname} key={item.key} replace={media.gtSm}>
      <Menu.Item active={item.pathname === pathname} size={media.sm ? 'lg' : 'sm'} showArrow={media.sm} icon={item.icon} last={index === itemsData.length - 1}>
        {item.children}
      </Menu.Item>
    </Link>
  )
  return (
    <YStack gap="$medium" key="profil-menu">
      <Menu>
        {itemsData
          .filter(({ hidden }) => !hidden)
          .map((item, index) => (
            <Item item={item} index={index} key={item.key} />
          ))}
      </Menu>
      {clientEnv.ENVIRONMENT === 'staging' ? (
        <Menu>
          <Link href="/storybook" asChild={!isWeb}>
            <Menu.Item theme="orange" size={media.sm ? 'lg' : 'sm'} showArrow={media.sm} icon={PenLine} last={true}>
              StoryBook
            </Menu.Item>
          </Link>
        </Menu>
      ) : null}
      <Menu>
        <Menu.Item theme="orange" size={media.sm ? 'lg' : 'sm'} showArrow={media.sm} onPress={signOut} icon={LogOut} last={true}>
          {credentials?.isAdmin ? 'Quitter l’impersonnification' : 'Me déconnecter'}
        </Menu.Item>
      </Menu>
      {hasFeature('messages_vox') ? (
        <Menu>
          <Link href="/messages" asChild={!isWeb}>
            <Menu.Item theme="orange" size={media.sm ? 'lg' : 'sm'} showArrow={media.sm} icon={Send} last={true}>
              Beta: créer un message
            </Menu.Item>
          </Link>
        </Menu>
      ) : null}
    </YStack>
  )
}

export default ProfilMenu
