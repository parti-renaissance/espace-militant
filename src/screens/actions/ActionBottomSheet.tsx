import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { ActionCard, SubscribeButton } from '@/components/Cards'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useLazyRef } from '@/hooks/useLazyRef'
import { useAction } from '@/services/actions/hook'
import { ActionStatus, isFullAction } from '@/services/actions/schema'
import { ArrowLeft, PenLine } from '@tamagui/lucide-icons'
import { isBefore } from 'date-fns'
import { ScrollView, Sheet, XStack, YStack } from 'tamagui'
import ParticipantAvatar from './ActionParticipants'
import { mapPayload, useSheetPosition } from './utils'

type ActionBottomSheetProps = {
  actionQuery: ReturnType<typeof useAction>
  onPositionChange?: (position: number, percent: number) => void
  onOpenChange?: (open: boolean) => void
  onEdit?: () => void
}

export const SideActionList = ({ actionQuery, onEdit, onOpenChange }: Readonly<ActionBottomSheetProps>) => {
  const { setPosition } = useSheetPosition(1)
  const { data: action, isLoading } = actionQuery
  const isMyAction = action && isFullAction(action) && action.editable

  // const _position = !action ? 1 : position

  React.useEffect(() => {
    if (!action) {
      setPosition(1)
    }
  }, [action])

  const payload = useMemo(() => (action ? mapPayload(action) : null), [action])
  return (
    <XStack
      zIndex={1000}
      animation="quick"
      key="side-list"
      animateOnly={['transform']}
      transform={[{ translateX: action || actionQuery.isFetching ? 0 : '-100%' }]}
      position="absolute"
      width={500}
      left={0}
      bottom={0}
      top={0}
    >
      <YStack elevation={5} flex={1} backgroundColor={'$white1'}>
        <YStack p="$medium">
          <TouchableOpacity onPress={() => onOpenChange?.(false)}>
            <ArrowLeft size={30} color="$textPrimary" />
          </TouchableOpacity>
        </YStack>
        <ScrollView
          contentContainerStyle={{
            p: '$medium',
            gap: '$small',
          }}
          flex={1}
        >
          {payload && action ? (
            <ActionCard payload={payload} asFull $gtSm={{ borderWidth: 0, borderColor: '$white1' }}>
              {!isBefore(action.date, new Date()) && !isMyAction ? <SubscribeButton disabled={action.status === ActionStatus.CANCELLED} large isRegister={!!action?.user_registered_at} id={action.uuid} /> : null}
              {!isBefore(action.date, new Date()) && isMyAction ? (
                <VoxButton theme="purple" full size="lg" variant="soft" iconLeft={PenLine} pop onPress={onEdit}>
                  Editer
                </VoxButton>
              ) : null}
              {isFullAction(action) ? <VoxCard.Description markdown full children={action.description ?? ''} /> : <SkeCard.Description />}
              {isFullAction(action) ? (
                <>
                  <Text fontWeight="$5">{action.participants.length} inscrits :</Text>
                  <XStack flexWrap="wrap" gap="$medium" justifyContent="space-between">
                    {action.author && <ParticipantAvatar participant={action.author} />}
                    {action.participants
                      .filter((x) => {
                        if (!x?.adherent?.uuid) return true
                        return action.author?.uuid !== x.adherent.uuid
                      })
                      .map((participant) => (
                        <ParticipantAvatar key={participant.uuid} participant={participant} />
                      ))}
                  </XStack>
                </>
              ) : null}
            </ActionCard>
          ) : null}

          {payload === null && isLoading ? (
            <SkeCard>
              <SkeCard.Content>
                <SkeCard.Chip />
                <SkeCard.Title />
                <SkeCard.Description />
              </SkeCard.Content>
            </SkeCard>
          ) : null}
        </ScrollView>
      </YStack>
    </XStack>
  )
}

export function ActionBottomSheet({ actionQuery, onPositionChange, onOpenChange, onEdit }: Readonly<ActionBottomSheetProps>) {
  const { position, setPosition, handleHandlePress, defaultPosition } = useSheetPosition(1)
  const { data: action, isLoading } = actionQuery

  const isMyAction = action && isFullAction(action) && action.editable

  const _position = !action ? 1 : position

  React.useEffect(() => {
    if (!action) {
      setPosition(1)
    }
  }, [action])

  const snapPoints = useLazyRef<[number, number]>(() => [70, 50])

  const handlePositionChange = (position: number) => {
    setPosition(position)
    onPositionChange?.(position, snapPoints.current[position])
  }

  const handleOpeningChange = (open: boolean) => {
    setPosition(1)
    onOpenChange?.(open)
  }

  const payload = useMemo(() => (action ? mapPayload(action) : null), [action])

  return (
    <Sheet
      modal
      native
      open={!!action || isLoading}
      defaultPosition={defaultPosition}
      position={_position}
      onOpenChange={handleOpeningChange}
      onPositionChange={handlePositionChange}
      dismissOnOverlayPress={false}
      snapPoints={snapPoints.current}
      snapPointsMode="percent"
      dismissOnSnapToBottom
    >
      <Sheet.Frame borderTopLeftRadius={20} borderTopRightRadius={20} position="relative">
        <YStack onPress={handleHandlePress}>
          <Sheet.Handle backgroundColor="$textDisabled" mt="$medium" mb="$0" height={3} width={50} alignSelf="center" onPress={handleHandlePress} />
        </YStack>

        <Sheet.ScrollView
          scrollEnabled={position === 0}
          flex={1}
          contentContainerStyle={{
            pt: '$2',
            pb: '$12',
            gap: '$small',
          }}
        >
          {payload && action ? (
            <ActionCard payload={payload} inside asFull>
              {!isBefore(action.date, new Date()) && !isMyAction ? <SubscribeButton disabled={action.status === ActionStatus.CANCELLED} large isRegister={!!action?.user_registered_at} id={action.uuid} /> : null}
              {!isBefore(action.date, new Date()) && isMyAction ? (
                <VoxButton theme="purple" size="lg" variant="soft" iconLeft={PenLine} pop onPress={onEdit}>
                  Editer
                </VoxButton>
              ) : null}
              {isFullAction(action) ? <VoxCard.Description markdown full children={action.description ?? ''} /> : <SkeCard.Description />}
              {isFullAction(action) ? (
                <>
                  <Text fontWeight="$5">{action.participants.length} inscrits :</Text>
                  <XStack flexWrap="wrap" gap="$medium" justifyContent="space-between">
                    <ParticipantAvatar participant={action.author} />
                    {action.participants
                      .filter((x) => {
                        if (!x?.adherent?.uuid) return true
                        return action.author.uuid !== x.adherent.uuid
                      })
                      .map((participant) => (
                        <ParticipantAvatar key={participant.uuid} participant={participant} alignSelf="flex-start" />
                      ))}
                  </XStack>
                </>
              ) : null}
            </ActionCard>
          ) : null}

          {payload === null && isLoading ? (
            <SkeCard>
              <SkeCard.Content>
                <SkeCard.Chip />
                <SkeCard.Title />
                <SkeCard.Description />
              </SkeCard.Content>
            </SkeCard>
          ) : null}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
