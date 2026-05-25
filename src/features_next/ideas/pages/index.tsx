import { useRouter } from 'expo-router'
import { YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

export default function IdeesScreen() {
  const router = useRouter()

  return (
    <Layout.Container>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView>
          <VoxCard>
            <VoxCard.Content>
              <YStack gap="$medium">
                <Text.LG>Idées</Text.LG>
                <Text.SM secondary>TODO : integre les interfaces des idées</Text.SM>
                <VoxButton onPress={() => router.push('/ressources')}>Ressources</VoxButton>
              </YStack>
            </VoxCard.Content>
          </VoxCard>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
