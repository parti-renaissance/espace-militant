import React from 'react'
import Text from '@/components/base/Text'
import { ActionCard } from '@/components/Cards'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import EmptyState from '@/screens/actions/EmptyAction'
import { RestAction } from '@/services/actions/schema'
import { useGetProfil } from '@/services/profile/hook'
import { ScrollView, Sheet, useMedia, XStack, YStack } from 'tamagui'
import { mapPayload } from './utils'
import type { useSheetPosition } from './utils'

type ActionListProps = {
  actions: RestAction[]
  loading: boolean
  setActiveAction: (action: RestAction | null) => void
  onEdit: (action: RestAction) => void
}

export const ActionList = (props: ActionListProps) => {
  const user = useGetProfil()
  const isMyAction = (action: RestAction) => action?.author?.uuid === user?.data?.uuid
  if (props.loading) {
    return [1, 2, 3, 4, 5].map((i) => (
      <SkeCard key={i}>
        <SkeCard.Content>
          <SkeCard.Chip />
          <SkeCard.Title />
          <SkeCard.Description />
          <SkeCard.Actions />
        </SkeCard.Content>
      </SkeCard>
    ))
  }
  return props.actions.length === 0 ? (
    <EmptyState state="actions" />
  ) : (
    props.actions.map((action) => (
      <ActionCard
        key={action.uuid}
        isMyAction={isMyAction(action)}
        payload={mapPayload(action)}
        onShow={() => props.setActiveAction(action)}
        onEdit={() => props?.onEdit(action)}
      />
    ))
  )
}

type ContainerListProps = ActionListProps & { postionConfig: ReturnType<typeof useSheetPosition>; open: boolean; onOpenChange: (x: boolean) => void }

export const SideList = (props: ContainerListProps & { children: React.ReactNode }) => {
  const media = useMedia()
  return (
    <XStack
      zIndex={100}
      animation="quick"
      key="side-list"
      animateOnly={['transform']}
      transform={[{ translateX: props.open ? 0 : '-100%' }]}
      position="absolute"
      flex={1}
      left={0}
      bottom={0}
      top={0}
    >
      <YStack elevation={5} width={media.gtSm ? 500 : undefined} flex={1} backgroundColor={'$gray1'}>
        <ScrollView
          contentContainerStyle={{
            p: '$medium',
            gap: '$medium',
          }}
          flex={1}
        >
          <ActionList {...props} />
        </ScrollView>
      </YStack>
      <YStack position="absolute" left="100%">
        {props.children}
      </YStack>
    </XStack>
  )
}

export const BottomSheetList = ({ postionConfig, onOpenChange, open, ...props }: ContainerListProps) => {
  const { position, setPosition, handleHandlePress, defaultPosition } = postionConfig
  const handlePositionChange = (position: number) => {
    setPosition(position)
  }

  const handleOpeningChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setPosition(1)
    }
  }

  const pageMode = position === 0

  return (
    <Sheet
      open={open}
      native
      defaultOpen={true}
      defaultPosition={defaultPosition}
      position={position}
      dismissOnOverlayPress={false}
      onPositionChange={handlePositionChange}
      onOpenChange={handleOpeningChange}
      snapPoints={['70%', 60]}
      snapPointsMode="mixed"
    >
      <Sheet.Frame borderTopLeftRadius={pageMode ? 0 : 20} borderTopRightRadius={pageMode ? 0 : 20}>
        <YStack onPress={handleHandlePress}>
          <Sheet.Handle backgroundColor="$textDisabled" mt="$medium" mb="$0" height={3} width={50} alignSelf="center" onPress={handleHandlePress} />
          <XStack justifyContent="center" p="$medium">
            <Text fontWeight={'$6'} color="$textDisabled" textAlign="center">
              Toutes les actions
            </Text>
          </XStack>
        </YStack>
        <Sheet.ScrollView
          scrollEnabled={position === 0}
          flex={1}
          contentContainerStyle={{
            pt: '$small',
            pb: '$small',
            backgroundColor: '$gray1',
            gap: '$small',
          }}
        >
          {/* {data} */}
          <ActionList {...props} />
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
