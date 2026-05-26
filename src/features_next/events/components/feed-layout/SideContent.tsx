import React, { Suspense } from 'react'
import { Link } from 'expo-router'
import { isWeb, useMedia, YStack, YStackProps } from 'tamagui'
import { Sparkle, Zap } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import EventFilterForm from '@/features_next/events/components/forms/EventFilterForm/EventFilterForm'

import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const NewEventBtn = ({ children, ...props }: YStackProps & { children: string }) => (
  <YStack {...props}>
    <Link href="/evenements/creer" asChild={!isWeb}>
      <VoxButton variant="soft" size="xl" theme="pink" iconLeft={Sparkle}>
        {children}
      </VoxButton>
    </Link>
  </YStack>
)

const NewActionBtn = ({ children, ...props }: YStackProps & { children: string }) => (
  <YStack {...props}>
    <Link href="/actions/creer" asChild={!isWeb}>
      <VoxButton variant="soft" size="xl" theme="green" iconLeft={Zap}>
        {children}
      </VoxButton>
    </Link>
  </YStack>
)

type HubSideContentProps = {
  onOpenOrganizeModal?: () => void
}

const HubSideContent = ({ onOpenOrganizeModal }: HubSideContentProps) => {
  const { isAuth } = useSession()
  const { hasFeature } = useUserScopeFeatures({ enabled: isAuth })
  const showCreateEvent = isAuth && hasFeature(FEATURES.EVENTS)
  const showCreateAction = isAuth && hasFeature(FEATURES.ACTIONS)
  const showOrganize = showCreateEvent || showCreateAction
  const media = useMedia()

  return (
    <YStack gap="$medium">
      {media.gtSm && (
        <Suspense>
          {onOpenOrganizeModal && showOrganize ? (
            <YStack>
              <VoxButton variant="soft" size="xl" theme="pink" width="100%" iconLeft={Sparkle} onPress={onOpenOrganizeModal}>
                Organiser un événement
              </VoxButton>
            </YStack>
          ) : (
            <>
              {showCreateEvent ? <NewEventBtn>Organiser un événement</NewEventBtn> : null}
              {showCreateAction ? <NewActionBtn>Créer une action</NewActionBtn> : null}
            </>
          )}
        </Suspense>
      )}
      <YStack>
        <EventFilterForm />
      </YStack>
    </YStack>
  )
}

export default HubSideContent
