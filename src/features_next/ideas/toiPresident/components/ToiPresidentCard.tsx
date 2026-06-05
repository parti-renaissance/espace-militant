import { ComponentProps } from 'react';
import { Image } from 'expo-image';
import { useMedia, XStack, YStack } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Dices, Share2 } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard';

import GAME_IMAGE from '../assets/game-card.jpg';


export type ToiPresidentCardProps = ComponentProps<typeof YStack> & {
  onPlay?: () => void
  onShare?: () => void
}

export default function ToiPresidentCard({ onPlay, onShare, ...rest }: ToiPresidentCardProps) {
  const media = useMedia()
  const imageBlockHeight = media.sm ? 255 : 245

  return (
    <YStack borderRadius={24} overflow="hidden" position="relative" padding="$medium" width="100%" maxWidth={440} alignSelf="center" {...rest}>
      <YStack position="absolute" top={0} left={0} right={0} bottom={0}>
        <Image source={GAME_IMAGE} contentFit="cover" style={{ width: '100%', height: '100%' }} />
      </YStack>

      <LinearGradient
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        colors={['rgba(66, 62, 131, 0)', '$purple600']}
        locations={[0.5, 1]}
        start={[0, 0]}
        end={[0, 1]}
      />

      <YStack height={imageBlockHeight} marginBottom={-48} />

      <CallToActionCard
        title="Toi président - le jeu"
        description="150 propositions de réforme - que feriez vous si vous étiez Président ?"
        theme="purple"
        backgroundColor="$purple50"
        zIndex={4}
        marginTop="auto"
      >
        <XStack gap="$small" flexWrap="wrap">
          <VoxButton theme="purple" variant="outlined" iconLeft={Share2} onPress={onShare}>
            Partager
          </VoxButton>
          <VoxButton theme="purple" variant="contained" iconLeft={Dices} onPress={onPlay}>
            Faire une partie
          </VoxButton>
        </XStack>
      </CallToActionCard>
    </YStack>
  )
}
