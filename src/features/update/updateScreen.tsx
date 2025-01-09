import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import redirectToStore from '@/helpers/redirectToStore'
import useAsyncFn from '@/hooks/useAsyncFn'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import NetInfo from '@react-native-community/netinfo'
import { Image } from 'expo-image'
import * as Updates from 'expo-updates'
import { isWeb, Spinner, View, XStack, YStack } from 'tamagui'
import { checkStoreUpdate } from './utils'

interface Props {
  children: React.ReactNode
}

const useAppStateOnChange = (callback: () => Promise<void>) => {
  const appState = useRef(AppState.currentState)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await callback()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])
}

export default function UpdateScreen({ children }: Props) {
  const [updateType, setUpdateType] = useState<'build' | 'update' | null>(null)
  const { isDownloading } = Updates.useUpdates()

  const message =
    updateType === 'build'
      ? 'Mettez à jour votre application depuis votre store pour découvrir les nouveautés.'
      : 'Nous mettons à jour votre application en arrière plan pour vous faire profiter des dernières nouveautés.'

  useAppStateOnChange(async () => {
    if (isWeb) {
      return
    }
    return NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        const newStoreBuildAvailable = await checkStoreUpdate()
        if (newStoreBuildAvailable) {
          setUpdateType('build')
        } else {
          const isEasUpdateAvailable = await Updates.checkForUpdateAsync()
          if (isEasUpdateAvailable) {
            setUpdateType('update')
            try {
              await Updates.fetchUpdateAsync()
              await Updates.reloadAsync()
            } catch (e) {
              if (e instanceof Error) {
                ErrorMonitor.log(e.message)
              } else {
                ErrorMonitor.log("Un erreur lors de la mise à jour s'est produite")
              }
            }
          } else {
            setUpdateType(null)
          }
        }
      }
    })
  })

  const { isProcessing, trigger: onUpdate } = useAsyncFn(
    useCallback(async () => {
      await redirectToStore()
    }, []),
  )

  const updateStatusMessage = useMemo(() => {
    if (updateType !== 'update') return null
    if (isDownloading) return 'Téléchargement...'
    if (!isDownloading) return 'Mise à jour....'
    return null
  }, [isDownloading, updateType])

  const insets = useSafeAreaInsets()

  if (!updateType) {
    return children
  }

  return (
    <LayoutPage>
      <View height="100%" p={'$medium'} pt={insets.top} pb={insets.bottom} flex={1}>
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
        {updateType === 'build' ? (
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
