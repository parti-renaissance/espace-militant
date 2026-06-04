import Attal2027Illustration from '@/assets/illustrations/Attal2027Illustration'
import { Spinner, YStack } from 'tamagui'

export default function WaitingScreen() {
  return (
    <YStack
      justifyContent="center"
      alignItems="center"
      gap="$medium"
      height="100%"
      flex={1}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      pointerEvents="none"
      zIndex={1000}
    >
      <Attal2027Illustration />
      <Spinner color="$blue9" size="large" />
    </YStack>
  )
}
