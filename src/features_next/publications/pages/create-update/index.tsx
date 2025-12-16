import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Keyboard } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit/index'
import { useCreateMessage, useGetAvailableSenders, useGetMessage, useGetMessageContent, useGetMessageFilters } from '@/services/publications/hook'
import { Speech } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import MessageEditor, { defaultTheme, MessageEditorRef } from '../../components/Editor'
import ConfirmationModal from '../../components/ConfirmationModal'
import { ViewportModalRef } from '../../components/ConfirmationModal/ViewportModalSheet'
import BigSwitch from '@/components/base/BigSwitch'
import { RestAvailableSender } from '@/services/publications/schema'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import QuitConfirmModal from '../../components/QuitConfirmModal'
import { useAutoSave } from '../../components/Editor/hooks/useAutoSave'
import { AutoSaveErrorIndicator } from '../../components/Editor/AutoSaveErrorIndicator'
import Error404 from '@/components/404/Error404'
import { Header } from '@/components/AppStructure'

const MessageEditorPage = (props?: { scope?: string, messageId?: string }) => {
  const editorRef = useRef<MessageEditorRef>(null)
  const modalSendRef = useRef<ViewportModalRef>(null)
  const media = useMedia()
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [currentMessageId, setCurrentMessageId] = useState<string | undefined>(props?.messageId)
  const [wasInitiallyInCreation] = useState(!props?.messageId)
  const [displayQuitModal, setDisplayQuitModal] = useState(false)

  useEffect(() => {
    if (props?.messageId) {
      setCurrentMessageId(props.messageId)
    }
  }, [props?.messageId])

  const messageQuery = useCreateMessage({ uuid: currentMessageId })

  const messageQueryParams = useMemo(() => {
    return {
      messageId: props?.messageId ?? '',
      scope: props?.scope ?? '',
      enabled: !!props?.messageId
    }
  }, [props?.messageId, props?.scope])

  const { data: messageFiltersData, isLoading: isMessageFiltersLoading } = useGetMessageFilters(messageQueryParams)
  const { data: messageData, isLoading: isMessageLoading, error: messageError } = useGetMessage(messageQueryParams)
  const { data: messageContent, isLoading: isMessageContentLoading, error: messageContentError } = useGetMessageContent(messageQueryParams)

  const availableSendersQueryParams = useMemo(() => ({
    scope: props?.scope ?? messageData?.author?.scope ?? ''
  }), [messageData?.author?.scope, props?.scope])

  const { data: availableSenders, isLoading: isSendersLoading } = useGetAvailableSenders(availableSendersQueryParams)

  const [manuallySelectedSender, setManuallySelectedSender] = useState<RestAvailableSender | null>(null)

  const selectedSender = useMemo(() => {
    if (manuallySelectedSender) {
      return manuallySelectedSender
    }
    if (messageData?.sender !== undefined) {
      return messageData.sender
    }
    if (availableSenders && availableSenders.length > 0) {
      return availableSenders[0]
    }
    return null
  }, [manuallySelectedSender, messageData?.sender, availableSenders])

  const isInitialLoading = !wasInitiallyInCreation && (isMessageLoading || isSendersLoading || isMessageContentLoading || isMessageFiltersLoading)

  // Hook de sauvegarde automatique
  const {
    debouncedSave,
    immediateSave,
    isPending: isAutoSaving,
    hasError,
    createdMessageId,
  } = useAutoSave({
    messageId: currentMessageId,
    scope: props?.scope ?? '',
  })

  if (messageError || messageContentError) {
    return <Error404 />
  }

  const handleSubmit = () => {
    modalSendRef.current?.present()
    Keyboard.dismiss()
  }

  const handleQuit = () => {
    setDisplayQuitModal(false)
    if (isWeb) {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace('/publications')
      }
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/publications')
    }
  }

  const handleSenderChange = (newSender: RestAvailableSender | null) => {
    setManuallySelectedSender(newSender)
  }

  return (
    <YStack flex={1} backgroundColor="red">
      <QuitConfirmModal
        isOpen={displayQuitModal}
        onConfirm={handleQuit}
        onClose={() => {
          setDisplayQuitModal(false)
        }}
        messageId={currentMessageId}
        scope={props?.scope}
      />
      <StickyBox webOnly style={{ zIndex: 10 }}>
        <YStack overflow={media.gtSm ? 'hidden' : undefined} zIndex={media.gtSm ? 10 : undefined}>
          <Header title="Nouvelle publication" icon={Speech} style={{ showOn: 'always' }}>
            <XStack flex={1} alignItems="center" justifyContent="center" width="100%">
              <XStack flex={1} alignContent="flex-start" w={100}>
                <VoxButton
                  size="lg"
                  variant="text"
                  theme={isAutoSaving ? 'blue' : (!props?.messageId ? 'orange' : undefined)}
                  onPress={props?.messageId && !displayQuitModal ? () => setDisplayQuitModal(true) : handleQuit}
                  disabled={isInitialLoading || isAutoSaving}
                  loading={isAutoSaving}
                >
                  {isAutoSaving ? 'Sauvegarde' : (props?.messageId ? 'Quitter' : 'Annuler')}
                </VoxButton>
                <AutoSaveErrorIndicator
                  hasError={hasError}
                />

              </XStack>
              <XStack maxWidth={520} justifyContent="center">
                <VoxHeader.Title icon={media.gtSm ? Speech : undefined}>{media.gtSm ? 'Nouvelle publication' : 'Publication'}</VoxHeader.Title>
              </XStack>
              <XStack flex={1} justifyContent="flex-end" w={100}>
                <VoxButton
                  size="lg"
                  loading={messageQuery.isPending}
                  disabled={isInitialLoading}
                  theme="purple"
                  onPress={() => editorRef.current?.submit()}
                >
                  Suivant
                </VoxButton>
              </XStack>
            </XStack>
          </Header>
        </YStack>
        <YStack backgroundColor="$textSurface" paddingTop={media.gtSm ? '$large' : undefined}>
          <YStack maxWidth={520} marginHorizontal='auto' width="100%" height={media.sm ? 60 : 76} px={media.sm ? '$medium' : undefined} py={media.sm ? '$small' : '$medium'} justifyContent='center'>
            <BigSwitch
              options={[
                { label: 'Édition', value: 'edit' },
                { label: 'Aperçu', value: 'preview' },
              ]}
              value={mode}
              onChange={x => setMode(x as 'edit' | 'preview')}
            />
          </YStack>
        </YStack>
      </StickyBox>
      {isInitialLoading ? (
        <PageLayout>
          <PageLayout.MainSingleColumn
            maxWidth={520}
            marginHorizontal='auto'
            width="100%"
            flexGrow={1}
            paddingTop={isWeb && media.gtSm ? '$large' : undefined}
          >
            <SkeCard>
              <SkeCard.Content>
                <SkeCard.Chip />
                <SkeCard.Author />
                <SkeCard.Description />
                <SkeCard.Image />
              </SkeCard.Content>
            </SkeCard>
          </PageLayout.MainSingleColumn>
        </PageLayout>
      ) : (
        <PageLayout
          webScrollable
          onPress={() => {
            editorRef.current?.unSelect()
          }}
        >
          <ConfirmationModal
            ref={modalSendRef}
            payload={{ scope: props?.scope ?? '', messageId: currentMessageId ?? '' }}
            defaultSender={selectedSender as RestAvailableSender | null}
            defaultTitle={messageContent?.subject}
          />
          <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
            <PageLayout.MainSingleColumn
              opacity={messageQuery.isPending ? 0.5 : 1}
              style={{ pointerEvents: messageQuery.isPending ? 'none' : 'auto' }}
              cursor={messageQuery.isPending ? 'progress' : 'auto'}
            >
              <MessageEditor
                theme={defaultTheme}
                ref={editorRef}
                defaultValue={messageContent?.json_content ? JSON.parse(messageContent.json_content) : undefined}
                onSubmit={handleSubmit}
                displayToolbar={mode === 'edit'}
                messageId={currentMessageId}
                onDisplayToolbarChange={(displayToolbar) => {
                  setMode(displayToolbar ? 'edit' : 'preview')
                }}
                sender={selectedSender}
                messageFilters={messageFiltersData}
                onDebouncedSave={debouncedSave}
                onImmediateSave={immediateSave}
                createdMessageId={createdMessageId}
                onSenderChange={handleSenderChange}
                availableSenders={availableSenders}
              />
            </PageLayout.MainSingleColumn>
          </BoundarySuspenseWrapper>
        </PageLayout>
      )}
    </YStack>

  )

}
export default MessageEditorPage

