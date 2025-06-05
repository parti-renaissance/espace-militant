import { VoxButton } from '@/components/Button'
import VoxCard, { VoxCardAttendeesProps, VoxCardAuthorProps, VoxCardDateProps, VoxCardFrameProps, VoxCardLocationProps } from '@/components/VoxCard/VoxCard'
import { useSubscribeAction, useUnsubscribeAction } from '@/services/actions/hook/useActions'
import { ActionStatus } from '@/services/actions/schema'
import { Clock9, Eye, Sparkle, XCircle, Zap, ZapOff } from '@tamagui/lucide-icons'
import { isBefore } from 'date-fns'
import { capitalize } from 'lodash'
import { XStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'

export type ActionVoxCardProps = {
  onShow?: () => void
  onEdit?: () => void
  isMyAction?: boolean
  payload: {
    id?: string
    tag: string
    status?: ActionStatus
    isSubscribed: boolean
    date: VoxCardDateProps
  } & VoxCardLocationProps &
    VoxCardAuthorProps &
    VoxCardAttendeesProps
} & VoxCardFrameProps

const ActionCard = ({
  payload,
  onShow,
  onEdit,
  asFull = false,
  isMyAction,
  ...props
}: ActionVoxCardProps & { asFull?: boolean; children?: React.ReactNode }) => {
  const isPassed = isBefore(payload.date.start, new Date())
  const isCancelled = payload.status === ActionStatus.CANCELLED
  return (
    <VoxCard {...props}>
      <VoxCard.Content>
        <XStack justifyContent="space-between">
          <VoxCard.Chip theme="green" icon={Zap}>
            {capitalize(payload.tag)}
          </VoxCard.Chip>
          {isCancelled && (
            <VoxCard.Chip theme="orange" icon={XCircle}>
              Annulée
            </VoxCard.Chip>
          )}
          {!isCancelled && isPassed && <VoxCard.Chip icon={Clock9}>Terminé</VoxCard.Chip>}
        </XStack>
        <VoxCard.Location asTitle location={payload.location} />
        <VoxCard.Date {...payload.date} />
        {!asFull && payload.attendees && <VoxCard.Attendees attendees={payload.attendees} />}
        {!asFull && <VoxCard.Author author={payload.author} />}
        {!asFull && (
          <XStack justifyContent="space-between">
            <VoxButton variant="outlined" theme="gray" onPress={onShow} iconLeft={Eye}>
              Voir
            </VoxButton>
            {isMyAction ? (
              <VoxButton disabled={isCancelled || isPassed} variant="outlined" theme="purple" pop iconLeft={Sparkle} onPress={onEdit}>
                Gérer
              </VoxButton>
            ) : (
              <SubscribeButton disabled={isCancelled || isPassed} isRegister={payload.isSubscribed} id={payload.id} />
            )}
          </XStack>
        )}
        {asFull && props.children}
      </VoxCard.Content>
    </VoxCard>
  )
}

export function SubscribeButton({ isRegister, id, large, ...props }: { isRegister: boolean; id?: string; large?: boolean; disabled?: boolean }) {
  const subscribe = useSubscribeAction(id)
  const unsubscribe = useUnsubscribeAction(id)
  const isloaderSub = subscribe.isPending || unsubscribe.isPending

  const handleOnSubscribe = useDebouncedCallback((isRegister: boolean) => {
    isRegister ? unsubscribe.mutate() : subscribe.mutate()
  }, 300)
  return (
    <VoxButton
      disabled={props.disabled}
      variant={'outlined'}
      theme="green"
      animation="quick"
      size={large ? 'lg' : 'md'}
      full={large}
      onPress={() => handleOnSubscribe(isRegister)}
      iconLeft={isRegister ? ZapOff : Zap}
      loading={isloaderSub}
    >
      {isRegister ? 'Me désinscrire' : "M'inscrire"}
    </VoxButton>
  )
}

export default ActionCard
