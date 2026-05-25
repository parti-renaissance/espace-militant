import { useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useHasRecentMembership } from '@/services/profile/hook'

export default function SoutenirScreen() {
  const router = useRouter()
  const { hasAccess: hasFormationsAccess } = useHasRecentMembership()
  const { isPending: isPendingFormations, open: openFormations } = useOpenExternalContent({
    slug: 'formation',
    utm_campaign: 'soutenir',
  })

  return (
    <Layout.Container>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView>
          <VoxCard>
            <VoxCard.Content>
              <YStack gap="$medium">
                <Text.LG>Soutenir</Text.LG>
                <Text.SM secondary>TODO : integre les interfaces du soutien</Text.SM>
                <XStack gap="$medium">
                  <VoxButton onPress={() => router.push('/parrainages')}>Parrainages</VoxButton>
                  <VoxButton
                    disabled={hasFormationsAccess && isPendingFormations}
                    onPress={hasFormationsAccess ? openFormations({ state: '/formations' }) : () => router.push('/formations')}
                  >
                    Formations
                  </VoxButton>
                </XStack>
              </YStack>
            </VoxCard.Content>
          </VoxCard>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
