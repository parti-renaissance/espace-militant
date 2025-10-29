import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetIsMessageTilSync, useSendMessage, useGetMessageCountRecipients, useGetMessageFilters } from '@/services/publications/hook'
import { RestAvailableSender } from '@/services/publications/schema'
import { AlertTriangle, ArrowLeft, ExternalLink, Link as LinkIcon, RefreshCcw, SendHorizontal } from '@tamagui/lucide-icons'
import { ExternalPathString, Link, router } from 'expo-router'
import { isWeb, Spinner, useMedia, View, XStack, YStack } from 'tamagui'
import ViewportModalSheet, { ViewportModalRef } from './ViewportModalSheet'
import Text from '@/components/base/Text'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import SenderView from '../SenderView'
import { useToastController } from '@tamagui/toast'
import { FiltersChips, FilterValue } from '../FiltersChips'

type ConfirmationModalProps = {
  payload?: {
    messageId: string;
    scope: string
  }
  defaultSender?: RestAvailableSender | null
  defaultTitle?: string | null
}

const ConfirmationModal = forwardRef<ViewportModalRef, ConfirmationModalProps>(({ payload, defaultSender, defaultTitle }, ref) => {
  const modalSheetRef = useRef<ViewportModalRef>(null)
  const toast = useToastController()
  const media = useMedia()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: isMessageTilSync, isLoading: isSyncLoading, isFetching: isSyncFetching, error: syncError, refetch: refetchSync } = useGetIsMessageTilSync({ 
    payload: isModalOpen && payload?.messageId && payload?.scope ? { messageId: payload.messageId, scope: payload.scope } : undefined
  })

  const { data: recipients, isFetching: isFetchingRecipients } = useGetMessageCountRecipients({
    messageId: payload?.messageId || '',
    scope: payload?.scope || '',
    enabled: Boolean(payload?.messageId && payload?.scope),
  })

  const { data: messageFilters, refetch: refetchMessageFilters } = useGetMessageFilters({
    messageId: payload?.messageId,
    scope: payload?.scope,
    enabled: Boolean(payload?.messageId && payload?.scope),
  })

  useEffect(() => {
    if (isModalOpen) {
      refetchMessageFilters()
    }
  }, [isModalOpen, refetchMessageFilters])

  const isLoadingNumbers = isSyncLoading || isFetchingRecipients

  const { mutate, isPending } = useSendMessage({
    uuid: isMessageTilSync?.uuid || ''
  })

  const handleSendMessage = () => {
    if (isSyncFetching) return
    mutate({ 
      scope: payload?.scope || '',
    }, {
      onSuccess: () => {
        modalSheetRef.current?.dismiss()
        setIsModalOpen(false)
        router.dismissAll()
        router.push({
          pathname: '/publications/[id]',
          params: {
            id: isMessageTilSync?.uuid || '',
            congratulations: 'true',
            withoutAnimation: 'true',
            source: 'page_publication_edition',
          },
        })
      }
    })
  }

  const handleSendTestMessage = () => {
    if (isSyncFetching) return
    toast.show('Test envoyé', { message: 'Le test a été envoyé avec succès', type: 'success' })
    mutate({ scope: payload?.scope || '', test: true })
  }

  const handleCopyUrl = useHandleCopyUrl()

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsModalOpen(true)
      modalSheetRef.current?.present()
    },
    dismiss: () => {
      setIsModalOpen(false)
      modalSheetRef.current?.dismiss()
    }
  }))

  const handleCancel = () => {}

  const allDisabled = !!syncError || isSyncFetching || isFetchingRecipients || isPending

  return (
    <ViewportModalSheet ref={modalSheetRef} onClose={handleCancel}>
      <VoxCard.Content marginBottom="$large" gap="$large">
        <Text.LG>Prêt à publier ?</Text.LG>
        <YStack gap="$medium">
          <SenderView sender={isMessageTilSync?.sender || defaultSender || null} />
          <Text.LG semibold>{isMessageTilSync?.subject || defaultTitle}</Text.LG>
        </YStack>
        {messageFilters && (
          <FiltersChips 
            selectedFilters={messageFilters as Record<string, FilterValue>}
            isStatic 
          />
        )}
        <YStack gap="$medium" position="relative">
          {syncError ? (
            <YStack position="absolute" inset={0} bottom={0} zIndex={1}>
              <VoxCard flex={1} justifyContent="center" alignItems="center" borderRadius="$small">
                <VoxCard.Content justifyContent="center" alignItems="center">
                  <AlertTriangle color="#D02828" size="$medium" />
                  <Text.LG color="#D02828" textAlign="center"> Nous n'avons pas pu synchroniser{'\n'}les données de votre publication</Text.LG>
                  <YStack>
                    <VoxButton variant="outlined" iconLeft={RefreshCcw} disabled={isSyncFetching} loading={isSyncFetching} onPress={() => { refetchSync() }}>Réessayer</VoxButton>
                  </YStack>
                </VoxCard.Content>
              </VoxCard>
            </YStack>
          ) : null}
          <View gap="$small" flexDirection={media.gtSm ? 'row' : undefined}>
            <VoxCard inside backgroundColor="$gray1" justifyContent="center" alignItems="center" minWidth={140}>
              <VoxCard.Content justifyContent="center" alignItems="center" gap="$small" h="100%">
                {isLoadingNumbers ? (
                  <View alignItems="center" justifyContent="center" height={52}>
                    <Spinner color="$purple5" />
                  </View>
                ) : (
                  <Text color="$purple5" fontSize={40} lineHeight={52} semibold>{recipients?.contacts ?? 0}</Text>
                )}
                <Text.LG textAlign='center' semibold>Contacts{media.gtSm ? <Text.BR /> : ' '}notifiés</Text.LG>
              </VoxCard.Content>
            </VoxCard>
            <YStack gap="$small" flexGrow={1} flexShrink={1}>
              <VoxCard inside backgroundColor="$gray1">
                <VoxCard.Content>
                  <XStack gap="$xsmall" alignItems="center" height={20}>
                    {isLoadingNumbers ? (
                      <Spinner color="$purple5" />
                    ) : (
                      <Text.LG color="$purple5" semibold>{recipients?.push ?? 0}</Text.LG>
                    )}
                    <Text.MD medium numberOfLines={1}>{(recipients?.push ?? 0) > 500 ? 'notifs' : 'notifications'} mobile seront envoyées</Text.MD>
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
              <VoxCard inside backgroundColor="$gray1">
                <VoxCard.Content>
                  <XStack gap="$xsmall" alignItems="center" height={20}>
                    {isLoadingNumbers ? (
                      <Spinner color="$purple5" />
                    ) : (
                      <Text.LG color="$purple5" semibold>{recipients?.email ?? 0}</Text.LG>
                    )}
                    <Text.MD medium numberOfLines={1}>emails seront envoyés</Text.MD>
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
              <VoxCard inside backgroundColor="$gray1">
                <VoxCard.Content>
                  <XStack gap="$xsmall" alignItems="center" height={20}>
                    {isLoadingNumbers ? (
                      <Spinner color="$purple5" />
                    ) : (
                      <Text.LG color="$purple5" semibold>{recipients?.push_email ?? 0}</Text.LG>
                    )}
                    <Text.MD medium numberOfLines={1}>contacts recevront les deux</Text.MD>
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
            </YStack>
          </View>
          <Text.MD secondary px="$medium" mb="$medium">
            Au total, <Text.MD primary semibold>{recipients?.total ?? 0}</Text.MD> pourront voir cette publication sur leur accueil de l'espace militant.
          </Text.MD>
        </YStack>

        <VoxCard inside backgroundColor="$gray1">
          <VoxCard.Content>
            <YStack gap="$xsmall">
              <XStack alignItems="center" gap="$xsmall">
                <AlertTriangle color="#D02828" size="$medium" />
                <Text.MD medium> L'email envoyé ne pourra pas être retouché</Text.MD>
              </XStack>
              <Text.MD secondary>
                Prenez le temps de relire vos contenus et vérifier le bon fonctionnement de vos liens.
              </Text.MD>
            </YStack>
            <XStack gap="$small">
              {isMessageTilSync?.preview_link ? (
                <YStack flexGrow={1}>
                  <Link href={isMessageTilSync.preview_link as ExternalPathString} asChild={!isWeb} target="_blank">
                    <VoxButton
                      theme="gray"
                      variant="outlined"
                      iconLeft={ExternalLink}
                      flexGrow={1}
                      disabled={allDisabled}
                    // onLongPress={handleSendTestMessage}
                    >
                      {media.gtSm ? 'Aperçu version email' : 'Aperçu'}
                    </VoxButton>
                  </Link>
                </YStack>

              ) : (
                <VoxButton
                  theme="gray"
                  variant="outlined"
                  iconLeft={ExternalLink}
                  flexGrow={1}
                  disabled={allDisabled}
                >
                  {media.gtSm ? 'Aperçu version email' : 'Aperçu'}
                </VoxButton>
              )}
              <VoxButton
                theme="gray"
                variant="outlined"
                iconLeft={LinkIcon}
                onPress={() => {
                  if (isMessageTilSync?.preview_link) {
                    handleCopyUrl(isMessageTilSync.preview_link)
                  }
                }}
                disabled={allDisabled || !isMessageTilSync?.preview_link}
              >
                Copier le lien
              </VoxButton>
            </XStack>
          </VoxCard.Content>
        </VoxCard>

        <XStack gap="$small" justifyContent="space-between">
          <VoxButton 
          theme="gray" 
          variant="outlined" 
          iconLeft={ArrowLeft} 
          onPress={() => { modalSheetRef.current?.dismiss(); setIsModalOpen(false) }} 
          disabled={isSyncLoading}
          loading={isSyncLoading}
          >
            Retour à l'édition
          </VoxButton>
          <VoxButton
            theme="purple"
            variant="contained"
            iconRight={SendHorizontal}
            onPress={handleSendMessage}
            loading={isPending || isSyncFetching}
            disabled={allDisabled || !isMessageTilSync?.synchronized}
          >
            Publier & envoyer
          </VoxButton>
        </XStack>

      </VoxCard.Content>
    </ViewportModalSheet>
  )
})

export default ConfirmationModal
