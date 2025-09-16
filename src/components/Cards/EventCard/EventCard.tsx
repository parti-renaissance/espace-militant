import React, { ComponentProps, useMemo } from 'react'
import { ImageRequireSource } from 'react-native'
import { Button } from '@/components'
import { VoxAlertDialog } from '@/components/AlertDialog'
import { VoxButton } from '@/components/Button'
import VoxCard, { VoxCardAuthorProps, VoxCardDateProps, VoxCardFrameProps, VoxCardLocationProps } from '@/components/VoxCard/VoxCard'
import { useSession } from '@/ctx/SessionProvider'
import { useSubscribeEvent, useUnsubscribeEvent } from '@/services/events/hook'
import { RestEvent } from '@/services/events/schema'
import { useGetProfil } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { Calendar, CalendarCheck2, CalendarOff, Clock9, Eye, Sparkle, Users, XCircle } from '@tamagui/lucide-icons'
import { isPast } from 'date-fns'
import { Href, Link, router } from 'expo-router'
import { isWeb, XStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'

type VoxCardBasePayload = {
  id: string
  title: string
  tag: string
  image?: string | ImageRequireSource
  status?: RestEvent['status']
  isSubscribed?: boolean
  isCompleted?: boolean
  isOnline: boolean
  location?: VoxCardLocationProps['location']
  date: VoxCardDateProps
  editable: boolean
  edit_link?: string
  source?: string
} & ({ author: Partial<VoxCardAuthorProps>['author'] & { uuid?: string } } | { author: undefined })

export type EventVoxCardProps = {
  onShow?: () => void
  payload:
    | VoxCardBasePayload
    | ({
        isOnline: undefined | false
      } & VoxCardBasePayload &
        VoxCardLocationProps)
    | ({
        isOnline: true
      } & VoxCardBasePayload)
} & VoxCardFrameProps

type SubscribeEventButtonProps = {
  isSubscribed: boolean
  eventId: string
  outside?: boolean
} & ComponentProps<typeof Button> & {
  source?: string
    editData: {
      editable: boolean
      edit_link?: string
      isAuthor?: boolean
    }
  }

export const SubscribeEventButton = ({ isSubscribed, eventId: id, outside = false, editData, source, ...btnProps }: SubscribeEventButtonProps) => {
  const { session } = useSession()
  const { mutate: subscribe, isPending: isSubPending } = useSubscribeEvent({ id })
  const { mutate: unsubscribe, isPending: isUnSubPending } = useUnsubscribeEvent({ id })
  const handleSubscribe = useDebouncedCallback(() => (isSubscribed ? unsubscribe() : subscribe({})), 200)
  const outsideStyle = outside ? ({ size: 'lg', width: '100%' } as const) : {}
  const subscribeButton = isSubscribed ? (
    <VoxAlertDialog theme="blue" title="Se désinscrire" description={`Voulez-vous vraiment vous désinscrire de l'événement ?`} onAccept={handleSubscribe}>
      <VoxButton theme="blue" variant="outlined" loading={isUnSubPending} iconLeft={CalendarOff} {...btnProps} {...outsideStyle}>
        Me désinscrire
      </VoxButton>
    </VoxAlertDialog>
  ) : (
    <VoxButton
      variant="outlined"
      theme="blue"
      onPress={
        session
          ? handleSubscribe
          : () =>
              router.navigate({
                pathname: '/evenements/[id]',
                params: { id, source: source || undefined },
              })
      }
      iconLeft={CalendarCheck2}
      loading={isSubPending}
      {...btnProps}
      {...outsideStyle}
    >
      M'inscrire
    </VoxButton>
  )

  const editButton = (
    <Link href={editData.edit_link as Href} asChild={!isWeb}>
      <VoxButton variant="outlined" theme="purple" iconLeft={Sparkle} {...outsideStyle}>
        Gérer
      </VoxButton>
    </Link>
  )

  return (
    <XStack gap="$medium">
      {editData.editable ? editButton : null}
      {!editData.isAuthor ? subscribeButton : null}
    </XStack>
  )
}

const EventCard = ({ payload, onShow, ...props }: EventVoxCardProps) => {
  const { user: session } = useUserStore()
  const { data: user } = useGetProfil({ enabled: Boolean(session) })
  const isCancelled = payload.status === 'CANCELLED'
  const isPassed = isPast(payload.date.end ?? payload.date.start)
  const isAuthor = Boolean(user?.uuid === payload.author?.uuid && payload.author?.uuid)
  const canSubscribe = [
    !isPast(payload.date.end ?? payload.date.start),
    payload.isSubscribed !== undefined,
    !isCancelled,
    !payload.isCompleted || (payload.isCompleted && payload.isSubscribed),
  ].every(Boolean)

  const status = useMemo(() => {
    if (isCancelled) {
      return (
        <VoxCard.Chip theme="orange" icon={XCircle}>
          Annulée.
        </VoxCard.Chip>
      )
    } else if (isPassed) {
      return <VoxCard.Chip icon={Clock9}>Terminé</VoxCard.Chip>
    } else if (payload.isCompleted) {
      return <VoxCard.Chip icon={Users}>Complet</VoxCard.Chip>
    }
    return null
  }, [isCancelled, isPassed, payload.isCompleted])

  return (
    <VoxCard {...props}>
      <VoxCard.Content>
        <XStack justifyContent={'space-between'}>
          <VoxCard.Chip icon={Calendar} theme="blue">
            {payload.tag}
          </VoxCard.Chip>
          {status}
        </XStack>
        <VoxCard.Title>{payload.title}</VoxCard.Title>
        {payload.image ? <VoxCard.Image image={payload.image} /> : null}
        <VoxCard.Date {...payload.date} />
        {payload.isOnline ? <VoxCard.Visio /> : payload.location && <VoxCard.Location location={payload.location} />}
        {payload.author && <VoxCard.Author author={payload.author} />}
        <XStack justifyContent={'space-between'}>
          <Link href={`/evenements/${payload.id}&source=${payload.source}`} asChild={!isWeb}>
            <VoxButton variant="outlined" theme="gray" iconLeft={Eye}>
              Voir
            </VoxButton>
          </Link>

          <SubscribeEventButton
            editData={{
              editable: payload.editable,
              edit_link: payload.edit_link,
              isAuthor,
            }}
            disabled={!canSubscribe}
            isSubscribed={!!payload.isSubscribed}
            eventId={payload.id}
            source={payload.source}
          />
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default EventCard
