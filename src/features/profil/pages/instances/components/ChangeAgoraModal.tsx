import { ComponentPropsWithoutRef, memo, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { InstanceCardHeader } from '@/components/InstanceCard/InstanceCard'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import { usePaginatedAgoras, useSetMyAgora } from '@/services/agoras/hook'
import { Diamond, X } from '@tamagui/lucide-icons'
import { Spinner, useMedia, YStack } from 'tamagui'
import { MembershipCard } from './MembershipCard'
import { DoubleDiamond } from './icons'

const MemoizedMembershipCard = memo(MembershipCard)

const ChangeAgoraList = ({ currentUuids, onClose }: { currentUuids: string[]; onClose?: () => void }) => {
  const { data, fetchNextPage, hasNextPage, isLoading } = usePaginatedAgoras()
  const { mutateAsync, isPending } = useSetMyAgora()

  const agoras = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.items) ?? []
    if (currentUuids.length > 0) {
      const matching = all.filter((a) => currentUuids.includes(a.uuid))
      const others = all.filter((a) => !currentUuids.includes(a.uuid))
      return [...matching, ...others]
    }
    return all
  }, [data, currentUuids])

  const [pendingSelected, setPendingSelected] = useState<string | null>(null)

  const { current: handlePress } = useRef((uuid: string) => async () => {
    try {
      setPendingSelected(uuid)
      await mutateAsync(uuid)
    } catch (err) {
      // error is already handled by `onError`
    } finally {
      onClose?.()
      setPendingSelected(null)
    }
  })

  const media = useMedia()
  const key = media.gtSm ? 'gtSm' : 'sm'

  if (isLoading) {
    return (
      <YStack justifyContent="center" alignItems="center" flex={1} width="100%">
        <Spinner size="large" color="$blue6" />
      </YStack>
    )
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={agoras}
      key={key}
      numColumns={media.gtSm ? 2 : undefined}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <Text.P $gtSm={{ pb: 16 }}>
          Vous ne pouvez être membre que d’une seule agora.
        </Text.P>
      }
      renderItem={({ item: agora }) => (
        <MemoizedMembershipCard
          title={agora.name}
          subtitle={`${agora.members_count ?? '-'}/${agora.max_members_count ?? '999'} Adhérents`}
          selected={currentUuids.includes(agora.uuid)}
          onPress={handlePress(agora.uuid)}
          loading={pendingSelected === agora.uuid && isPending}
          isMember={currentUuids.includes(agora.uuid)}
          disabled={agora?.members_count >= agora?.max_members_count}
        />
      )}
      keyExtractor={(item) => item.uuid}
      contentContainerStyle={{ gap: media.gtSm ? 0 : 16, flexGrow: 1, padding: 16, marginBottom: 24 }}
      columnWrapperStyle={media.gtSm ? { gap: 16, paddingBottom: 16, flex: 1 } : undefined}
    />
  )
}


const windowSize = Dimensions.get('window')

export default function ChangeAgoraModal({
  currentAgoraUuids,
  ...modalProps
}: Omit<ComponentPropsWithoutRef<typeof ModalOrPageBase>, 'header'> & {
  currentAgoraUuids: string[]
}) {
  const media = useMedia()
  const maxHeight = media.sm ? windowSize.height - 56 : windowSize.height * 0.8
  const width = !media.gtMd ? '100%' : 616

  return (
    <ModalOrPageBase
      {...modalProps}
      scrollable={false}
      header={
        <YStack>
          <VoxHeader justifyContent="space-between">
            <VoxHeader.Title icon={Diamond}>Changer d’agora</VoxHeader.Title>
            <VoxButton onPress={modalProps.onClose} variant="text" shrink iconLeft={X} size="lg" />
          </VoxHeader>
        </YStack>
      }
    >
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} width={width} height={maxHeight} gap={0}>
          {media.gtMd ? (
            <VoxCard.Content pb={0}>
              <InstanceCardHeader
                icon={DoubleDiamond}
                title="Changer d’agora"
                headerLeft={<VoxButton onPress={modalProps.onClose} variant="text" shrink iconLeft={X} size="lg" />}
              />
            </VoxCard.Content>
          ) : null}
          <View style={{ flex: 1 }}>
            <BoundarySuspenseWrapper>
              <ChangeAgoraList currentUuids={currentAgoraUuids} onClose={modalProps.onClose} />
            </BoundarySuspenseWrapper>
          </View>
        </YStack>
      </SafeAreaView>
    </ModalOrPageBase>
  )
}
