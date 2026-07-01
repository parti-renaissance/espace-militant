import Head from 'expo-router/head'
import { useMedia } from 'tamagui'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import VideoTestPage from '@/features/video/pages/video-test'

import * as metatags from '@/config/metatags'

export default function VideoToolScreen() {
  const media = useMedia()

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Vidéo (test API)')}</title>
      </Head>
      {media.sm ? <Header title="Vidéo (test API)" /> : null}
      <Layout.Container hideTabBar alwaysShowScrollbar sidebarState="cadre">
        <VideoTestPage />
      </Layout.Container>
    </>
  )
}
