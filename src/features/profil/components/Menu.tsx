import { useMemo } from 'react'
import Menu from '@/components/menu/Menu'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useUserStore } from '@/store/user-store'
import { LogOut, PenLine } from '@tamagui/lucide-icons'
import { Href, Link, usePathname } from 'expo-router'
import omit from 'lodash/omit'
import { isWeb, useMedia, YStack } from 'tamagui'
import { pageConfigs } from '../configs'

const mapPageConfigs = (config: typeof pageConfigs) =>
  Object.entries(config).map(
    ([screenName, options]) =>
      ({
        key: screenName,
        icon: options.icon,
        children: options.title,
        pathname: ('/profil' + (screenName === 'index' ? '' : '/' + screenName)) as Href,
      }) as const,
  )

export const dektopNavConfig = mapPageConfigs(pageConfigs)
export const mobileNavConfig = mapPageConfigs(omit(pageConfigs, ['index']))

const ProfilMenu = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { signOut, user } = useSession()
  const itemsData = useMemo(
    () =>
      (media.gtSm ? dektopNavConfig : mobileNavConfig).filter((x) => {
        return x.key !== 'acces-cadre' || user.data?.cadre_access
      }),
    [media.gtSm, user.data?.cadre_access],
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
        {itemsData.map((item, index) => (
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
    </YStack>
  )
}

export default ProfilMenu
