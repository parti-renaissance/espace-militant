import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Keyboard } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { useCreateMessage, useGetAvailableSenders, useGetMessage, useGetMessageContent, useGetMessageFilters } from '@/services/publications/hook'
import { PenLine, Speech } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import MessageEditor, { defaultTheme, getHTML, MessageEditorRef } from '../../components/Editor'
import ConfirmationModal from '../../components/ConfirmationModal'
import { ViewportModalRef } from '../../components/ConfirmationModal/ViewportModalSheet'
import BigSwitch from '@/components/base/BigSwitch'
import { RestAvailableSender } from '@/services/publications/schema'
import { useToastController } from '@tamagui/toast'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import QuitConfirmModal from '../../components/QuitConfirmModal'

const MessageEditorPage = (props?: { scope?: string, messageId?: string }) => {
  const editorRef = useRef<MessageEditorRef>(null)
  const modalSendRef = useRef<ViewportModalRef>(null)
  const media = useMedia()
  const toast = useToastController()
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
      messageId: currentMessageId ?? '',
      scope: props?.scope ?? '',
      enabled: !!currentMessageId
    }
  }, [props?.messageId, props?.scope])

  const { data: messageFiltersData, isLoading: isMessageFiltersLoading } = useGetMessageFilters(messageQueryParams)
  const { data: messageData, isLoading: isMessageLoading } = useGetMessage(messageQueryParams)
  const { data: messageContent, isLoading: isMessageContentLoading, isError: isMessageContentError } = useGetMessageContent(messageQueryParams)

  const availableSendersQueryParams = useMemo(() => ({
    scope: messageData?.author.scope ?? props?.scope ?? ''
  }), [messageData?.author.scope, props?.scope])

  const { data: availableSenders, isLoading: isSendersLoading } = useGetAvailableSenders(availableSendersQueryParams)

  const selectedSender = useMemo(() => {
    if (messageData?.sender) { return messageData.sender }
    if (availableSenders && availableSenders.length > 0) { return availableSenders[0] }
    return null
  }, [messageData?.sender, availableSenders])

  const isInitialLoading = !wasInitiallyInCreation && (isMessageLoading || isSendersLoading || isMessageContentLoading || isMessageFiltersLoading)

  const handleSubmit = (x: S.Message) => {
    if (x?.content.length === 0) {
      toast.show('Erreur', { message: 'Veuillez ajouter au moins un champ', type: 'error' })
      return
    }
    return messageQuery
      .mutateAsync({
        scope: x.metaData.scope ?? '',
        payload: {
          type: x.metaData.scope,
          subject: x.metaData.subject,
          label: x.metaData.subject,
          json_content: JSON.stringify(x),
          content: getHTML(defaultTheme, x, selectedSender),
        },
      })
      .then(() => {
        modalSendRef.current?.present()
        Keyboard.dismiss()
      })
  }

  const handleQuit = () => {
    setDisplayQuitModal(false)
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/publications')
    }
  }

  return (
    <>
      <QuitConfirmModal isOpen={displayQuitModal} onConfirm={handleQuit} onClose={() => setDisplayQuitModal(false)} />
      <StickyBox webOnly style={{ zIndex: 10 }}>
        <YStack $gtSm={{ overflow: 'hidden', zIndex: 10 }}>
          <VoxHeader>
            <XStack alignItems="center" flex={1} width="100%">
              <XStack alignContent="flex-start">
                <VoxButton
                  size="lg"
                  variant="text"
                  theme={!messageContent ? 'orange' : undefined}
                  onPress={messageContent && !displayQuitModal ? () => setDisplayQuitModal(true) : handleQuit}
                  disabled={isInitialLoading}
                >
                  {messageContent ? 'Quitter' : 'Annuler'}
                </VoxButton>
              </XStack>
              <XStack flexGrow={1} justifyContent="center">
                <VoxHeader.Title icon={messageContent ? PenLine : media.gtSm ? Speech : undefined}>{messageContent ? 'Editer publication' : media.gtSm ? 'Nouvelle publication' : 'Publication'}</VoxHeader.Title>
              </XStack>
              <XStack>
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
          </VoxHeader>
        </YStack>
        <YStack backgroundColor="$textSurface">
          <YStack maxWidth={520} marginHorizontal='auto' width="100%" height={76} $sm={{ px: '$medium', py: '$small', height: 60 }} justifyContent='center' py="$medium">
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
            $gtSm={isWeb ? { paddingTop: '$large' } : undefined}
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
                sender={selectedSender as RestAvailableSender}
                messageFilters={messageFiltersData}
              />
            </PageLayout.MainSingleColumn>
          </BoundarySuspenseWrapper>
        </PageLayout>
      )}
    </>

  )
}

export default MessageEditorPage
