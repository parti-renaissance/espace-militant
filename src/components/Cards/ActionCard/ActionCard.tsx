import { XStack } from 'tamagui'
import { Clock9, Eye, Sparkle, XCircle, Zap, ZapOff } from '@tamagui/lucide-icons'
import { isBefore } from 'date-fns'
import { usePathname } from 'expo-router'
import { capitalize } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'

import { VoxButton } from '@/components/Button'
import { useSession } from '@/ctx/SessionProvider'
import VoxCard, { VoxCardAttendeesProps, VoxCardAuthorProps, VoxCardDateProps, VoxCardFrameProps, VoxCardLocationProps } from '@/components/VoxCard/VoxCard'

import { useSubscribeAction, useUnsubscribeAction } from '@/services/actions/hook'
import { ActionStatus } from '@/services/actions/schema'

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
              <VoxButton disabled={isCancelled || isPassed} variant="outlined" theme="pink" iconLeft={Sparkle} onPress={onEdit}>
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

export function SubscribeButton({ isRegister, id, large, disabled }: { isRegister: boolean; id?: string; large?: boolean; disabled?: boolean }) {
  const { isAuth, signIn } = useSession()
  const pathname = usePathname()
  const subscribe = useSubscribeAction(id)
  const unsubscribe = useUnsubscribeAction(id)
  const isloaderSub = subscribe.isPending || unsubscribe.isPending

  const handleOnSubscribe = useDebouncedCallback((isRegister: boolean) => {
    if (!isAuth) {
      signIn({ state: pathname })
      return
    }
    isRegister ? unsubscribe.mutate() : subscribe.mutate()
  }, 300)
  return (
    <VoxButton
      disabled={disabled}
      variant={isRegister || disabled ? 'outlined' : 'contained'}
      theme="green"
      animation="quick"
      size={large ? 'xl' : 'md'}
      full={large}
      onPress={() => handleOnSubscribe(isRegister)}
      iconLeft={isRegister ? ZapOff : Zap}
      loading={isloaderSub}
    >
      {isRegister ? 'Me désinscrire' : 'Participer'}
    </VoxButton>
  )
}

export default ActionCard
