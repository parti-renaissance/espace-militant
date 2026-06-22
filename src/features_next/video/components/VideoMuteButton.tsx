import { Platform } from 'react-native'
import { Circle, YStack } from 'tamagui'
import { Volume2, VolumeX } from '@tamagui/lucide-icons'

type VideoMuteButtonProps = {
  muted: boolean
  onPress: () => void
}

export function VideoMuteButton({ muted, onPress }: VideoMuteButtonProps) {
  const MuteIcon = muted ? VolumeX : Volume2

  return (
    <YStack
      position="absolute"
      bottom={12}
      right={12}
      zIndex={10}
      onPress={onPress}
      onMouseDown={Platform.OS === 'web' ? (event) => event.preventDefault() : undefined}
      role="button"
      aria-label={muted ? 'Activer le son' : 'Couper le son'}
      pressStyle={{ opacity: 0.85 }}
      cursor="pointer"
    >
      <Circle size={36} backgroundColor="rgba(0,0,0,0.55)" alignItems="center" justifyContent="center">
        <MuteIcon size={18} color="white" />
      </Circle>
    </YStack>
  )
}
