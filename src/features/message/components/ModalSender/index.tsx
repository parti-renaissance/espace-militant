import { forwardRef, useImperativeHandle, useRef } from 'react'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestPostMessageResponse } from '@/services/files/schema'
import { useGetIsMessageTilSync, useSendMessage } from '@/services/messages/hook'
import { Eye, Send } from '@tamagui/lucide-icons'
import { Href, Link } from 'expo-router'
import { isWeb, Spinner, YStack } from 'tamagui'
import ViewportModalSheet, { ViewportModalRef } from './ViewportModalSheet'

const SenderView = (props: { payload: RestPostMessageResponse; scope: string }) => {
  const { mutate, isPending } = useSendMessage({
    uuid: props.payload.uuid,
  })

  const handleSendMessage = () => {
    mutate({ scope: props.scope })
  }

  const handleSendTestMessage = () => {
    mutate({ scope: props.scope, test: true })
  }

  return (
    <YStack flex={1} minHeight={300}>
      <Link href={props.payload.preview_link! as Href} asChild={isWeb}>
        <VoxButton variant="outlined" iconLeft={Eye}>
          Prévisualiser
        </VoxButton>
      </Link>
      <VoxButton variant="outlined" iconLeft={Send} loading={isPending} disabled={isPending} onPress={handleSendTestMessage}>
        Envoyer test
      </VoxButton>
      <VoxButton theme="purple" variant="outlined" iconLeft={Send} loading={isPending} disabled={isPending} onPress={handleSendMessage}>
        Envoyer
      </VoxButton>
    </YStack>
  )
}

const ModalSender = forwardRef<ViewportModalRef, { payload?: { messageId: string; scope: string } }>((props, ref) => {
  const modalSheetRef = useRef<ViewportModalRef>(null)
  const query = useGetIsMessageTilSync({ payload: props.payload })

  useImperativeHandle(ref, () => modalSheetRef.current!)

  return (
    <ViewportModalSheet ref={modalSheetRef}>
      <VoxCard.Content>
        {!query.data ? (
          <YStack justifyContent="center" alignItems="center" flex={1} minHeight={300}>
            <Spinner color="$blue5" />
          </YStack>
        ) : (
          <SenderView payload={query.data} scope={props.payload!.scope!} />
        )}

        <VoxButton theme="purple" variant="outlined" onPress={() => modalSheetRef.current?.dismiss()}>
          Annuler
        </VoxButton>
      </VoxCard.Content>
    </ViewportModalSheet>
  )
})

export default ModalSender
