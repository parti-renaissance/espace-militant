import { forwardRef, useImperativeHandle, useRef } from 'react'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetIsMessageTilSync, useSendMessage, useGetMessageCountRecipients } from '@/services/messages/hook'
import { AlertTriangle, ArrowLeft, ExternalLink, Link as LinkIcon, RefreshCcw, SendHorizontal } from '@tamagui/lucide-icons'
import { ExternalPathString, Link, router } from 'expo-router'
import { isWeb, Spinner, View, XStack, YStack } from 'tamagui'
import ViewportModalSheet, { ViewportModalRef } from './ViewportModalSheet'
import Text from '@/components/base/Text'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import SenderView from '../SenderView'
import { useToastController } from '@tamagui/toast'

const ConfirmationModal = forwardRef<ViewportModalRef, { payload?: { messageId: string; scope: string } }>((props, ref) => {
  const modalSheetRef = useRef<ViewportModalRef>(null)
  const toast = useToastController()
  const { data: isMessageTilSync, isLoading: isSyncLoading, error: syncError, refetch: refetchSync } = useGetIsMessageTilSync({ payload: props.payload?.messageId && props.payload?.scope ? { messageId: props.payload.messageId, scope: props.payload.scope } : undefined })

  const { data: recipients, isLoading: isLoadingRecipients } = useGetMessageCountRecipients({
    messageId: props.payload?.messageId || '',
    scope: props.payload?.scope || '',
    enabled: Boolean(props.payload?.messageId && props.payload?.scope),
  })

  const { mutate, isPending } = useSendMessage({
    uuid: isMessageTilSync?.uuid || ''
  })

  const handleSendMessage = () => {
    if (isSyncLoading) return
    mutate({ scope: props.payload?.scope || '' })
  }

  const handleSendTestMessage = () => {
    if (isSyncLoading) return
    toast.show('Test envoyé', { message: 'Le test a été envoyé avec succès', type: 'success' })
    mutate({ scope: props.payload?.scope || '', test: true })
  }

  const handleCopyUrl = useHandleCopyUrl()

  useImperativeHandle(ref, () => modalSheetRef.current!)

  const handleCancel = () => {
    router.replace({
      pathname: '/messages/[id]/editer',
      params: {
        id: props.payload?.messageId ? props.payload.messageId : '',
      },
    })
  }

  const allDisabled = !!syncError || isSyncLoading || isLoadingRecipients || isPending

  return (
    <ViewportModalSheet ref={modalSheetRef} onClose={handleCancel}>
      <VoxCard.Content marginBottom="$large" gap="$large">
        <Text.LG>Prêt à publier ?</Text.LG>
        {/* TODO: add sender preview */}
        <YStack gap="$medium">
          <SenderView sender={isMessageTilSync?.sender || null} />
          <Text.LG semibold>{isMessageTilSync?.subject}</Text.LG>
        </YStack>
        <YStack gap="$medium" position="relative">
          {syncError ? (
            <YStack position="absolute" inset={0} bottom={0} zIndex={1}>
              <VoxCard flex={1} justifyContent="center" alignItems="center" borderRadius="$small" $gtSm={{ borderRadius: "$small" }}>
                <VoxCard.Content justifyContent="center" alignItems="center">
                  <AlertTriangle color="#D02828" size="$medium" />
                  <Text.LG color="#D02828" textAlign="center"> Nous n'avons pas pu synchroniser{'\n'}les données de votre publication</Text.LG>
                  <YStack>
                    <VoxButton variant="outlined" iconLeft={RefreshCcw} onPress={() => { refetchSync() }}>Réessayer</VoxButton>
                  </YStack>
                </VoxCard.Content>
              </VoxCard>
            </YStack>
          ) : null}
          <View gap="$small" $gtSm={{ flexDirection: 'row' }}>
            <VoxCard inside backgroundColor="$gray1" justifyContent="center" alignItems="center">
            <VoxCard.Content justifyContent="center" alignItems="center" gap="$small">
                {isLoadingRecipients ? (
                  <View alignItems="center" justifyContent="center" height={52}>
                    <Spinner color="$purple5" />
                  </View>
                ) : (
                  <Text color="$purple5" fontSize={40} lineHeight={52} semibold>{recipients?.contacts ?? 0}</Text>
                )}
                <Text.LG semibold>Contacts notifiés</Text.LG>
              </VoxCard.Content>
            </VoxCard>
            <YStack gap="$small" flexGrow={1} flexShrink={1}>
              <VoxCard inside backgroundColor="$gray1">
                <VoxCard.Content>
                  <XStack gap="$xsmall" alignItems="center" height={20}>
                    {isLoadingRecipients ? (
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
                    {isLoadingRecipients ? (
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
                    {isLoadingRecipients ? (
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
                      onLongPress={handleSendTestMessage}
                    >
                      Aperçu version email
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
                  Aperçu version email
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

        <XStack gap="$medium" justifyContent="space-between">
          <VoxButton theme="gray" variant="outlined" iconLeft={ArrowLeft} onPress={() => modalSheetRef.current?.dismiss()} disabled={allDisabled}>
            Retour à l'édition
          </VoxButton>
          <VoxButton
            theme="purple"
            variant="contained"
            iconRight={SendHorizontal}
            onPress={handleSendMessage}
            loading={isPending}
            disabled={allDisabled || !isMessageTilSync?.uuid}
          >
            Publier & envoyer
          </VoxButton>
        </XStack>

      </VoxCard.Content>
    </ViewportModalSheet>
  )
})

export default ConfirmationModal
