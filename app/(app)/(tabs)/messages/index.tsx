import React from 'react'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { Link } from 'expo-router'
import Head from 'expo-router/head'
import { isWeb, YStack } from 'tamagui'

const MessagesScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Messages')}</title>
      </Head>

      <PageLayout>
        <PageLayout.MainSingleColumn justifyContent="center" alignItems="center">
          <YStack>
            <Link href="/messages/creer" asChild={!isWeb}>
              <VoxButton>Créer un mail</VoxButton>
            </Link>
          </YStack>
        </PageLayout.MainSingleColumn>
      </PageLayout>
    </>
  )
}

export default MessagesScreen
