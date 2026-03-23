import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spinner, XStack, YStack } from 'tamagui'
import { Bot, SquarePen } from '@tamagui/lucide-icons'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'

import { NavItem } from '@/components/AppStructure/Navigation/NavItem'
import Text from '@/components/base/Text'

import { useGetPaginatedChatbotThreads } from '@/services/chatbot/hook'

export interface ChatBotThread {
  uuid: string
  title: string
}

export interface ChatBotSheetRef {
  expand: () => void
  close: () => void
}

interface ChatBotSheetProps {
  activeDiscussionId?: string | null
  onActiveDiscussionChange?: (discussionId: string | null) => void
}

const ChatBotSheet = forwardRef<ChatBotSheetRef, ChatBotSheetProps>(({ activeDiscussionId = null, onActiveDiscussionChange }, ref) => {
  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['90%'], [])

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetPaginatedChatbotThreads()

  // On s'assure que threads est bien reconnu comme un tableau de ChatBotThread
  const threads: ChatBotThread[] = data?.pages.flatMap((p) => p.items) ?? []

  useImperativeHandle(ref, () => ({
    expand: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.dismiss(),
  }))

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />, [])

  const selectThread = useCallback(
    (id: string | null) => {
      onActiveDiscussionChange?.(id)
      bottomSheetModalRef.current?.dismiss()
    },
    [onActiveDiscussionChange],
  )

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage])

  const renderHeader = useCallback(
    () => (
      <YStack gap={16} paddingBottom={8}>
        <YStack gap={4} paddingHorizontal={16}>
          <NavItem iconLeft={SquarePen} text="Nouvelle conversation" active={!activeDiscussionId} onPress={() => selectThread(null)} />
        </YStack>
        <Text.SM color="$textSecondary" semibold textTransform="uppercase" px={24} pb={4}>
          Discussions récentes
        </Text.SM>
      </YStack>
    ),
    [activeDiscussionId, selectThread],
  )

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null
    return (
      <XStack padding="$small" justifyContent="center">
        <Spinner size="small" />
      </XStack>
    )
  }, [isFetchingNextPage])

  // Remplacement du 'any' par notre type ChatBotThread
  const renderItem = useCallback(
    ({ item }: { item: ChatBotThread }) => (
      <YStack paddingHorizontal={16} paddingBottom={4}>
        <NavItem iconLeft={Bot} text={item.title} active={item.uuid === activeDiscussionId} onPress={() => selectThread(item.uuid)} />
      </YStack>
    ),
    [activeDiscussionId, selectThread],
  )

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      topInset={insets.top}
      handleIndicatorStyle={{ backgroundColor: '#D2DCE5', width: 48 }}
    >
      <BottomSheetFlatList
        data={threads}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </BottomSheetModal>
  )
})

ChatBotSheet.displayName = 'ChatBotSheet'

export default memo(ChatBotSheet)
