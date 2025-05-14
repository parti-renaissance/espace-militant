import { Slot, Stack } from 'expo-router'
import { useMedia, View, XStack } from 'tamagui'

import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import ProfilMenu from '@/features/profil/components/Menu'
import PageHeader from '@/features/profil/components/PageHeader'
import { pageConfigs } from '../configs'


export default function DesktopProfilRouter() {
  const media = useMedia()

  const configArray = Object.entries(pageConfigs)

  return (
    <PageLayout webScrollable>
      {!media.sm && (
        <PageLayout.SideBarLeft showOn="gtSm">
          <StickyBox offsetTop="$medium" offsetBottom="$xxxlarge">
            <XStack justifyContent="flex-end">
              <ProfilMenu />
            </XStack>
          </StickyBox>
        </PageLayout.SideBarLeft>
      )}
      <PageLayout.MainSingleColumn>
        { !media.sm ? (
          <Slot/>
        ) : (
          <View style={{flex: 1, backgroundColor: '#F0F'}}>
            <Stack screenOptions={{ animation: 'slide_from_right' }}>
              {configArray.map(([screenName, config]) => (
                <Stack.Screen
                  key={screenName}
                  name={screenName}
                  options={{
                    header: () => (
                      <PageHeader
                          {...config}
                          backArrow={
                            screenName !== 'index'
                          }
                        />
                    )
                  }}
                />
              ))}
            </Stack>
          </View>
        )}
      </PageLayout.MainSingleColumn>
      <PageLayout.SideBarRight />
    </PageLayout>
  )
}
