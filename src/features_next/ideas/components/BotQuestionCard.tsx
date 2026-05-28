import { useState } from 'react'
import { Platform, TextInput, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { useTheme, XStack, YStack } from 'tamagui'
import { ArrowUpRight, BotMessageSquare, Moon } from '@tamagui/lucide-icons'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ROBOT_IMAGE from '../assets/robot-icon.png'

const PURPLE_PRIMARY = '#4555d1'
const PURPLE_BUTTON = '#8d9aff'

export type BotQuestionCardProps = {
  onSubmit?: (question: string) => void
  onPress?: () => void
  badge?: string
}

export default function BotQuestionCard({ onSubmit, onPress, badge = 'Nuit' }: BotQuestionCardProps) {
  const [value, setValue] = useState('')
  const theme = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const hideRobot = Platform.OS === 'web' && windowWidth <= 1065

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setValue('')
  }

  return (
    <YStack backgroundColor="#D8DCFF" borderRadius={16} padding="$medium" gap="$medium">
      <YStack backgroundColor="#F5F6FF" borderRadius={8} padding="$medium" gap="$medium" position="relative">
        <YStack gap="$small" cursor="pointer" onPress={onPress}>
          {badge ? (
            <XStack
              borderWidth={1}
              borderColor={PURPLE_PRIMARY}
              borderRadius={999}
              paddingHorizontal={8}
              paddingVertical={4}
              gap="$xsmall"
              alignItems="center"
              alignSelf="flex-start"
            >
              <Moon size={12} color={PURPLE_PRIMARY} />
              <Text.SM semibold color={PURPLE_PRIMARY}>
                {badge}
              </Text.SM>
            </XStack>
          ) : null}
          <Text fontSize={14} fontWeight="500" color="#27221F" lineHeight={22}>
            Une question sur nos idées ?
          </Text>
          <Text.SM color="#6E6764" maxWidth={hideRobot ? undefined : 190} multiline>
            Notre IA répond à toutes vos interrogations et vous explique nos propositions.
          </Text.SM>
        </YStack>

        <YStack
          position="absolute"
          top={-10}
          right={0}
          width={180}
          height={240}
          zIndex={0}
          cursor="pointer"
          onPress={onPress}
          animation="medium"
          opacity={hideRobot ? 0 : 1}
          x={hideRobot ? 60 : 0}
          scale={hideRobot ? 0.9 : 1}
          $sm={{ top: -15, right: -20, width: 190 }}
        >
          <Image source={ROBOT_IMAGE} contentFit="contain" style={{ width: '100%', height: '100%' }} pointerEvents="none" />
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
        >
          <BotMessageSquare size={16} color="#8D9AFF" />
          <TextInput
            style={[
              {
                flex: 1,
                minWidth: 0,
                fontFamily: 'PublicSans-Regular',
                fontSize: 14,
                color: theme.textPrimary?.val,
                height: 36,
              },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
            placeholder="Posez votre question ici"
            placeholderTextColor="#6E6764"
            value={value}
            onChangeText={setValue}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
          />
          <VoxButton
            size="md"
            shrink
            iconLeft={ArrowUpRight}
            onPress={handleSubmit}
            backgroundColor={PURPLE_BUTTON}
            textColor="$white1"
            hoverStyle={{ backgroundColor: PURPLE_PRIMARY }}
            pressStyle={{ backgroundColor: PURPLE_PRIMARY }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
