import { ComponentProps } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { useDestructiveAlert } from '@/components/DestructiveAlert'
import { useCancelEvent, useDeleteEvent } from '@/services/events/hook'
import { RestFullEvent } from '@/services/events/schema'
import { StopCircle, Trash2 } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import { isEventCancelled } from '../utils'

type EventHandleButtonProps = {
  eventId: string
  scope: string
  buttonProps?: ComponentProps<typeof VoxButton>
}

export const CancelButton = (props: EventHandleButtonProps) => {
  const { mutateAsync, isPending } = useCancelEvent()
  const handlePress = useDebouncedCallback(() => {
    mutateAsync(props)
  }, 200)

  const { DestructiveAlertWrapper, present } = useDestructiveAlert({
    title: `Voulez-vous vraiment annuler l'évenement ?`,
    description: (
      <YStack gap="$small">
        <Text.MD semibold color="$orange5">
          Attention cette action est définitive !
        </Text.MD>
        <YStack>
          <Text.MD>Assurez vous qu'une modification ne suffise pas avant d'annuler.</Text.MD>
          <Text.MD>L'annulation sera communiqué à tout les inscrits.</Text.MD>
        </YStack>
      </YStack>
    ),
    onAccept: handlePress,
    isPending,
  })
  return (
    <DestructiveAlertWrapper>
      <VoxButton {...props.buttonProps} loading={isPending} iconLeft={StopCircle} onPress={present}>
        Annuler
      </VoxButton>
    </DestructiveAlertWrapper>
  )
}

export const DeleteButton = (props: EventHandleButtonProps) => {
  const { mutateAsync, isPending } = useDeleteEvent()
  const handlePress = useDebouncedCallback(() => {
    mutateAsync(props)
  }, 200)
  const { DestructiveAlertWrapper, present } = useDestructiveAlert({
    title: `Voulez-vous vraiment supprimer l'évenement ?`,
    description: `La suppression sera définitive !`,
    onAccept: handlePress,
  })
  return (
    <DestructiveAlertWrapper>
      <VoxButton {...props.buttonProps} onPress={present} loading={isPending} iconLeft={Trash2}>
        Supprimer
      </VoxButton>
    </DestructiveAlertWrapper>
  )
}

export default function (props: Omit<EventHandleButtonProps, 'eventId'> & { event: RestFullEvent }) {
  return isEventCancelled(props.event) ? null : (
    <XStack gap="$small">
      <CancelButton {...props} eventId={props.event.uuid} />
      {props.event.participants_count < 2 ? <DeleteButton {...props} eventId={props.event.uuid} /> : null}
    </XStack>
  )
}
