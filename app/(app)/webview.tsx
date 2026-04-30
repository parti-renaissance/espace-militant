import React from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import { WebView as NativeWebView } from 'react-native-webview'
import Head from 'expo-router/head'
import { isWeb, useMedia } from 'tamagui'

import { Header, useLayoutSpacing } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import VoxCard from '@/components/VoxCard/VoxCard'

import * as metatags from '@/config/metatags'

const TARGET_URL = 'https://nouvellerepublique.fr/'

export default function WebviewScreen() {
  const media = useMedia()
  const spacingValues = useLayoutSpacing()

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Webview')}</title>
      </Head>
      {media.sm ? <Header title="Nouvelle République" /> : null}

      <Layout.Container hideTabBar>
        <Layout.Main maxWidth="auto" height="100%" pt={media.gtSm ? spacingValues.paddingTop : 0} pb={media.gtSm ? spacingValues.paddingBottom : 0}>
          {isWeb ? (
            <VoxCard height="100%" width="100%" overflow="hidden">
              <View style={styles.webContainer}>
                <iframe src={TARGET_URL} style={styles.iframe as React.CSSProperties} title="Webview" />
              </View>
            </VoxCard>
          ) : (
            <View style={styles.container}>
              <NativeWebView source={{ uri: TARGET_URL }} style={styles.webview} onError={() => Linking.openURL(TARGET_URL)} />
            </View>
          )}
        </Layout.Main>
      </Layout.Container>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
  },
  webview: {
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    flex: 1,
  },
})
