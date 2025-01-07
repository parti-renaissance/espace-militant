import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'
import redirectToStore from '@/helpers/redirectToStore'
import useAppUpdate from '@/hooks/useAppUpdate'
import useAsyncFn from '@/hooks/useAsyncFn'
import { Image } from 'expo-image'
import { reloadAsync } from 'expo-updates'
import { View, XStack, YStack } from 'tamagui'

interface Props {
  isBuildUpdate?: boolean
}

export default function UpdateScreen({ isBuildUpdate = false }: Props) {
  const { isDownloading } = useAppUpdate()
  const { isProcessing, trigger: onUpdate } = useAsyncFn(
    useCallback(async () => {
      if (isBuildUpdate) {
        await redirectToStore()
      } else {
        await reloadAsync()
      }
    }, []),
  )

  const insets = useSafeAreaInsets()

  const isDisabled = isProcessing || isDownloading

  return (
    <View height="100%" p={'$medium'} pt={insets.top} pb={insets.bottom} flex={1}>
      <XStack alignItems="center" justifyContent="center" gap={'$large'}>
        <EuCampaignIllustration pt={'$large'} showIcon={false} />
      </XStack>
      <YStack alignItems="center" justifyContent="center" flex={1} gap={'$large'}>
        <Image source={require('./assets/updateRefresh.png')} style={{ width: '100%', height: 200 }} contentFit="contain" />
        <YStack alignItems="center" justifyContent="center" gap={'$medium'} p={'$medium'}>
          <Title>Mise à jour requise</Title>

          <Text.MD semibold textAlign="center">
            Votre version d’application est trop ancienne pour fonctionner correctement.
          </Text.MD>
          <Text.MD semibold textAlign="center">
            Mettez à jour votre application pour découvrir les nouveautés.
          </Text.MD>
        </YStack>
      </YStack>
      <XStack>
        <VoxButton onPress={onUpdate} theme="green" loading={isDisabled} disabled={isDisabled} full size="xl">
          {isProcessing ? 'Installation en cours...' : isDownloading ? 'Téléchargement en cours...' : 'Mettre à jour'}
        </VoxButton>
      </XStack>
    </View>
  )
}
