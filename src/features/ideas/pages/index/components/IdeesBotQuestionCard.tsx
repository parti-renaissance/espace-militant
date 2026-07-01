import { Platform, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { XStack, YStack } from 'tamagui'
import { ArrowUpRight, BotMessageSquare, Sparkles } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import NUIT_IMAGE from '@/features/ideas/assets/nuit-ia-badge.gif'

export type IdeesBotQuestionCardProps = {
  onPress?: () => void
  badge?: string
}

export default function IdeesBotQuestionCard({ onPress, badge = 'Nuit' }: IdeesBotQuestionCardProps) {
  const { width: windowWidth } = useWindowDimensions()
  const hideRobot = Platform.OS === 'web' && windowWidth <= 1065

  return (
    <YStack backgroundColor="$purple200" borderRadius={16} padding="$medium" gap="$medium">
      <YStack backgroundColor="$purple50" borderRadius={8} padding="$medium" gap="$medium" position="relative">
        <YStack gap="$small" cursor="pointer" onPress={onPress}>
          {badge ? (
            <XStack
              borderWidth={1}
              borderColor="$purple600"
              borderRadius={999}
              paddingHorizontal={8}
              paddingVertical={4}
              gap="$xsmall"
              alignItems="center"
              alignSelf="flex-start"
            >
              <Sparkles size={12} color="$purple600" />
              <Text.SM semibold color="$purple600">
                {badge}
              </Text.SM>
            </XStack>
          ) : null}
          <Text fontSize={14} fontWeight="500" color="$gray900" lineHeight={22}>
            Une question sur nos idées ?
          </Text>
          <Text.SM color="$gray600" maxWidth={hideRobot ? undefined : 190} multiline>
            Notre IA répond à toutes vos interrogations et vous explique nos propositions.
          </Text.SM>
        </YStack>

        <YStack
          position="absolute"
          top={-30}
          right={50}
          width={100}
          height={250}
          zIndex={0}
          cursor="pointer"
          onPress={onPress}
          animation="medium"
          opacity={hideRobot ? 0 : 1}
          x={hideRobot ? 60 : 0}
          scale={hideRobot ? 0.9 : 1}
          $sm={{ top: -15, right: 0, width: 100 }}
        >
          <Image source={NUIT_IMAGE} contentFit="contain" style={{ width: '100%', height: '100%' }} pointerEvents="none" />
        </YStack>

        <XStack
          position="relative"
          zIndex={1}
          backgroundColor="$white1"
          borderWidth={1}
          borderColor="$textOutline"
          borderRadius={100}
          paddingLeft="$medium"
          paddingRight="$xsmall"
          paddingVertical="$xsmall"
          alignItems="center"
          gap="$small"
          cursor="pointer"
          onPress={onPress}
          animation="medium"
          hoverStyle={{ backgroundColor: '$purple100' }}
        >
          <BotMessageSquare size={16} color="$purple400" />
          <Text.MD flex={1} color="$gray600" numberOfLines={1}>
            Posez votre question ici
          </Text.MD>
          <VoxButton size="md" shrink iconLeft={ArrowUpRight} onPress={onPress} theme="purple" variant="contained" />
        </XStack>
      </YStack>
    </YStack>
  )
}
