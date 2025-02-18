import React, { Suspense } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BigSwitch, { OptionsTuple } from '@/components/base/BigSwitch'
import { VoxButton } from '@/components/Button'
import { useSession } from '@/ctx/SessionProvider'
import EventFilterForm from '@/features/events/components/EventFilterForm/EventFilterForm'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { Sparkle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { getTokenValue, isWeb, XStack, YStack, YStackProps } from 'tamagui'

const options = [
  { label: 'Tous', value: 'events' },
  { label: 'Les miens', value: 'myEvents' },
] as OptionsTuple

const NewEventBtn = ({ children, ...props }: YStackProps & { children: string }) => {
  const { hasFeature } = useGetExecutiveScopes()
  if (hasFeature('events') === false) {
    return null
  }
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

const EventsHeader = ({ mode, ...props }: { mode: 'list' | 'aside'; value: 'events' | 'myEvents'; onChange: (x: 'events' | 'myEvents') => void }) => {
  const insets = useSafeAreaInsets()
  const { isAuth } = useSession()

  return (
    <YStack
      bg="$textSurface"
      gap="$medium"
      pb="$medium"
      paddingTop={mode === 'list' ? (isAuth ? insets.top : 0) + getTokenValue('$medium', 'space') : undefined}
    >
      <XStack
        pl={mode === 'list' ? '$medium' : undefined}
        pr={mode === 'aside' ? '$medium' : undefined}
        gap={mode === 'aside' ? '$medium' : '$small'}
        display={isAuth ? 'flex' : 'none'}
        flexDirection={mode === 'aside' ? 'column-reverse' : 'row'}
      >
        {isAuth ? (
          <XStack flex={2}>
            <BigSwitch options={options} value={props.value} onChange={props.onChange} />
          </XStack>
        ) : null}
        {isAuth ? (
          <Suspense>
            <NewEventBtn paddingRight={mode === 'list' ? '$medium' : undefined} paddingBottom={mode === 'aside' ? '$medium' : undefined}>
              {mode === 'list' ? ' Créer' : 'Organiser un événement'}
            </NewEventBtn>
          </Suspense>
        ) : null}
      </XStack>
      <YStack pl={mode === 'list' ? '$medium' : undefined} pr="$medium" height={50}>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default EventsHeader
