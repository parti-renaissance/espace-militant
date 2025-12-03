import React, { Suspense } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BigSwitch, { OptionsTuple } from '@/components/base/BigSwitch'
import { VoxButton } from '@/components/Button'
import { useSession } from '@/ctx/SessionProvider'
import EventFilterForm from '@/features/events/components/EventFilterForm/EventFilterForm'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { Sparkle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { getTokenValue, isWeb, XStack, YStack, YStackProps, useMedia } from 'tamagui'

const options = [
  { label: 'Tous', value: 'events' },
  { label: 'Les miens', value: 'myEvents' },
] as OptionsTuple

const NewEventBtn = ({ children, ...props }: YStackProps & { children: string }) => {
  const { hasFeature } = useGetExecutiveScopes()
  if (!hasFeature('events')) return null
  return (
    <YStack {...props}>
      <Link href="/evenements/creer" asChild={!isWeb}>
        <VoxButton variant="soft" size="xl" theme="purple" iconLeft={Sparkle}>
          {children}
        </VoxButton>
      </Link>
    </YStack>
  )
}

const EventsHeader = ({ mode, value, onChange }: { mode: 'list' | 'aside'; value: 'events' | 'myEvents'; onChange: (x: 'events' | 'myEvents') => void }) => {
  const insets = useSafeAreaInsets()
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const canCreate = isAuth && hasFeature ? hasFeature('events') : false
  const media = useMedia()

  // Responsive padding horizontal selon le mode et la présence du bouton
  const paddingLeft = mode === 'list' ? (media.sm ? '$small' : '$xxlarge') : undefined
  const paddingRight = media.sm ? '$small' : '$xxlarge'

  return (
    <YStack
      bg="$textSurface"
      gap="$medium"
      pb="$medium"
      paddingTop={mode === 'list' ? (isAuth ? insets.top : 0) + getTokenValue('$medium', 'space') : undefined}
    >
      {isAuth && (
        <XStack
          pl={paddingLeft}
          pr={paddingRight}
          gap={mode === 'aside' ? '$medium' : '$small'}
          flexDirection={mode === 'aside' ? 'column-reverse' : 'row'}
        >
          <XStack flex={2}>
            <BigSwitch options={options} value={value} onChange={onChange} />
          </XStack>
          {canCreate && (
            <Suspense>
              <NewEventBtn paddingBottom={mode === 'aside' ? '$medium' : undefined}>
                {mode === 'list' ? 'Créer' : 'Organiser un événement'}
              </NewEventBtn>
            </Suspense>
          )}
        </XStack>
      )}
      <YStack pl={mode === 'list' ? (media.sm ? '$small' : '$xxlarge') : undefined} pr={media.sm ? '$small' : '$xxlarge'} height={50}>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default EventsHeader
