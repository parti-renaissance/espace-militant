import { Info, X } from '@tamagui/lucide-icons'
import { Toast, useToastState } from '@tamagui/toast'
import { isWeb, ThemeName, XStack, YStack } from 'tamagui'
import Text from '../base/Text'
import { VoxButton } from '../Button/'
import VoxCard from '../VoxCard/VoxCard'

const getThemeByType = (type: 'error' | 'success' | 'info' | 'warning'): ThemeName => {
  switch (type) {
    case 'error':
      return 'orange'
    case 'success':
      return 'green'
    case 'info':
      return 'blue'
    case 'warning':
      return 'yellow'
    default:
      return 'gray'
  }
}

const VoxToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null
  const type = currentToast.type as 'error' | 'success' | 'info' | 'warning'
  const theme = getThemeByType(type)
  const bgColor = '$color5'
  const textColor = '$white1'

  type InnerContainerProps = {
    children: React.ReactNode
  }
  const InnerContainer = ({ children }: InnerContainerProps) =>
    currentToast.action ? (
      <Toast.Action
        onPress={currentToast.action.onPress}
        altText={currentToast.action.altText}
        gap={10}
        justifyContent="space-between"
        flexDirection="row"
        flexShrink={1}
        alignItems="center"
        cursor="pointer"
      >
        {children}
      </Toast.Action>
    ) : (
      <XStack gap={10} justifyContent="space-between" alignItems="center" flexShrink={1}>
        {children}
      </XStack>
    )

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      opacity={1}
      alignSelf="center"
      scale={1}
      animation="100ms"
      bg={bgColor}
      padding={0}
      borderRadius={16}
      height="auto"
      theme={theme}
      maxWidth={320}
      viewportName={currentToast.viewportName}
      zIndex={999999}
      style={{ zIndex: 999999, elevation: 999999 }}
    >
      <VoxCard.Content paddingVertical={10}>
        <XStack gap={10} justifyContent="space-between" alignContent="center" alignItems="center" position="relative">
          <InnerContainer>
            <YStack>
              <Info size={20} color={textColor} />
            </YStack>
            <YStack flexShrink={1}>
              {currentToast.title.length > 0 && (
                <Text.SM semibold color={textColor} numberOfLines={1}>
                  {currentToast.title}
                </Text.SM>
              )}
              {!!currentToast.message && (
                <Text.MD color={textColor} numberOfLines={3}>
                  {currentToast.message}
                </Text.MD>
              )}
            </YStack>
          </InnerContainer>
          <YStack>
            <Toast.Close asChild={!isWeb}>
              <VoxButton theme={theme} size="sm" shrink iconLeft={X}></VoxButton>
            </Toast.Close>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </Toast>
  )
}

export default VoxToast
