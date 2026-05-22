import { useMedia, XStack } from 'tamagui'
import { Search } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

type SearchInThisAreaButtonProps = {
  visible: boolean
  loading?: boolean
  onPress: () => void
  topOffset?: number
}

const SearchInThisAreaButton = ({ visible, loading = false, onPress, topOffset = 16 }: SearchInThisAreaButtonProps) => {
  const media = useMedia()
  if (!visible) {
    return null
  }

  return (
    <XStack
      position="absolute"
      top={topOffset}
      left={media.sm ? 0 : 260}
      right={0}
      zIndex={25}
      alignItems="center"
      justifyContent="center"
      pointerEvents="box-none"
    >
      <VoxButton variant="contained" size="lg" iconLeft={Search} theme="gray" disabled={loading} onPress={onPress} aria-label="Rechercher dans cette zone">
        Rechercher dans cette zone
      </VoxButton>
    </XStack>
  )
}

export default SearchInThisAreaButton
