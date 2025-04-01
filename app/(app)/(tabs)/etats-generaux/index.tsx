import React from 'react'
import * as metatags from '@/config/metatags'
import GeneralConventionScreen from '@/screens/generalConventions/page'
import { ImageBackground } from 'expo-image'
import Head from 'expo-router/head'
import { useMedia, View, YStack } from 'tamagui'

const Page: React.FC = () => {
  const media = useMedia()
  const topVisual = media.sm ? 270 : 500

  return (
    <>
      <Head>
        <title>{metatags.createTitle('États généraux')}</title>
      </Head>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('@/assets/images/bg-general-conventions.webp')}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ height: 435 }}
        >
          <YStack flex={1}>
            <GeneralConventionScreen topVisual={topVisual} />
          </YStack>
        </ImageBackground>
      </View>
    </>
  )
}

export default Page
