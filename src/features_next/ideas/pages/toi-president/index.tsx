import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { WebView as NativeWebView } from 'react-native-webview'
import { isWeb, useMedia } from 'tamagui'

import { useLayoutSpacing } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useGetProfil } from '@/services/profile/hook'

import { getToiPresidentEmbedUrl } from './config'
import { useToiPresidentMessages } from './hooks/useToiPresidentMessages'

export default function ToiPresidentGameScreen() {
  const media = useMedia()
  const spacingValues = useLayoutSpacing()
  const { data: profile } = useGetProfil()
  const { onWebViewMessage } = useToiPresidentMessages()

  const uri = getToiPresidentEmbedUrl(profile?.uuid)

  if (!uri) return null

  return (
    <Layout.Main maxWidth="auto" height="100%" pt={media.gtSm ? spacingValues.paddingTop : 0} pb={media.gtSm ? spacingValues.paddingBottom : 0}>
      {isWeb ? (
        <VoxCard height="100%" width="100%" overflow="hidden">
          <View style={styles.webContainer}>
            <iframe src={uri} style={styles.iframe as React.CSSProperties} title="Toi président" allow="web-share; clipboard-write" />
          </View>
        </VoxCard>
      ) : (
        <View style={styles.container}>
          <NativeWebView
            source={{ uri }}
            style={styles.webview}
            onMessage={onWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            originWhitelist={['*']}
            onError={() => Linking.openURL(uri)}
          />
        </View>
      )}
    </Layout.Main>
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
