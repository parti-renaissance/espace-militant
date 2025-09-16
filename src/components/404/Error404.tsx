// import { Image } from 'react-native'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
// import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Image, useMedia, View, YStack } from 'tamagui'
import Text from '../base/Text'
import { VoxButton } from '../Button'

export default function Error404() {
  const media = useMedia()
  
  return (
    <PageLayout>
      <PageLayout.StateFrame justifyContent="center" mt={media.gtSm ? 0 : undefined}>
        <Image
          source={require('../../assets/images/404.png')}
          resizeMode="contain"
          width={media.md ? 400 : (media.sm ? 300 : undefined)}
          height={media.md ? 400 : (media.sm ? 300 : undefined)}
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
