import { TouchableOpacity } from 'react-native'
import { Image, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'

import redirectToStore from '@/helpers/redirectToStore'

import appDownloadPhonesLarge from './Assets/app-download-phones-large.png'
import appDownloadPhonesMedium from './Assets/app-download-phones-medium.png'
import appStoreBadgeFr from './Assets/app-store-badge-fr.png'
import googlePlayBadgeFr from './Assets/google-play-badge-fr.png'

export type AppDownloadCTASize = 'large' | 'medium'

export interface AppDownloadCTAProps {
  size?: AppDownloadCTASize
}

type SectionKey = 'title' | 'phones' | 'badges'

type SizeConfig = {
  phonesImage: number
  phonesHeight: number
  badgeWidth: number
  badgeHeight: number
  paddingBottom?: '$medium'
  sections: readonly SectionKey[]
}

const SIZE_CONFIG = {
  large: {
    phonesImage: appDownloadPhonesLarge,
    phonesHeight: 300,
    badgeWidth: 115,
    badgeHeight: 40,
    paddingBottom: '$medium',
    sections: ['title', 'phones', 'badges'],
  },
  medium: {
    phonesImage: appDownloadPhonesMedium,
    phonesHeight: 185,
    badgeWidth: 115,
    badgeHeight: 40,
    paddingBottom: undefined,
    sections: ['title', 'badges', 'phones'],
  },
} as const satisfies Record<AppDownloadCTASize, SizeConfig>

function AppDownloadTitle() {
  return (
    <YStack pt="$medium" px="$medium">
      <Text.LG regular textAlign="center" textWrap="balance">
        <Text.LG>La campagne de Gabriel Attal</Text.LG> dans le creux de votre main
      </Text.LG>
    </YStack>
  )
}

type StoreBadgesProps = Readonly<Pick<SizeConfig, 'badgeWidth' | 'badgeHeight'>>

function StoreBadges({ badgeWidth, badgeHeight }: StoreBadgesProps) {
  return (
    <XStack justifyContent="center" alignItems="center" gap="$medium" px="$medium">
      <TouchableOpacity onPress={() => redirectToStore('ios')} accessibilityRole="button" accessibilityLabel="Télécharger dans l'App Store">
        <Image source={appStoreBadgeFr} resizeMode="contain" width={badgeWidth} height={badgeHeight} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => redirectToStore('android')} accessibilityRole="button" accessibilityLabel="Disponible sur Google Play">
        <Image source={googlePlayBadgeFr} resizeMode="contain" width={badgeWidth} height={badgeHeight} />
      </TouchableOpacity>
    </XStack>
  )
}

type PhonesPreviewProps = Readonly<Pick<SizeConfig, 'phonesImage' | 'phonesHeight'>>

function PhonesPreview({ phonesImage, phonesHeight }: PhonesPreviewProps) {
  return (
    <Image
      source={phonesImage}
      height={phonesHeight}
      width="100%"
      resizeMode="contain"
      alignSelf="center"
      accessibilityIgnoresInvertColors
      accessibilityLabel="Aperçu de l'application mobile avec code QR de téléchargement"
    />
  )
}

export default function AppDownloadCTA({ size = 'large' }: Readonly<AppDownloadCTAProps>) {
  const config = SIZE_CONFIG[size]

  const renderSection = (section: SectionKey) => {
    switch (section) {
      case 'title':
        return <AppDownloadTitle key="title" />
      case 'phones':
        return <PhonesPreview key="phones" phonesImage={config.phonesImage} phonesHeight={config.phonesHeight} />
      case 'badges':
        return <StoreBadges key="badges" badgeWidth={config.badgeWidth} badgeHeight={config.badgeHeight} />
    }
  }

  return (
    <VoxCard borderRadius="$medium">
      <VoxCard.Content>
        <YStack overflow="hidden" backgroundColor="$gray100" borderRadius="$small" gap="$large" paddingBottom={config.paddingBottom}>
          {config.sections.map(renderSection)}
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
