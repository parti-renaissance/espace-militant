import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import redirectToStore from '@/helpers/redirectToStore'
import useAsyncFn from '@/hooks/useAsyncFn'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { getTokenValue, Spinner, View, XStack, YStack } from 'tamagui'

export function UpdateStoreScreen() {
  const { isProcessing, trigger: onUpdate } = useAsyncFn(
    useCallback(async () => {
      await redirectToStore()
    }, []),
  )

  const insets = useSafeAreaInsets()

  return (
    <LayoutPage>
      <StatusBar style="dark" />
      <View p={'$medium'} pt={insets.top} pb={insets.bottom + getTokenValue('$medium')} flex={1}>
        <XStack alignItems="center" justifyContent="center" gap={'$large'}>
          <EuCampaignIllustration pt={'$large'} showIcon={false} />
        </XStack>
        <YStack alignItems="center" justifyContent="center" flex={1} gap={'$large'}>
          <Image source={require('./assets/updateRefresh.png')} style={{ width: '100%', height: 200 }} contentFit="contain" />
          <YStack alignItems="center" justifyContent="center" gap={'$medium'} p={'$medium'}>
            <Text.LG fontSize={20} bold textAlign="center">
              Nouvelles fonctionnalités disponibles !
            </Text.LG>
            <Text.LG multiline regular textAlign="center">
              Mettez à jour votre application depuis votre store pour découvrir les nouveautés.
            </Text.LG>
          </YStack>
        </YStack>
        <XStack pb={'$medium'}>
          <VoxButton onPress={onUpdate} theme="blue" full size="xl" loading={isProcessing}>
            Mettre à jour
          </VoxButton>
        </XStack>
      </View>
    </LayoutPage>
  )
}

export function UpdateExpoScreen() {
  const insets = useSafeAreaInsets()

  return (
    <LayoutPage>
      <StatusBar style="dark" />
      <View p={'$medium'} pt={insets.top} pb={insets.bottom + getTokenValue('$medium')} flex={1}>
        <XStack alignItems="center" justifyContent="center" gap={'$large'}>
          <EuCampaignIllustration pt={'$large'} showIcon={false} />
        </XStack>
        <YStack alignItems="center" justifyContent="center" flex={1} gap={'$large'}>
          <Image source={require('./assets/updateRefresh.png')} style={{ width: '100%', height: 200 }} contentFit="contain" />
          <YStack alignItems="center" justifyContent="center" gap={'$medium'} p={'$medium'}>
            <Text.LG fontSize={20} bold textAlign="center">
              Nouvelles fonctionnalités disponibles !
            </Text.LG>
            <Text.LG multiline regular textAlign="center">
              Nous mettons à jour votre application en arrière plan pour vous faire profiter des dernières nouveautés.
            </Text.LG>
            <XStack gap="$medium">
              <Spinner color="$blue6" size="small" />
              <Text.MD textAlign="center">Téléchargement...</Text.MD>
            </XStack>
          </YStack>
        </YStack>
      </View>
    </LayoutPage>
  )
}
