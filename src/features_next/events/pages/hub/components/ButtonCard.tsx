import React, { memo, useCallback } from 'react'
import { type Href, useRouter } from 'expo-router'
import { ThemeName, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import { IconComponent } from '@/models/common.model'

export type ButtonCardProps = {
  label: string
  description?: string
  icon: IconComponent
  rightIcon?: IconComponent
  theme?: ThemeName
  horizontal?: boolean
  disabled?: boolean
  href?: Href
  onPress?: () => void
}

export const ButtonCard = memo(function ButtonCard({
  label,
  description,
  icon: Icon,
  rightIcon: RightIcon,
  theme,
  horizontal = false,
  disabled = false,
  href,
  onPress: customOnPress,
}: ButtonCardProps) {
  const router = useRouter()

  const handlePress = useCallback(() => {
    if (disabled) return
    if (customOnPress) customOnPress()
    else if (href) router.push(href)
  }, [disabled, customOnPress, href, router])

  const bg = theme ? '$color2' : '$textOutline'
  const iconBg = theme ? '$color4' : '$gray4'
  const hoverBg = theme ? '$color3' : '$textOutline20'
  const iconColor = theme ? '$color6' : '$gray5'

  const IconBubble = (
    <YStack borderRadius={99} height={44} width={44} alignItems="center" justifyContent="center" overflow="hidden">
      <Icon color={iconColor} size={20} />
      <YStack bg={iconBg} position="absolute" inset={0} opacity={0.16} />
    </YStack>
  )

  const Content = (
    <YStack
      flex={horizontal ? 1 : undefined}
      minWidth={horizontal ? 0 : undefined}
      gap="$small"
      justifyContent="center"
    >
      <Text.MD semibold>{label}</Text.MD>
      {!!description && <Text.SM secondary>{description}</Text.SM>}
    </YStack>
  )

  return (
    <YStack
      width="100%"
      theme={theme || null}
      bg={bg}
      p="$medium"
      borderRadius="$medium"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      onPress={handlePress}
      hoverStyle={!disabled ? { bg: hoverBg } : undefined}
      pressStyle={!disabled ? { bg: hoverBg, opacity: 0.9 } : undefined}
    >
      {horizontal ? (
        <XStack width="100%" alignItems="center" gap="$medium">
          {IconBubble}
          {Content}
          {!!RightIcon && (
            <YStack justifyContent="center">
              <RightIcon color={iconColor} size={24} />
            </YStack>
          )}
        </XStack>
      ) : (
        <YStack gap="$small">
          {IconBubble}
          {Content}
        </YStack>
      )}
    </YStack>
  )
})
