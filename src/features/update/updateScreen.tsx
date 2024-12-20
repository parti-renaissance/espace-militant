import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AppState } from 'react-native'
import {StatusBar} from "expo-status-bar"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import redirectToStore from '@/helpers/redirectToStore'
import useAppUpdate from '@/hooks/useAppUpdate'
import useAsyncFn from '@/hooks/useAsyncFn'
import NetInfo from '@react-native-community/netinfo'
import { Image } from 'expo-image'
import { reloadAsync } from 'expo-updates'
import { getTokenValue, Spinner, View, XStack, YStack } from 'tamagui'

interface Props {
  children: React.ReactNode
}

const useAppStateOnChange = (callback: () => void) => {
  const appState = useRef(AppState.currentState)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        callback()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])
}

export default function UpdateScreen({ children }: Props) {
  const { isBuildUpdateAvailable, checkForUpdate, isUpdateAvailable, isDownloading, isUpdatePending } = useAppUpdate()
  const hasAnyUpdate = isUpdateAvailable || isBuildUpdateAvailable
  const message = isBuildUpdateAvailable
    ? 'Mettez à jour votre application depuis votre store pour découvrir les nouveautés.'
    : 'Nous mettons à jour votre application en arrière plan pour vous faire profiter des dernières nouveautés.'

  useAppStateOnChange(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        checkForUpdate()
      }
    })
  })

  const { isProcessing, trigger: onUpdate } = useAsyncFn(
    useCallback(async () => {
      if (isBuildUpdateAvailable) {
        await redirectToStore()
      } else {
        await reloadAsync()
      }
    }, []),
  )

  useEffect(() => {
    if (!isDownloading && isUpdatePending) {
      onUpdate()
    }
  }, [isDownloading, isUpdatePending])

  const updateStatusMessage = useMemo(() => {
    if (!isUpdateAvailable) return null
    if (isDownloading) return 'Téléchargement...'
    if (isProcessing) return 'Mise à jour....'
    return null
  }, [isDownloading, isProcessing, isUpdateAvailable])

  const insets = useSafeAreaInsets()

  if (!hasAnyUpdate) {
    return children
  }

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
            <Text.LG multiline regular textAlign="center" children={message} />
            {updateStatusMessage ? (
              <XStack gap="$medium">
                <Spinner color="$blue6" size="small" />
                <Text.MD textAlign="center" children={updateStatusMessage} />
              </XStack>
            ) : null}
          </YStack>
        </YStack>
        {isBuildUpdateAvailable ? (
          <XStack>
            <VoxButton onPress={onUpdate} theme="blue" full size="xl" loading={isProcessing}>
              Mettre à jour
            </VoxButton>
          </XStack>
        ) : null}
      </View>
    </LayoutPage>
  )
}
