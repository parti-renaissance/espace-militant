import React, { Suspense } from 'react'
import BigSwitch, { OptionsTuple } from '@/components/base/BigSwitch'
import { VoxButton } from '@/components/Button'
import { useSession } from '@/ctx/SessionProvider'
import EventFilterForm from '@/features_next/events/components/EventFilterForm/EventFilterForm'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { Sparkle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { isWeb, XStack, YStack, YStackProps, useMedia } from 'tamagui'

const options = [
  { label: 'Tous', value: 'events' },
  { label: 'Les miens', value: 'myEvents' },
] as OptionsTuple

const NewEventBtn = ({ children, ...props }: YStackProps & { children: string }) => {
  const { hasFeature } = useGetExecutiveScopes()
  if (!hasFeature('events')) return null
  return (
    <YStack {...props}>
      <Link href="/(militant)/evenements/creer" asChild={!isWeb}>
        <VoxButton variant="soft" size="xl" theme="purple" iconLeft={Sparkle}>
          {children}
        </VoxButton>
      </Link>
    </YStack>
  )
}

const EventsHeader = ({ mode, value, onChange }: { mode: 'compact' | 'aside'; value: 'events' | 'myEvents'; onChange: (x: 'events' | 'myEvents') => void }) => {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const canCreate = isAuth && hasFeature ? hasFeature('events') : false
  const media = useMedia()

  const isAside = mode === 'aside'

  return (
    <YStack
      gap="$medium"
      pb="$medium"
      px={media.sm ? '$medium' : 0}
    >
      {isAuth && (
        <XStack
          gap={isAside ? '$medium' : '$small'}
          flexDirection={isAside ? 'column-reverse' : 'row'}
        >
          <XStack flex={isAside ? undefined : 2}>
            <BigSwitch options={options} value={value} onChange={onChange} />
          </XStack>
          {canCreate && (
            <Suspense>
              <NewEventBtn paddingBottom={isAside ? '$medium' : undefined}>
                {isAside ? 'Organiser un événement' : (media.sm ? 'Créer' : 'Organiser un événement')}
              </NewEventBtn>
            </Suspense>
          )}
        </XStack>
      )}
      <YStack height={50}>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default EventsHeader
