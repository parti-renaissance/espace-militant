import React from 'react'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { ProfileNav, VoxHeader } from '@/components/Header/Header'
import TabBar from '@/components/TabBar/TabBar'
import { ROUTES } from '@/config/routes'
import { useSession } from '@/ctx/SessionProvider'
import PageHeader from '@/features/profil/components/PageHeader'
import { Link2, Send } from '@tamagui/lucide-icons'
import { Link, Slot, Tabs } from 'expo-router'
import { isWeb, useMedia, View, XStack } from 'tamagui'

const HomeHeader = () => {
  return (
    <VoxHeader justifyContent="space-between" backgroundColor="$textSurface" borderWidth={0}>
      <XStack flex={1} flexBasis={0}>
        <Link href="/" replace>
          <EuCampaignIllustration cursor="pointer" />
        </Link>
      </XStack>
      <ProfileNav flex={1} flexBasis={0} justifyContent="flex-end" />
    </VoxHeader>
  )
}

const exectParams = (x: string, canShowHeader: boolean) => {
  switch (x) {
    case '(home)':
      return {
        header: () => <HomeHeader />,
        headerShown: canShowHeader,
      }
    case 'profil':
      return {
        headerShown: false,
      }
    case 'ressources':
      return {
        header: () => <PageHeader title="Ressources" icon={Link2} backArrow={false} />,
        headerShown: canShowHeader,
      }
    case 'messages':
      return {
        header: () => <PageHeader title="Messages" icon={Send} backArrow={true} />,
        headerShown: canShowHeader,
      }
    default:
      return {
        headerShown: false,
      }
  }
}

export default function AppLayout() {
  const media = useMedia()
  const { isAuth } = useSession()

  return (
    <View style={{ height: isWeb ? '100svh' : '100%' }} position="relative">
      {!isAuth ? (
        <Slot />
      ) : (
        <Tabs tabBar={(props) => <TabBar {...props} hide={media.gtSm} />} screenOptions={{}}>
          {ROUTES.map((route) => (
            <Tabs.Screen
              key={route.name}
              name={route.name}
              options={{
                title: route.screenName,
                // @ts-expect-error custom property
                tabBarVisible: !route.hiddenMobile,
                tabBarTheme: route.theme,
                tabBarActiveTintColor: '$color5',
                tabBarInactiveTintColor: '$textPrimary',
                // remove focused from props to avoid warning on Icon component
                tabBarIcon: ({ focused, ...props }) => <route.icon {...props} />,
                tabBarLabel: route.screenName,
                ...exectParams(route.name, media.sm),
              }}
            />
          ))}
        </Tabs>
      )}
    </View>
  )
}
