import React, { Suspense } from 'react'
import { Link } from 'expo-router'
import { isWeb, useMedia, YStack, YStackProps } from 'tamagui'
import { Sparkle } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import EventFilterForm from '@/features_next/events/components/EventFilterForm/EventFilterForm'

import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'

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

const EventsSideContent = () => {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const canCreate = isAuth && hasFeature ? hasFeature('events') : false
  const media = useMedia()

  return (
    <YStack gap="$medium">
      {canCreate && media.gtSm && (
        <Suspense>
          <NewEventBtn>Organiser un événement</NewEventBtn>
        </Suspense>
      )}
      <YStack>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default EventsSideContent
