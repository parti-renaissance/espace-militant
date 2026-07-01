import React from 'react'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'
import { DoorOpen } from '@tamagui/lucide-icons'

import { AccessDeny } from '@/components/AccessDeny'
import { Header, LayoutScrollView } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import { RequireAuth } from '@/components/RequireAuth'
import VoxCard from '@/components/VoxCard/VoxCard'

import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'
import DoorToDoorScreenPage from '@/screens/doorToDoor/DoorToDoorScreenPage'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function PorteAPortePage() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canAccess = hasFeature(FEATURES.PAP)

  return (
    <RequireAuth>
      <Head>
        <title>{metatags.createTitle('Porte à porte')}</title>
      </Head>
      <Header title="Porte à porte" icon={DoorOpen} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false} hideTabBar>
        {!canAccess && !isLoading ? (
          <Layout.Main>
            <LayoutScrollView>
              <VoxCard>
                <AccessDeny />
              </VoxCard>
            </LayoutScrollView>
          </Layout.Main>
        ) : (
          <YStack flex={1}>
            <BoundarySuspenseWrapper
              errorChildren={(payload) => {
                if (payload.error instanceof ForbiddenError || payload.error instanceof UnauthorizedError) {
                  return (
                    <Layout.Main w="100%" margin="auto">
                      <LayoutScrollView>
                        <VoxCard>
                          <AccessDeny message={payload.error.detail ?? payload.error.message} />
                        </VoxCard>
                      </LayoutScrollView>
                    </Layout.Main>
                  )
                }
                return <DefaultErrorFallback {...payload} />
              }}
            >
              <DoorToDoorScreenPage embeddedInLayout />
            </BoundarySuspenseWrapper>
          </YStack>
        )}
      </Layout.Container>
    </RequireAuth>
  )
}
