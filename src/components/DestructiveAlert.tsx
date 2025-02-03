import { ComponentRef, forwardRef, PropsWithChildren, useImperativeHandle, useRef } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import VoxSimpleModal from '@/components/VoxSimpleModal'
import { XStack, YStack } from 'tamagui'

type DestructiveAlertProps = {
  onAccept: () => void | (() => Promise<unknown>)
  onCancel?: () => void
  isPending?: boolean
  title: string
  description: string | React.ReactNode
}

type ModalRef = ComponentRef<typeof VoxSimpleModal>

export const DestructiveAlert = forwardRef<ModalRef, DestructiveAlertProps>((props, ref) => {
  const insideRef = useRef<ModalRef>(null)
  useImperativeHandle(ref, () => insideRef.current!)
  const handleCancel = () => {
    props.onCancel?.()
    insideRef.current?.close()
  }

  const handleAccept = async () => {
    Promise.resolve(props.onAccept()).then(() => {
      insideRef.current?.close()
    })
  }

  return (
    <VoxSimpleModal ref={insideRef}>
      <VoxCard.Content justifyContent="space-between" gap="$large" maxWidth={350} maxHeight={400}>
        <YStack gap="$medium">
          <Text.LG bold color="$orange7">
            {props.title}
          </Text.LG>
          {typeof props.description === 'string' ? <Text.MD>{props.description}</Text.MD> : props.description}
        </YStack>
        <XStack flex={1} gap="$medium">
          <VoxButton variant="outlined" flex={3} children="Non" onPress={handleCancel} theme="gray" />
          <VoxButton children="Oui" loading={props.isPending} flex={1} onPress={handleAccept} theme="orange" />
        </XStack>
      </VoxCard.Content>
    </VoxSimpleModal>
  )
})

export const useDestructiveAlert = (props: DestructiveAlertProps) => {
  const alertRef = useRef<ModalRef>(null)
  const Wrapper = ({ children }: PropsWithChildren) => (
    <>
      {children}
      <DestructiveAlert ref={alertRef} {...props} />
    </>
  )

  const present = () => alertRef.current?.present()

  return { DestructiveAlertWrapper: Wrapper, present }
}
