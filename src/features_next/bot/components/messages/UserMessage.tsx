import { memo, useState } from 'react'
import { useMedia, View, XStack } from 'tamagui'
import { Copy, Pencil } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

import BotMarkdown from './BotMarkdown'

type Props = {
  content: string
  isAreaHovered: boolean
  onEdit: (text: string) => void
  onCopy: (text: string) => void
}

function UserMessageComponent({ content, isAreaHovered, onEdit, onCopy }: Props) {
  const media = useMedia()
  const [tapped, setTapped] = useState(false)
  const actionsVisible = media.sm && tapped

  return (
    <XStack alignSelf="flex-end" maxWidth="80%" gap="$xsmall" alignItems="center" group="userMsg">
      <XStack
        gap="$xsmall"
        opacity={actionsVisible ? 1 : 0}
        $group-userMsg-hover={{ opacity: 1 }}
        pointerEvents={media.sm && !tapped ? 'none' : 'auto'}
        animation="quick"
      >
        <VoxButton iconLeft={Pencil} variant="text" theme="gray" size="sm" shrink onPress={() => onEdit(content)} />
        <VoxButton iconLeft={Copy} variant="text" theme="gray" size="sm" shrink onPress={() => onCopy(content)} />
      </XStack>
      <View
        minWidth={0}
        overflow="hidden"
        bg={isAreaHovered ? '$textOutline40' : '$textOutline20'}
        p="$medium"
        borderTopLeftRadius="$medium"
        borderTopRightRadius="$xsmall"
        borderBottomLeftRadius="$medium"
        borderBottomRightRadius="$medium"
        animation="quick"
        flexShrink={1}
        cursor="pointer"
        onPress={() => media.sm && setTapped((prev) => !prev)}
      >
        <BotMarkdown content={content} />
      </View>
    </XStack>
  )
}

export const UserMessage = memo(UserMessageComponent)
export default UserMessage
