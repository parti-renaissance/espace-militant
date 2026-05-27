import { useMedia, View } from 'tamagui'
import { BotMessageSquare } from '@tamagui/lucide-icons'

export function BotAvatar() {
  const media = useMedia()
  return (
    <View flexShrink={0} marginTop={media.sm ? 0 : 16} marginLeft={media.sm ? 16 : 0}>
      <BotMessageSquare size={20} color="$blue9" />
    </View>
  )
}

export default BotAvatar
