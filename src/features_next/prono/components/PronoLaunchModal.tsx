import { TouchableOpacity } from 'react-native'
import { Image as TamaguiImage, XStack, YStack } from 'tamagui'
import { CheckCircle2 } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import appStoreBadge from '@/components/ProfileCards/AppDownloadCTA/Assets/app-store-badge-fr.png'
import googlePlayBadge from '@/components/ProfileCards/AppDownloadCTA/Assets/google-play-badge-fr.png'
import Title from '@/components/Title/Title'

import redirectToStore from '@/helpers/redirectToStore'

import { PronoMatchView, PronoScore } from '../model'
import { PronoSignupCardContent } from './PronoSignupCard'

export type PronoLaunchVariant = 'download' | 'app'

const ACCENT_BLUE = '#4555D1'
const CHECK_GREEN = '#1F9D55'

function LaunchTitle({ variant }: { variant: PronoLaunchVariant }) {
  if (variant === 'download') {
    return (
      <Title size="h2">
        <Title.Highlight>SUIVEZ LES RÉSULTATS</Title.Highlight>
        <Title.Break />
        <Title.Text>EN TÉLÉCHARGEANT L'APP 📲</Title.Text>
      </Title>
    )
  }

  return (
    <Title size="h2">
      <Title.Highlight>FÉLICITATIONS</Title.Highlight>
      <Title.Text> 🎉</Title.Text>
      <Title.Break />
      <Title.Text>LE DÉFI EST LANCÉ !</Title.Text>
    </Title>
  )
}

function StoreButtons() {
  return (
    <XStack justifyContent="center" alignItems="center" gap="$medium">
      <TouchableOpacity onPress={() => redirectToStore('ios')} accessibilityRole="button" accessibilityLabel="Télécharger dans l'App Store">
        <TamaguiImage source={appStoreBadge} width={135} height={46} objectFit="contain" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => redirectToStore('android')} accessibilityRole="button" accessibilityLabel="Disponible sur Google Play">
        <TamaguiImage source={googlePlayBadge} width={135} height={46} objectFit="contain" />
      </TouchableOpacity>
    </XStack>
  )
}

type PronoLaunchModalProps = {
  open: boolean
  onClose: () => void
  variant: PronoLaunchVariant
  match: PronoMatchView
  playerPrediction: PronoScore
}

export default function PronoLaunchModal({ open, onClose, variant, match, playerPrediction }: PronoLaunchModalProps) {
  const description =
    variant === 'download'
      ? 'Pour être notifié en direct du résultat de votre défi, installez l’application Attal Président.'
      : 'Vous serez notifié du résultat de votre défi en temps réel ! N’oubliez pas d’activer les notifications pour ne rien rater.'

  return (
    <ModalOrBottomSheet open={open} onClose={onClose} allowDrag>
      <YStack width="100%" maxWidth={420} alignSelf="center" padding="$large" gap="$medium" $gtSm={{ width: 380 }}>
        <XStack alignItems="center" gap="$xsmall">
          <CheckCircle2 size={18} color={CHECK_GREEN} />
          <Text.SM semibold color={CHECK_GREEN}>
            Pronostic enregistré
          </Text.SM>
        </XStack>

        <LaunchTitle variant={variant} />

        <PronoSignupCardContent match={match} playerPrediction={playerPrediction} />

        <Text.MD regular color="$textPrimary" lineHeight={22}>
          {description}
        </Text.MD>

        {variant === 'download' ? (
          <>
            <StoreButtons />
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text.MD semibold color={ACCENT_BLUE} textAlign="center">
                Fermer
              </Text.MD>
            </TouchableOpacity>
          </>
        ) : (
          <VoxButton
            variant="contained"
            size="xl"
            full
            backgroundColor={ACCENT_BLUE}
            textColor="white"
            hoverStyle={{ backgroundColor: '#3a48b0' }}
            pressStyle={{ backgroundColor: '#3a48b0' }}
            onPress={onClose}
          >
            Fermer
          </VoxButton>
        )}
      </YStack>
    </ModalOrBottomSheet>
  )
}
