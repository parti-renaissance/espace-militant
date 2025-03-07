import React, { useRef, useState } from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import TestMessage from '@/features/message/data/test'
import { useCreateMessage } from '@/services/messages/hook'
import * as types from '@/services/messages/schema'
import { MailPlus } from '@tamagui/lucide-icons'
import { Link, router } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import MessageEditor, { defaultTheme, getHTML, MessageEditorRef } from '../../components/Editor'
import ModalSender from '../../components/ModalSender'
import ViewportModalSheet, { ViewportModalRef } from '../../components/ModalSender/ViewportModalSheet'

const dataTest = S.MessageSchema.safeParse(TestMessage)

const data = dataTest.success ? dataTest.data : undefined

const MessageEditorPage: React.FC = (props?: { edit?: types.RestPostMessageResponse }) => {
  const editorRef = useRef<MessageEditorRef>(null)
  const modalSendRef = useRef<ViewportModalRef>(null)
  const media = useMedia()
  const [message, setMessage] = useState<
    | {
        messageId: string
        scope: string
      }
    | undefined
  >(undefined)

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
          <StickyBox webOnly offsetTop={media.gtSm ? '$large' : undefined} style={{ zIndex: 10 }}>
            <YStack $gtSm={{ marginVertical: '$large', borderRadius: 50, overflow: 'hidden', zIndex: 10 }}>
              <VoxHeader borderRadius={20}>
                <XStack alignItems="center" flex={1} width="100%">
                  <XStack alignContent="flex-start">
                    <Link href={router.canGoBack() ? '../' : '/messages'} replace asChild={!isWeb}>
                      <VoxButton size="lg" variant="text" theme="orange">
                        Annuler
                      </VoxButton>
                    </Link>
                  </XStack>
                  <XStack flexGrow={1} justifyContent="center">
                    <VoxHeader.Title icon={MailPlus}>Message</VoxHeader.Title>
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
          </StickyBox>
          <MessageEditor theme={defaultTheme} ref={editorRef} defaultValue={data} onSubmit={handleSubmit} />
        </PageLayout.MainSingleColumn>
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

export default MessageEditorPage
