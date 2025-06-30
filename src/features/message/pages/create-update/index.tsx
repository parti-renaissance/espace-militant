import React, { useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { useCreateMessage } from '@/services/messages/hook'
import * as types from '@/services/messages/schema'
import { PenLine, Speech } from '@tamagui/lucide-icons'
import { Link, router } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import MessageEditor, { defaultTheme, getHTML, MessageEditorRef } from '../../components/Editor'
import ModalSender from '../../components/ModalSender'
import { ViewportModalRef } from '../../components/ModalSender/ViewportModalSheet'
import BigSwitch from '@/components/base/BigSwitch'

const MessageEditorPage = (props?: { edit?: types.RestGetMessageContentResponse; scope?: string }) => {
  const editorRef = useRef<MessageEditorRef>(null)
  const modalSendRef = useRef<ViewportModalRef>(null)
  const media = useMedia()
  const [message, setMessage] = useState<
    | {
      messageId: string
      scope: string
    }
    | undefined
  >(props?.edit ? { messageId: props.edit.uuid!, scope: props.scope! } : undefined)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  const messageQuery = useCreateMessage({ uuid: props?.edit?.uuid })

  const handleSubmit = (x: S.Message) => {
    return messageQuery
      .mutateAsync({
        scope: x.metaData.scope ?? '',
        payload: {
          type: x.metaData.scope,
          subject: x.metaData.subject,
          label: x.metaData.subject,
          json_content: JSON.stringify(x),
          content: getHTML(defaultTheme, x),
        },
      })
      .then((result) => {
        setMessage({ messageId: result.uuid, scope: x.metaData.scope })
        modalSendRef.current?.present()
        Keyboard.dismiss()
      })
  }
  return (
    <PageLayout
      webScrollable
      onPress={() => {
        editorRef.current?.unSelect()
      }}
    >
      <ModalSender ref={modalSendRef} payload={message} />
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <PageLayout.MainSingleColumn
          opacity={messageQuery.isPending ? 0.5 : 1}
          pointerEvents={messageQuery.isPending ? 'none' : 'auto'}
          cursor={messageQuery.isPending ? 'progress' : 'auto'}
        >
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
                      <Link href="/" replace asChild={!isWeb}>
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
                      variant="text"
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
            <YStack maxWidth={550} marginHorizontal='auto' width="100%" height={76} $sm={{ px: '$medium', py: '$small', height: 60 }} backgroundColor="$textSurface" justifyContent='center' py="$medium">
              <BigSwitch
                options={[
                  { label: 'Édition', value: 'edit' },
                  { label: 'Aperçu', value: 'preview' },
                ]}
                value={mode}
                onChange={x => setMode(x as 'edit' | 'preview')}
              />
            </YStack>
          </StickyBox>
          <MessageEditor
            theme={defaultTheme}
            ref={editorRef}
            defaultValue={props?.edit?.json_content ? JSON.parse(props.edit.json_content) : undefined}
            onSubmit={handleSubmit}
            displayToolbar={mode === 'edit'}
          />
        </PageLayout.MainSingleColumn>
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

export default MessageEditorPage
