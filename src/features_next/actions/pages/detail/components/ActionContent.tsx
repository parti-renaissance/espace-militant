import React, { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft, Clock9, PenLine, XCircle, Zap } from '@tamagui/lucide-icons'
import { isBefore } from 'date-fns'
import { capitalize } from 'lodash'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { SubscribeButton } from '@/components/Cards'
import { ContentBackButton } from '@/components/ContentBackButton'
import { DetailShareGroup } from '@/components/ShareGroup/DetailShareGroup'
import VoxCard from '@/components/VoxCard/VoxCard'
import { formatActionDetailTitle } from '@/features_next/actions/utils/formatActionDetailTitle'

import ParticipantAvatar from '@/screens/actions/ActionParticipants'
import { mapPayload } from '@/screens/actions/utils'
import { ActionStatus, RestActionFull } from '@/services/actions/schema'

import { ActionDetailMapBlock } from './ActionDetailMap'

export type ActionContentProps = {
  data: RestActionFull
  onEdit?: () => void
}

const FloatingBackButton = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const fallbackPath: Href = '/'

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(fallbackPath)
    }
  }

  return (
    <YStack position="absolute" top={insets.top + 16} left={16} zIndex={100}>
      <VoxButton variant="contained" theme="gray" iconLeft={ArrowLeft} size="md" shrink onPress={handleBack} />
    </YStack>
  )
}

type ActionInnerProps = ActionContentProps & {
  payload: ReturnType<typeof mapPayload>
  isPassed: boolean
  isCancelled: boolean
  isMyAction: boolean
}

const ActionParticipantsSection = ({ data }: Pick<ActionInnerProps, 'data'>) => (
  <YStack gap="$medium" pb="$medium">
    <Text fontWeight="$5">{data.participants.length} inscrits :</Text>
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

const ActionButtons = ({ data, isPassed, isMyAction, onEdit }: Pick<ActionInnerProps, 'data' | 'isPassed' | 'isMyAction' | 'onEdit'>) => {
  const buttonProps = { variant: 'contained' as const, full: true, flex: 1, width: '100%' as const, size: 'xl' as const, shrink: false as const }

  if (isPassed) return null

  if (isMyAction && onEdit) {
    return (
      <XStack gap={8} width="100%">
        <YStack flex={1}>
          <VoxButton theme="purple" {...buttonProps} variant="soft" iconLeft={PenLine} pop onPress={onEdit}>
            Éditer
          </VoxButton>
        </YStack>
      </XStack>
    )
  }

  if (!isMyAction) {
    return (
      <XStack gap={8} width="100%">
        <YStack flex={1}>
          <SubscribeButton disabled={data.status === ActionStatus.CANCELLED} large isRegister={Boolean(data.user_registered_at)} id={data.uuid} />
        </YStack>
      </XStack>
    )
  }

  return null
}

const MobileBottomCTA = (props: ActionInnerProps) => {
  const insets = useSafeAreaInsets()
  const content = <ActionButtons {...props} />

  if (!content) return null

  return (
    <YStack position="absolute" bg="$white1" bottom={0} left="$0" width="100%" elevation="$1" p={16} pb={insets.bottom}>
      {content}
    </YStack>
  )
}

const MobileLayout = (props: ActionInnerProps) => {
  return (
    <>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView padding={false}>
          <YStack paddingBottom={100}>
            <VoxCard overflow="visible" pb={66} borderWidth={0}>
              <ActionInfo {...props} />
              <VoxCard.Separator />
              <ActionMeta payload={props.payload} />
              <VoxCard.Separator />
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
}

const DesktopLayout = (props: ActionInnerProps) => {
  return (
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
}

export function ActionContent({ data, onEdit }: ActionContentProps) {
  const media = useMedia()
  const payload = useMemo(() => mapPayload(data), [data])
  const isPassed = isBefore(data.date, new Date())
  const isCancelled = data.status === ActionStatus.CANCELLED
  const isMyAction = data.editable

  const innerProps: ActionInnerProps = {
    data,
    onEdit,
    payload,
    isPassed,
    isCancelled,
    isMyAction,
  }

  return media.sm ? <MobileLayout {...innerProps} /> : <DesktopLayout {...innerProps} />
}
