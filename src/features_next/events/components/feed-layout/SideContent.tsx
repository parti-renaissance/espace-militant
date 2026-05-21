import React, { Suspense } from 'react'
import { Link } from 'expo-router'
import { isWeb, useMedia, YStack, YStackProps } from 'tamagui'
import { Sparkle, Zap } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import EventFilterForm from '@/features_next/events/components/forms/EventFilterForm/EventFilterForm'

import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const NewEventBtn = ({ children, ...props }: YStackProps & { children: string }) => {
  const { hasFeature } = useGetExecutiveScopes()
  if (!hasFeature(FEATURES.EVENTS)) return null
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

const NewActionBtn = ({ children, ...props }: YStackProps & { children: string }) => (
  <YStack {...props}>
    <Link href="/actions/creer" asChild={!isWeb}>
      <VoxButton variant="soft" size="xl" theme="green" iconLeft={Zap}>
        {children}
      </VoxButton>
    </Link>
  </YStack>
)

const HubSideContent = () => {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const canCreate = isAuth && hasFeature ? hasFeature(FEATURES.EVENTS) : false
  const media = useMedia()

  return (
    <YStack gap="$medium">
      {media.gtSm && (
        <Suspense>
          {canCreate ? <NewEventBtn>Organiser un événement</NewEventBtn> : null}
          {isAuth ? <NewActionBtn>Créer une action</NewActionBtn> : null}
        </Suspense>
      )}
      <YStack>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default HubSideContent
