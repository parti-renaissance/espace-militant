import type { ImageSourcePropType } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { styled, useMedia, View, XStack, YStack } from 'tamagui'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import type { FooterAction } from '../types'

const FOOTER_LABELS: Record<FooterAction, string> = {
  next: 'Suivant',
  prev: 'Précédent',
  passer: 'Passer',
  adherer: 'Adhérer',
  'continuer-sans-adherer': 'Continuer sans adhérer',
  'cest-note': "C'est noté",
}

const Title = styled(Text, {
  fontSize: 24,
  $gtSm: {
    fontSize: 20,
  },
  bold: true,
  color: '$textPrimary',
  textAlign: 'center',
  textWrap: 'balance',
})

const StepperBar = styled(XStack, {
  width: '100%',
  height: 4,
  gap: 4,
})

const GRADIENT_BLUE = ['#EFF7FF', '#B2D8FF'] as const
const GRADIENT_PURPLE = ['#F9F3FF', '#E0CAF3'] as const

type OnboardFooterButtonProps = {
  action: FooterAction
  theme: 'blue' | 'purple'
  onPress: () => void
}

function OnboardFooterButton({ action, theme, onPress }: OnboardFooterButtonProps) {
  const isNext = action === 'next'
  const isPrev = action === 'prev'
  const isPasser = action === 'passer'
  const label = FOOTER_LABELS[action]
  const isPrimary = isNext || action === 'adherer' || action === 'cest-note'
  const isOutlined = isPrev || action === 'continuer-sans-adherer'

  const variant = isPasser || (!isPrimary && !isOutlined) ? 'text' : isOutlined ? 'outlined' : 'contained'

  return (
    <VoxButton
      variant={variant}
      theme={theme}
      size="lg"
      onPress={onPress}
      iconLeft={isPrev ? ArrowLeft : undefined}
      iconRight={isNext ? ArrowRight : undefined}
      width="100%"
    >
      {label}
    </VoxButton>
  )
}

type OnboardStepLayoutProps = {
  title: string
  illustration: ImageSourcePropType
  backgroundImage?: ImageSourcePropType
  footer: { left?: FooterAction; right: FooterAction }
  stepIndex: number
  totalSteps: number
  onFooterAction: (action: FooterAction) => void
  theme?: 'blue' | 'purple'
  Description?: React.ReactNode | React.ReactNode[]
  buttonDirection?: 'row' | 'column'
}

export default function OnboardStepLayout({
  title,
  illustration,
  backgroundImage,
  footer,
  stepIndex,
  totalSteps,
  onFooterAction,
  theme = 'blue',
  Description,
  buttonDirection = 'row',
}: OnboardStepLayoutProps) {
  const media = useMedia()
  const gradientColors = theme === 'purple' ? GRADIENT_PURPLE : GRADIENT_BLUE
  const stepColor = theme === 'purple' ? '$purple5' : '$blue5'
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient colors={gradientColors} start={[0, 0]} end={[0, 1]} style={{ flex: 1, userSelect: 'none' }}>
      <YStack gap="$medium" width={media.gtSm ? 520 : '100%'} height={media.gtSm ? 520 : '100%'} position="relative" justifyContent="space-between">
        {backgroundImage && (
          <>
            <YStack position="absolute" top={0} bottom={0} left={0} right={0} zIndex={0} justifyContent="flex-end">
              <ImageBackground source={backgroundImage} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="memory-disk" />
            </YStack>
            <LinearGradient
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
              colors={['#B2D8FF00', gradientColors[1], gradientColors[1]]}
              start={[0, 0]}
              end={[0, 1]}
            ></LinearGradient>
          </>
        )}

        <YStack gap="$medium" px={24} pt={24 + insets.top}>
          <Text.MD secondary semibold>
            Bienvenue sur l'application Renaissance
          </Text.MD>
          <StepperBar>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <XStack key={i} flex={1} height="100%" bg={stepColor} opacity={i <= stepIndex ? 1 : 0.2} borderRadius={2} />
            ))}
          </StepperBar>
        </YStack>

        <YStack flex={1} gap="$medium" zIndex={1}>
          <YStack px={24} gap="$medium" pt={media.gtSm ? 0 : '$medium'}>
            <Title>{title}</Title>
            {Description}
          </YStack>
          <YStack flex={1} alignItems="center" justifyContent="center" minHeight={120} pointerEvents="none" userSelect="none">
            <Image source={illustration} style={{ flex: 1, width: '100%', height: '100%' }} contentFit="contain" cachePolicy="memory-disk" />
          </YStack>
        </YStack>

        <View flexDirection={buttonDirection === 'column' ? 'column' : 'row'} gap={10} zIndex={1} px={24} pb={24} width="100%">
          <YStack flex={1} flexBasis={buttonDirection === 'row' ? 0 : undefined} minWidth={0} alignItems="stretch">
            <OnboardFooterButton action={footer.left ?? 'passer'} theme={theme} onPress={() => onFooterAction(footer.left ?? 'passer')} />
          </YStack>
          <YStack flex={1} flexBasis={buttonDirection === 'row' ? 0 : undefined} minWidth={0} alignItems="stretch">
            <OnboardFooterButton action={footer.right} theme={theme} onPress={() => onFooterAction(footer.right)} />
          </YStack>
        </View>
      </YStack>
    </LinearGradient>
  )
}
