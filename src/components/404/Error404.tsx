// import { Image } from 'react-native'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
// import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import { Image, View, YStack } from 'tamagui'
import Text from '../base/Text'
import { VoxButton } from '../Button'

export default function Error404() {
  return (
    <PageLayout>
      <PageLayout.StateFrame justifyContent="center" $gtSm={{ mt: 0 }}>
        <Image
          source={require('../../assets/images/404.png')}
          resizeMode="contain"
          $md={{
            width: 400,
            height: 400,
          }}
          $sm={{
            width: 300,
            height: 300,
          }}
        />
        <YStack gap="$large" justifyContent="center" alignItems="center">
          <YStack gap="$medium">
            <Text.LG semibold textAlign="center">
              404
            </Text.LG>
            <Text.MD width={254} textAlign="center">
              Il semblerait que cette porte ne mène à... rien. La page n’existe pas.
            </Text.MD>
          </YStack>

          <View>
            <Link href="/" asChild>
              <VoxButton variant="soft" size="lg">
                Retourner à l'accueil
              </VoxButton>
            </Link>
          </View>
        </YStack>
      </PageLayout.StateFrame>
    </PageLayout>
  )
}
