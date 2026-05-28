import { ComponentProps } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useMedia, XStack, YStack } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Dices, Share2 } from '@tamagui/lucide-icons'
import Text from '@/components/base/Text';
import { VoxButton } from '@/components/Button';
import { PLAAK_44_BOLD } from '../../../../theme/fonts';
import GAME_IMAGE from '../assets/game-icon.png';
import ToiPresidentArrowLeft from './ToiPresidentArrowLeft';
import ToiPresidentArrowRight from './ToiPresidentArrowRight';


const PURPLE_PRIMARY = '#4555d1'

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
        colors={['#9EACF7', '#716AE7']}
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

      <YStack
        backgroundColor="#F5F6FF"
        borderRadius={16}
        padding="$medium"
        gap="$medium"
        zIndex={4}
        marginTop="auto"
      >
        <YStack gap="$small">
          <Text fontFamily={PLAAK_44_BOLD} fontSize={20} color="#27221F" letterSpacing={-0.8}>
            Toi président - le jeu
          </Text>
          <Text.SM color="#6E6764" multiline>
            150 propositions de réforme - que feriez vous si vous étiez Président ?
          </Text.SM>
        </YStack>
        <XStack gap="$small" flexWrap="wrap">
          <VoxButton
            variant="outlined"
            iconLeft={Share2}
            onPress={onShare}
            borderColor={PURPLE_PRIMARY}
            textColor={PURPLE_PRIMARY}
          >
            Partager
          </VoxButton>
          <VoxButton
            iconLeft={Dices}
            onPress={onPlay}
            backgroundColor={PURPLE_PRIMARY}
            textColor="$white1"
            hoverStyle={{ backgroundColor: '#3a48b8' }}
            pressStyle={{ backgroundColor: '#3a48b8' }}
          >
            Faire une partie
          </VoxButton>
        </XStack>
      </YStack>
    </YStack>
  )
}
