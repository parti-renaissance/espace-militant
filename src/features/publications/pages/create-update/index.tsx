import React, { useRef, useState, useMemo } from 'react'
import { Keyboard } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { useCreateMessage, useGetAvailableSenders, useGetMessage } from '@/services/publications/hook'
import * as types from '@/services/publications/schema'
import { PenLine, Speech } from '@tamagui/lucide-icons'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import MessageEditor, { defaultTheme, getHTML, MessageEditorRef } from '../../components/Editor'
import ConfirmationModal from '../../components/ConfirmationModal'
import { ViewportModalRef } from '../../components/ConfirmationModal/ViewportModalSheet'
import BigSwitch from '@/components/base/BigSwitch'
import { RestAvailableSender } from '@/services/publications/schema'
import { useToastController } from '@tamagui/toast'
  
const MessageEditorPage = (props?: { edit?: types.RestGetMessageContentResponse; scope?: string }) => {
  const editorRef = useRef<MessageEditorRef>(null)
  const modalSendRef = useRef<ViewportModalRef>(null)
  const media = useMedia()
  const searchParams = useLocalSearchParams<{ scope?: string }>()
  const scopeFromQuery = searchParams?.scope
  const toast = useToastController()
  
  const [message, setMessage] = useState<
    | {
      messageId: string
      scope: string
    }
    | undefined
  >(props?.edit ? { messageId: props.edit.uuid!, scope: props.scope! } : undefined)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  const messageQuery = useCreateMessage({ uuid: props?.edit?.uuid })
  
  // Récupérer les données du message et des senders pour le HTML
  const messageQueryParams = useMemo(() => ({
    messageId: props?.edit?.uuid ?? '', 
    scope: scopeFromQuery ?? props?.scope ?? '', 
    enabled: !!props?.edit?.uuid
  }), [props?.edit?.uuid, scopeFromQuery, props?.scope])
  
  const { data: messageData } = useGetMessage(messageQueryParams)
  
  const availableSendersQueryParams = useMemo(() => ({
    scope: messageData?.author.scope ?? scopeFromQuery ?? props?.scope ?? ''
  }), [messageData?.author.scope, scopeFromQuery, props?.scope])
  
  const { data: availableSenders } = useGetAvailableSenders(availableSendersQueryParams)
  
  // Déterminer le sender à utiliser pour le HTML
  const senderForHtml = useMemo(() => {
    // Pour les messages existants, utiliser le sender du message
    if (messageData?.sender) {
      return messageData.sender
    }
    // Pour les nouveaux messages, utiliser le premier sender disponible
    if (availableSenders && availableSenders.length > 0) {
      return availableSenders[0]
    }
    return null
  }, [messageData?.sender, availableSenders])

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
          content: getHTML(defaultTheme, x, senderForHtml),
        },
      })
      .then((result) => {
        setMessage({ messageId: result.uuid, scope: x.metaData.scope })
        modalSendRef.current?.present()
        Keyboard.dismiss()
      })
  }
  return (
    <>
      <StickyBox webOnly style={{ zIndex: 10 }}>
        <YStack $gtSm={{ overflow: 'hidden', zIndex: 10 }}>
          <VoxHeader>
            <XStack alignItems="center" flex={1} width="100%">
              <XStack alignContent="flex-start">
                {router.canGoBack() ? (
                  <VoxButton
                    size="lg"
                    variant="text"
                    theme={!props?.edit ? 'orange' : undefined}
                    onPress={() => router.back()}
                  >
                    {props?.edit ? 'Quitter' : 'Annuler'}
                  </VoxButton>
                ) : (
                  <Link href="/publications" replace asChild={!isWeb}>
                    <VoxButton
                      size="lg"
                      variant="text"
                      theme={!props?.edit ? 'orange' : undefined}
                    >
                      {props?.edit ? 'Quitter' : 'Annuler'}
                    </VoxButton>
                  </Link>
                )}
              </XStack>
              <XStack flexGrow={1} justifyContent="center">
                <VoxHeader.Title icon={props?.edit ? PenLine : media.gtSm ? Speech : undefined}>{props?.edit ? 'Editer publication' : media.gtSm ? 'Nouvelle publication' : 'Publication'}</VoxHeader.Title>
              </XStack>
              <XStack>
                <VoxButton
                  size="lg"
                  loading={messageQuery.isPending}
                  disabled={messageQuery.isPending}
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
      <PageLayout
        webScrollable
        onPress={() => {
          editorRef.current?.unSelect()
        }}
      >
        <ConfirmationModal ref={modalSendRef} payload={message} defaultSender={senderForHtml as RestAvailableSender | null} isEdit={!!props?.edit} />
        <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
          <PageLayout.MainSingleColumn
            opacity={messageQuery.isPending ? 0.5 : 1}
            style={{ pointerEvents: messageQuery.isPending ? 'none' : 'auto' }}
            cursor={messageQuery.isPending ? 'progress' : 'auto'}
          >
            <MessageEditor
              theme={defaultTheme}
              ref={editorRef}
              defaultValue={props?.edit?.json_content ? JSON.parse(props.edit.json_content) : undefined}
              onSubmit={handleSubmit}
              displayToolbar={mode === 'edit'}
              messageId={props?.edit?.uuid}
              onDisplayToolbarChange={(displayToolbar) => {
                setMode(displayToolbar ? 'edit' : 'preview')
              }}
            />
          </PageLayout.MainSingleColumn>
        </BoundarySuspenseWrapper>
      </PageLayout>
    </>

  )
}

export default MessageEditorPage
