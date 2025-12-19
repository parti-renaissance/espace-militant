import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { Image } from 'expo-image'
import { useMedia, useWindowDimensions, YStack } from 'tamagui'

const illuFormations = require('../assets/illu-formations.png')

export function JoinMembershipCard() {
  const media = useMedia()
  const windowDimensions = useWindowDimensions()
  const { isPending, open: openAdhesion } = useOpenExternalContent({
    slug: 'adhesion',
    utm_campaign: 'formations'
  })

  return (
    <VoxCard overflow="hidden">
      <VoxCard.Content
        flexDirection={media.sm ? 'column' : 'row'}
        height={media.sm ? windowDimensions.height - 60 : 420}
        alignItems="center"
        gap={0}
        p={0}
        pb={media.sm ? "$large" : 0}
      >
        <YStack height={media.sm ? undefined : 420} width={media.sm ? '100%' : undefined} flexGrow={1} >
          <Image
            source={illuFormations}
            contentFit="cover"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </YStack>
        <YStack gap="$medium" alignItems="center" justifyContent="center" width="100%" maxWidth={320} px="$medium" py="$xxlarge">
          <Text.MD semibold secondary textAlign="center">
            Les formations sont réservées aux adhérents à jour de cotisation.
          </Text.MD>
          <Text.SM secondary textAlign="center">
            Rejoignez-nous pour y accéder.
          </Text.SM>
          <YStack>
            <VoxButton
              theme="yellow"
              size="lg"
              variant="outlined"
              disabled={isPending}
              onPress={openAdhesion()}
            >
              Adhérer pour accéder
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export function RenewMembershipCard() {
  const media = useMedia()
  const windowDimensions = useWindowDimensions()
  const { isPending, open: openAdhesion } = useOpenExternalContent({
    slug: 'adhesion',
    utm_campaign: 'formations'
  })

  return (
    <VoxCard overflow="hidden">
      <VoxCard.Content
        flexDirection={media.sm ? 'column' : 'row'}
        height={media.sm ? windowDimensions.height - 60 : 420}
        alignItems="center"
        gap={0}
        p={0}
        pb={media.sm ? "$large" : 0}
      >
        <YStack height={media.sm ? undefined : 420} width={media.sm ? '100%' : undefined} flexGrow={1} >
          <Image
            source={illuFormations}
            contentFit="cover"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </YStack>
        <YStack gap="$medium" alignItems="center" justifyContent="center" width="100%" maxWidth={320} px="$medium" py="$xxlarge">
          <Text.MD semibold secondary textAlign="center">
            Les formations sont réservées aux adhérents à jour de cotisation.
          </Text.MD>
          <Text.SM secondary textAlign="center">
            Renouvelez votre adhésion pour y accéder.
          </Text.SM>
          <YStack>
            <VoxButton
              theme="yellow"
              size="lg"
              variant="outlined"
              disabled={isPending}
              onPress={openAdhesion()}
            >
              Me mettre à jour pour accéder
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export function AccessFormationsCard() {
  const media = useMedia()
  const windowDimensions = useWindowDimensions()
  const { isPending, open: openFormations } = useOpenExternalContent({
    slug: 'formation',
    utm_campaign: 'formations'
  })

  return (
    <VoxCard overflow="hidden">
      <VoxCard.Content
        flexDirection={media.sm ? 'column' : 'row'}
        height={media.sm ? windowDimensions.height - 60 : 420}
        alignItems="center"
        gap={0}
        p={0}
        pb={media.sm ? "$large" : 0}
      >
        <YStack height={media.sm ? undefined : 420} width={media.sm ? '100%' : undefined} flexGrow={1} >
          <Image
            source={illuFormations}
            contentFit="cover"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </YStack>
        <YStack gap="$medium" alignItems="center" justifyContent="center" width="100%" maxWidth={320} px="$medium" py="$xxlarge">
          <Text.MD semibold secondary textAlign="center">
            Les formations sont réservées aux adhérents à jour de cotisation.
          </Text.MD>
          <Text.SM secondary textAlign="center">
            Vous êtes adhérent à jour.
          </Text.SM>
          <YStack>
            <VoxButton
              theme="blue"
              size="lg"
              variant="outlined"
              disabled={isPending}
              onPress={openFormations({ state: '/formations' })}
            >
              Accéder aux formations
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
