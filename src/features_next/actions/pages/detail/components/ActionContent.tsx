import React, { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import { Clock9, PenLine, XCircle, Zap } from '@tamagui/lucide-icons'
import { isBefore } from 'date-fns'
import { capitalize } from 'lodash'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { SubscribeButton } from '@/components/Cards'
import { ContentBackButton } from '@/components/ContentBackButton'
import { FloatingBackButton } from '@/components/FloatingBackButton'
import { DetailShareGroup } from '@/components/ShareGroup/DetailShareGroup'
import VoxCard from '@/components/VoxCard/VoxCard'
import { formatActionDetailTitle } from '@/features_next/actions/utils/formatActionDetailTitle'

import { ActionStatus, RestActionFull } from '@/services/actions/schema'

import { mapPayload } from '../../../utils/mapPayload'
import { ActionDetailMapBlock } from './ActionDetailMap'
import ParticipantAvatar from './ParticipantAvatar'

export type ActionContentProps = {
  data: RestActionFull
}

type ActionInnerProps = {
  data: RestActionFull
  payload: ReturnType<typeof mapPayload>
  isPassed: boolean
  isCancelled: boolean
  isMyAction: boolean
  onEdit: () => void
}

const ActionParticipantsSection = ({ data }: Pick<ActionInnerProps, 'data'>) => (
  <YStack gap="$medium" pb="$medium">
    <Text.MD secondary>
      {data.participants.length ?? 1} {`Participant${data.participants.length > 1 ? 's' : ''}`} :
    </Text.MD>
    <XStack flexWrap="wrap" gap="$medium" justifyContent="flex-start">
      {data.author ? <ParticipantAvatar participant={data.author} /> : null}
      {data.participants
        .filter((x) => {
          if (!x?.adherent?.uuid) return true
          return data.author?.uuid !== x.adherent.uuid
        })
        .map((participant) => (
          <ParticipantAvatar key={participant.uuid} participant={participant} />
        ))}
    </XStack>
  </YStack>
)

const ActionInfo = ({
  data,
  payload,
  isPassed,
  isCancelled,
  includeParticipants = false,
}: Pick<ActionInnerProps, 'data' | 'payload' | 'isPassed' | 'isCancelled'> & { includeParticipants?: boolean }) => {
  const media = useMedia()
  const detailTitle = useMemo(() => formatActionDetailTitle({ date: data.date, type: data.type }), [data.date, data.type])

  return (
    <>
      <ActionDetailMapBlock action={data} />
      <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$small" flexWrap="wrap">
          <VoxCard.Chip theme="green" icon={Zap}>
            {capitalize(payload.tag)}
          </VoxCard.Chip>
          {isCancelled ? (
            <VoxCard.Chip theme="orange" icon={XCircle}>
              Annulée
            </VoxCard.Chip>
          ) : null}
          {!isCancelled && isPassed ? <VoxCard.Chip icon={Clock9}>Terminé</VoxCard.Chip> : null}
        </XStack>
        <VoxCard.Title underline={false}>{detailTitle}</VoxCard.Title>
        {data.description ? (
          <>
            <VoxCard.Description markdown full children={data.description} />
            {includeParticipants ? <VoxCard.Separator /> : null}
          </>
        ) : null}
        {includeParticipants ? <ActionParticipantsSection data={data} /> : null}
      </YStack>
    </>
  )
}

const ActionMeta = ({ payload }: Pick<ActionInnerProps, 'payload'>) => {
  const media = useMedia()

  return (
    <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
      <VoxCard.Date {...payload.date} />
      <VoxCard.Location location={payload.location} />
    </YStack>
  )
}

const ActionButtons = ({
  data,
  isPassed,
  isCancelled,
  isMyAction,
  onEdit,
}: Pick<ActionInnerProps, 'data' | 'isPassed' | 'isCancelled' | 'isMyAction' | 'onEdit'>) => {
  const buttonProps = { variant: 'contained' as const, full: true, flex: 1, width: '100%' as const, size: 'xl' as const, shrink: false as const }

  if (isMyAction && !isPassed) {
    return (
      <XStack gap={8} width="100%">
        <YStack flex={1}>
          <VoxButton theme="pink" {...buttonProps} variant="soft" iconLeft={PenLine} onPress={onEdit}>
            Éditer
          </VoxButton>
        </YStack>
      </XStack>
    )
  }

  return (
    <XStack gap={8} width="100%">
      <YStack flex={1}>
        {!isCancelled && isPassed ? (
          <VoxButton variant="contained" theme="gray" iconLeft={Clock9} size="xl" full>
            Terminé
          </VoxButton>
        ) : (
          <SubscribeButton disabled={data.status === ActionStatus.CANCELLED} large isRegister={Boolean(data.user_registered_at)} id={data.uuid} />
        )}
      </YStack>
    </XStack>
  )
}

const MobileBottomCTA = (props: ActionInnerProps) => {
  const insets = useSafeAreaInsets()
  const content = <ActionButtons {...props} />

  if (!content) return null

  return (
    <YStack
      position={isWeb ? 'fixed' : 'absolute'}
      bg="$white1"
      bottom={0}
      left="$0"
      width="100%"
      elevation="$1"
      p={16}
      pb={insets.bottom > 0 ? insets.bottom : 16}
    >
      {content}
    </YStack>
  )
}

const MobileLayout = (props: ActionInnerProps) => (
  <>
    <Layout.Main maxWidth={892}>
      <LayoutScrollView padding={false}>
        <YStack paddingBottom={100}>
          <VoxCard overflow="visible" pb={66} borderWidth={0}>
            <ActionInfo {...props} />
            <VoxCard.Separator mx={'$medium'} />
            <ActionMeta payload={props.payload} />
            <VoxCard.Separator mx={'$medium'} />
            <YStack px="$medium" gap="$medium">
              <ActionParticipantsSection data={props.data} />
              <DetailShareGroup action={props.data} />
            </YStack>
          </VoxCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
    <FloatingBackButton />
    <MobileBottomCTA {...props} />
  </>
)

const DesktopLayout = (props: ActionInnerProps) => (
  <Layout.Main maxWidth={892}>
    <LayoutScrollView>
      <ContentBackButton fallbackPath="/" />
      <YStack gap="$medium">
        <VoxCard>
          <XStack alignItems="flex-start" py="$medium">
            <YStack flex={1} flexShrink={1} gap="$medium" px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
              <ActionInfo {...props} includeParticipants />
            </YStack>
            <YStack maxWidth={320} px="$medium" gap="$medium">
              <ActionButtons {...props} />
              <VoxCard.Separator />
              <ActionMeta payload={props.payload} />
              <DetailShareGroup action={props.data} />
            </YStack>
          </XStack>
        </VoxCard>
      </YStack>
    </LayoutScrollView>
  </Layout.Main>
)

export function ActionContent({ data }: ActionContentProps) {
  const media = useMedia()
  const router = useRouter()
  const payload = useMemo(() => mapPayload(data), [data])
  const isPassed = isBefore(data.date, new Date())
  const isCancelled = data.status === ActionStatus.CANCELLED
  const isMyAction = data.editable

  const onEdit = () => {
    router.push(`/actions/${data.uuid}/modifier`)
  }

  const innerProps: ActionInnerProps = {
    data,
    payload,
    isPassed,
    isCancelled,
    isMyAction,
    onEdit,
  }

  return media.sm ? <MobileLayout {...innerProps} /> : <DesktopLayout {...innerProps} />
}
