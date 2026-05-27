import { memo, useCallback } from 'react';
import { useMedia, View, XStack } from 'tamagui';
import { Copy, Pencil } from '@tamagui/lucide-icons';
import { VoxButton } from '@/components/Button/Button';
import VoxMarkdown from '@/components/VoxMarkdown/VoxMarkdown';

type Props = {
  messageId: string
  content: string
  isOpen: boolean
  onToggle: (id: string) => void
  onEdit: (text: string) => void
  onCopy: (text: string) => void
}

function UserMessageComponent({ messageId, content, isOpen, onToggle, onEdit, onCopy }: Props) {
  const media = useMedia()
  const actionsVisible = media.sm && isOpen

  const handleToggle = useCallback(() => {
    if (media.sm) onToggle(messageId)
  }, [media.sm, messageId, onToggle])

  return (
    <XStack alignSelf="flex-end" maxWidth="80%" gap="$xsmall" alignItems="center" group="userMsg" nativeID={`chat-msg-${messageId}`}>
      <XStack
        gap="$xsmall"
        opacity={actionsVisible ? 1 : 0}
        $group-userMsg-hover={{ opacity: 1 }}
        pointerEvents={media.sm && !isOpen ? 'none' : 'auto'}
        animation="quick"
      >
        <VoxButton iconLeft={Pencil} variant="text" theme="gray" size="sm" shrink onPress={() => onEdit(content)} />
        <VoxButton iconLeft={Copy} variant="text" theme="gray" size="sm" shrink onPress={() => onCopy(content)} />
      </XStack>
      <View
        minWidth={0}
        overflow="hidden"
        bg="$textOutline20"
        p="$medium"
        borderTopLeftRadius="$medium"
        borderTopRightRadius="$xsmall"
        borderBottomLeftRadius="$medium"
        borderBottomRightRadius="$medium"
        animation="quick"
        flexShrink={1}
        cursor="pointer"
        onPress={handleToggle}
      >
        <VoxMarkdown content={content} />
      </View>
    </XStack>
  )
}

export const UserMessage = memo(UserMessageComponent)
export default UserMessage
