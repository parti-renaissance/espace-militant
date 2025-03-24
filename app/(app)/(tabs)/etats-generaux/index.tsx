import React from 'react'
import { StyleSheet } from 'react-native'
import * as metatags from '@/config/metatags'
import GeneralConventionScreen from '@/screens/generalConventions/page'
import { ImageBackground } from 'expo-image'
import Head from 'expo-router/head'
import { ScrollView, useMedia, YStack } from 'tamagui'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 500,
  },
})

const Page: React.FC = () => {
  const media = useMedia()
  const topVisual = media.sm ? 270 : 500

  return (
    <YStack flex={1} bg={'$textSurface'}>
      <Head>
        <title>{metatags.createTitle('États généraux')}</title>
      </Head>
      <ScrollView style={styles.container} flex={1}>
        <ImageBackground source={require('@/assets/images/bg-general-conventions.webp')} contentFit="cover" style={styles.imageBackground}>
          <GeneralConventionScreen topVisual={topVisual} />
        </ImageBackground>
      </ScrollView>
    </YStack>
  )
}

export default Page
