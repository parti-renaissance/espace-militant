import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, Spinner, styled, useMedia, XStack, YStack } from 'tamagui'
import { Bot, Menu, SquarePen } from '@tamagui/lucide-icons'

import { NavItem, SideBarArea } from '@/components/AppStructure'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import { useGetPaginatedChatbotThreads } from '@/services/chatbot/hook'

export type ChatBotNavigationProps = {
  activeDiscussionId?: string | null
  onActiveDiscussionChange?: (discussionId: string | null) => void
}

const NavigationContainer = styled(XStack, {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 1000,
  backgroundColor: '$textOutline',
  variants: {
    showShadow: {
      true: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        boxShadow: '2px 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      false: {
        boxShadow: 'none',
      },
    },
  },
  defaultVariants: {
    showShadow: false,
  },
})

export function ChatBotNavigation({ activeDiscussionId = null, onActiveDiscussionChange }: ChatBotNavigationProps) {
  const media = useMedia()
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetPaginatedChatbotThreads()

  const threads = data?.pages.flatMap((p) => p.items) ?? []

  const [viewportHeight, setViewportHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const autoFetchCountRef = useRef(0)

  const tryFetchNextPage = useCallback(
    (event?: unknown) => {
      if (!hasNextPage || isFetching) return

      const nativeEvent = (event as { nativeEvent?: any } | undefined)?.nativeEvent ?? (event as any)
      const target = nativeEvent?.target

      const scrollTop = nativeEvent?.contentOffset?.y ?? target?.scrollTop ?? 0
      const viewportHeightEvent = nativeEvent?.layoutMeasurement?.height ?? target?.clientHeight ?? 0
      const totalHeight = nativeEvent?.contentSize?.height ?? target?.scrollHeight ?? 0

      const distanceToBottom = totalHeight - (viewportHeightEvent + scrollTop)

      if (distanceToBottom < 120) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetching],
  )

  useEffect(() => {
    if (media.gtMd) return
    setIsMenuOpen((prev) => (prev ? false : prev))
  }, [media.gtMd])

  useEffect(() => {
    if (!hasNextPage || isFetching) return
    if (!viewportHeight || !contentHeight) return
    if (autoFetchCountRef.current >= 6) return

    const threshold = 0
    if (contentHeight <= viewportHeight + threshold) {
      autoFetchCountRef.current += 1
      fetchNextPage()
    }
  }, [contentHeight, viewportHeight, fetchNextPage, hasNextPage, isFetching])

  if (media.sm) return null

  return (
    <>
      <SideBarArea state={isMenuOpen && media.gtMd ? 'militant' : 'collapsed'} />
      <NavigationContainer showShadow={isMenuOpen && !media.gtMd}>
        <SideBarArea state="militant" />
        <YStack width={isMenuOpen ? 264 : 56} px={isMenuOpen ? '$medium' : '$small'} pt="$medium" flex={1}>
          <YStack gap={32} flex={1} minHeight={0}>
            <XStack gap={8} alignItems="center" justifyContent="space-between">
              <VoxButton iconLeft={Menu} size="lg" shrink variant="soft" onPress={() => setIsMenuOpen(!isMenuOpen)} />
            </XStack>
            <NavItem
              iconLeft={SquarePen}
              href="/chatbot"
              text="Nouvelle conversation"
              frame="secondary"
              active={!activeDiscussionId}
              onPress={() => onActiveDiscussionChange?.(null)}
              collapsed={!isMenuOpen}
            />
            <ScrollView
              flex={1}
              minHeight={0}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
              onContentSizeChange={(_, h) => setContentHeight(h)}
              onScroll={(e) => tryFetchNextPage(e)}
              scrollEventThrottle={16}
            >
              {isMenuOpen ? (
                <Text.SM color="$textSecondary" semibold textTransform="uppercase" px={8} pb={10}>
                  Discussions
                </Text.SM>
              ) : null}

              <YStack gap={4} display={isMenuOpen ? 'flex' : 'none'}>
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
                {isLoading || isFetchingNextPage ? (
                  <XStack padding="$small" justifyContent="center">
                    <Spinner size="small" />
                  </XStack>
                ) : null}
              </YStack>
            </ScrollView>
          </YStack>
        </YStack>
      </NavigationContainer>
    </>
  )
}
