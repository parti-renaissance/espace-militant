import { ComponentPropsWithoutRef, forwardRef, Fragment, useRef, useState } from 'react'
import { Dimensions } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useSubscribeEvent } from '@/services/events/hook'
import { RestItemEvent } from '@/services/events/schema'
import { Calendar, X } from '@tamagui/lucide-icons'
import { ScrollView, ScrollViewProps, useMedia, XStack } from 'tamagui'
import EventRegisterForm from './EventRegisterForm/EventRegisterForm'

type ButtonProps = ComponentPropsWithoutRef<typeof VoxButton> &
  Pick<RestItemEvent, 'uuid' | 'slug'> & {
    isPremium?: boolean
    userUuid?: string
  }
const Wrapper = forwardRef<ScrollView, ScrollViewProps>((x, r) => {
  const media = useMedia()
  //@ts-expect-error not good type for ref
  return media.gtMd ? <ScrollView ref={r} {...x} /> : <Fragment children={x.children} />
})

export const EventSubscribeButton = ({ uuid, slug, isPremium, userUuid, ...buttonProps }: ButtonProps) => {
  const { mutate, isPending } = useSubscribeEvent({ id: uuid, slug })
  const [open, setOpen] = useState(false)
  const media = useMedia()
  const modalScreenRef = useRef<ScrollView | null>(null)
  const sheetScrollRef = useRef<ScrollView | null>(null)

  const height = Dimensions.get('window').height * 0.8

  const handlePress = () => {
    if (userUuid) mutate()
    else setOpen(true)
  }
  return (
    <Fragment>
      {!userUuid ? (
        <ModalOrPageBase
          open={open}
          onClose={() => {
            setOpen(false)
          }}
          scrollRef={sheetScrollRef}
          header={
            <VoxHeader>
              <XStack justifyContent="space-between" alignItems="center" flex={1}>
                <Text.LG>M’inscrire à l’événement</Text.LG>
                <VoxButton iconLeft={X} variant="text" shrink onPress={() => setOpen(false)} />
              </XStack>
            </VoxHeader>
          }
        >
          <VoxCard.Content $gtMd={{ maxHeight: height, maxWidth: 390 }}>
            {media.gtMd ? (
              <XStack justifyContent="space-between" alignItems="center" flex={1} height={50}>
                <Text.LG>M’inscrire à l’événement</Text.LG>
                <VoxButton iconLeft={X} variant="text" shrink onPress={() => setOpen(false)} />
              </XStack>
            ) : null}
            <Wrapper ref={modalScreenRef}>
              <EventRegisterForm
                eventId={uuid}
                eventSlug={slug}
                onScrollTo={(x) => {
                  modalScreenRef.current?.scrollTo(x)
                  sheetScrollRef.current?.scrollTo(x)
                }}
              />
            </Wrapper>
          </VoxCard.Content>
        </ModalOrPageBase>
      ) : null}
      <VoxButton
        iconLeft={Calendar}
        variant="outlined"
        theme={isPremium ? 'yellow' : 'blue'}
        testID="event-subscribe-button"
        loading={isPending}
        onPress={handlePress}
        {...buttonProps}
      >
        M'inscrire
      </VoxButton>
    </Fragment>
  )
}
