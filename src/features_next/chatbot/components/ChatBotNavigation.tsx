import { ScrollView, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { Bot, Menu, SquarePen } from '@tamagui/lucide-icons'

import { NavItem, SideBarArea } from '@/components/AppStructure'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import { useGetPaginatedChatbotThreads } from '@/services/chatbot/hook'

export type ChatBotNavigationProps = {
  activeDiscussionId?: string | null
  onActiveDiscussionChange?: (discussionId: string | null) => void
}

export function ChatBotNavigation({ activeDiscussionId = null, onActiveDiscussionChange }: ChatBotNavigationProps) {
  const media = useMedia()
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useGetPaginatedChatbotThreads()

  const threads = data?.pages.flatMap((p) => p.items) ?? []
  if (media.md) {
    return <></>
  }
  return (
    <>
      <SideBarArea state="militant" />
      <XStack bg="$textOutline" position="fixed" left={0} top={0} bottom={0} zIndex={1000}>
        <SideBarArea state="militant" />
        <YStack width={264} padding="$medium">
          <YStack gap={32}>
            <XStack gap={8} alignItems="center" justifyContent="space-between">
              <VoxButton iconLeft={Menu} size="lg" shrink variant="soft" />
            </XStack>
            <NavItem
              iconLeft={SquarePen}
              href="/chatbot"
              text="Nouvelle conversation"
              frame="secondary"
              active={!activeDiscussionId}
              onPress={() => onActiveDiscussionChange?.(null)}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
                const distanceToBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y)
                if (distanceToBottom < 120 && hasNextPage && !isFetching) {
                  fetchNextPage()
                }
              }}
              scrollEventThrottle={100}
            >
              <Text.SM color="$textSecondary" semibold textTransform="uppercase" px={8} pb={10}>
                Discussions
              </Text.SM>
              <YStack gap={4}>
                {threads.map((t) => (
                  <NavItem
                    key={t.uuid}
                    iconLeft={Bot}
                    href="/chatbot"
                    text={t.title}
                    frame="secondary"
                    active={t.uuid === activeDiscussionId}
                    onPress={() => onActiveDiscussionChange?.(t.uuid)}
                  />
                ))}
                {isLoading ? (
                  <XStack padding="$small" justifyContent="center">
                    <Spinner size="small" />
                  </XStack>
                ) : null}
              </YStack>
            </ScrollView>
          </YStack>
        </YStack>
      </XStack>
    </>
  )
}
