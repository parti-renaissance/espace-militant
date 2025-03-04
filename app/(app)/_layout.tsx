import React from 'react'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { VoxButton } from '@/components/Button'
import { NavBar, ProfileNav, VoxHeader } from '@/components/Header/Header'
import { PortalLayout } from '@/components/layouts/PortalLayout'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Link, Stack } from 'expo-router'
import { isWeb, useMedia, View, XStack } from 'tamagui'

export default function AppLayout() {
  const media = useMedia()
  return (
    <PortalLayout>
      {media.gtSm ? (
        <VoxHeader justifyContent="space-between" display="none" $gtSm={{ display: 'flex' }} safeAreaView={true}>
          <XStack flex={1} flexBasis={0}>
            <Link href="/" replace>
              <EuCampaignIllustration cursor="pointer" showText={media.gtLg} />
            </Link>
          </XStack>
          <NavBar />
          <ProfileNav flex={1} flexBasis={0} justifyContent="flex-end" />
        </VoxHeader>
      ) : null}

      <View style={{ height: isWeb ? 'calc(100vh - 100px)' : '100%', flex: 1 }} backgroundColor="white">
        <Stack screenOptions={{ animation: 'slide_from_right', fullScreenGestureEnabled: true }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: '',
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="profil"
            options={{
              headerShown: false,
              animation: media.sm ? 'slide_from_right' : 'none',
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="evenements/[id]/index"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => {
                return media.sm ? (
                  <VoxHeader backgroundColor="transparent" borderWidth={0}>
                    <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
                      <VoxButton iconLeft={ArrowLeft} shrink size="lg" mt={24} />
                    </Link>
                  </VoxHeader>
                ) : null
              },
            }}
          />

          <Stack.Screen
            name="evenements/[id]/modifier"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="evenements/creer"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="messages/creer"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="porte-a-porte/building-detail" options={{ title: '' }} />
          <Stack.Screen name="porte-a-porte/tunnel" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        </Stack>
      </View>
    </PortalLayout>
  )
}
