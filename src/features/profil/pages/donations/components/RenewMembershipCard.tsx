import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { getHumanFormattedDate } from '@/utils/date'
import { Download, RotateCw } from '@tamagui/lucide-icons'
import { getYear } from 'date-fns'
import { Link } from 'expo-router'
import { isWeb, XStack, YStack } from 'tamagui'
import type { CommonMembershipCardProps } from './types'

export default function (props: CommonMembershipCardProps) {
  const { isPending, open: handleAdhesionLink } = useOpenExternalContent({ slug: 'adhesion' })
  return (
    <>
      <VoxCard inside backgroundColor="$yellow1">
        <VoxCard.Content pr="$large">
          <XStack gap="$space" flex={1}>
            <YStack gap="$medium" flex={1}>
              <VoxCard.Chip outlined theme="yellow">
                Cotisation à renouveler
              </VoxCard.Chip>
              <YStack gap="$small" flex={1}>
                <Text.MD semibold multiline>
                  Renouvelez votre cotisation pour l’année {getYear(new Date())} pour garder vos droits d’adhérent.
                </Text.MD>
                {props.last_membership_donation ? (
                  <Text.SM secondary>Dernière cotisation le {getHumanFormattedDate(props.last_membership_donation)}</Text.SM>
                ) : null}
              </YStack>
              <XStack gap="$small" flexWrap="wrap">
                <VoxButton size="lg" theme="yellow" disabled={isPending} onPress={handleAdhesionLink()}>
                  Me mettre à jour
                </VoxButton>
                <Link href="https://doc.parti.re/bulletin-adhesion.pdf" target="_blank" asChild={!isWeb}>
                  <VoxButton size="sm" theme="yellow" variant="text" iconLeft={Download}>
                    Bulletin papier
                  </VoxButton>
                </Link>
              </XStack>
            </YStack>
            <YStack justifyContent="center">
              <RotateCw size="$7" color="$yellow6" strokeWidth={1} />
            </YStack>
          </XStack>
        </VoxCard.Content>
      </VoxCard>
      <VoxCard bg="$textSurface" borderColor={'$colorTransparent'} inside display={props.full ? 'flex' : 'none'}>
        <VoxCard.Content>
          <Text fontWeight="$7">Pourquoi rester à jour de cotisation ?</Text>
          <Text>Je finance notre ancrage local</Text>
          <Text.SM secondary multiline>
            Les cotisations d’adhérents permettent de nous ancrer localement et durablement par une organisation décentralisée. Elles sont intégralement
            reversées aux Assemblées départementales qui sont autonômes budgétairement.
          </Text.SM>

          <Text>Je prends part à notre orientation politique</Text>
          <Text.SM secondary multiline>
            Seuls les adhérents à jour de cotisation sont consultés sur des questions de fond comme ce fut le cas en 2023 concernant la réforme de nos
            institutions ou des questions européennes.
          </Text.SM>

          <Text>Je participe aux élections internes</Text>
          <Text.SM secondary multiline>
            Seuls les adhérents à jour de cotisation peuvent participer à l’élection du Conseil national, du bureau de leur Assemblée départementale ou de celui
            de leur Comité.
          </Text.SM>
        </VoxCard.Content>
      </VoxCard>
    </>
  )
}
