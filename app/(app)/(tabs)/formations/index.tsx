import React from 'react'
import { StyleSheet } from 'react-native'
import * as metatags from '@/config/metatags'
import FormationScreen from '@/screens/formations/page'
import { ImageBackground } from 'expo-image'
import Head from 'expo-router/head'
import { useMedia, YStack } from 'tamagui'

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
})

const ToolsScreen: React.FC = () => {
  const media = useMedia()
  const topVisual = media.sm ? 270 : 317

  return (
    <YStack flex={1} bg={media.sm ? 'white' : '$textSurface'}>
      <Head>
        <title>{metatags.createTitle('Formations')}</title>
      </Head>
      <YStack height={topVisual} overflow="hidden">
        <ImageBackground source={require('@/assets/images/bg-formation.png')} contentFit="cover" style={[styles.image, { height: topVisual }]} />
      </YStack>
      <FormationScreen topVisual={topVisual} />
    </YStack>
  )
}

export default ToolsScreen
