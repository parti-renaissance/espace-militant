import { ComponentProps } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useMedia, XStack, YStack } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Dices, Share2 } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button';
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard';
import GAME_IMAGE from '../../assets/game-icon.png';
import ToiPresidentArrowLeft from './ToiPresidentArrowLeft';
import ToiPresidentArrowRight from './ToiPresidentArrowRight';

export type ToiPresidentCardProps = ComponentProps<typeof YStack> & {
  onPlay?: () => void
  onShare?: () => void
}

export default function ToiPresidentCard({ onPlay, onShare, ...rest }: ToiPresidentCardProps) {
  const media = useMedia()
  const isMobile = media.sm
  const { width: windowWidth } = useWindowDimensions()
  const hideArrows = Platform.OS === 'web' && windowWidth <= 1145
  const centerImage = isMobile || hideArrows
  const imageWidth = isMobile ? 250 : 300
  const imageHeight = isMobile ? 205 : 245

  return (
    <YStack borderRadius={24} overflow="hidden" position="relative" padding="$medium" {...rest}>
      <LinearGradient
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        colors={['$purple400', '$purple500']}
        start={[0, 0]}
        end={[0, 1]}
      />

      <YStack
        position="absolute"
        left={8}
        top={80}
        zIndex={1}
        pointerEvents="none"
        animation="medium"
        opacity={hideArrows ? 0 : 1}
        x={hideArrows ? -60 : 0}
        scale={hideArrows ? 0.9 : 1}
      >
        <ToiPresidentArrowLeft />
      </YStack>

      <YStack
        width="100%"
        marginBottom={-48}
        zIndex={2}
        alignItems={centerImage ? 'center' : 'flex-start'}
        paddingLeft={centerImage ? 0 : 52}
      >
        <Image
          source={GAME_IMAGE}
          contentFit="contain"
          style={{
            width: imageWidth,
            height: imageHeight,
            opacity: 1,
          }}
        />
      </YStack>

      <YStack
        position="absolute"
        right={8}
        top={120}
        zIndex={3}
        pointerEvents="none"
        animation="medium"
        opacity={hideArrows ? 0 : 1}
        x={hideArrows ? 60 : 0}
        scale={hideArrows ? 0.9 : 1}
      >
        <ToiPresidentArrowRight />
      </YStack>

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
