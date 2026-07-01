import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import HERO_IMAGE_URI from '@/features/soutenir/assets/soutenir-gabriel-attal.jpg'

type SoutenirHeroImageProps = {
  isDesktop: boolean
  isSm: boolean
}

export default function SoutenirHeroImage({ isDesktop, isSm }: SoutenirHeroImageProps) {
  return (
    <YStack borderRadius={isSm ? 0 : '$medium'} overflow="hidden">
      <Image
        source={HERO_IMAGE_URI}
        contentFit="cover"
        contentPosition={isDesktop ? 'center' : 'top'}
        cachePolicy="memory-disk"
        style={{ width: '100%', aspectRatio: isDesktop ? 424 / 363 : 390 / 264 }}
      />
    </YStack>
  )
}
