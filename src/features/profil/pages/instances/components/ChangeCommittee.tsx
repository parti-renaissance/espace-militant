import { ComponentPropsWithoutRef, memo, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetCommittees, useSetMyCommittee } from '@/services/committee/hook'
import { Diamond, X } from '@tamagui/lucide-icons'
import { useMedia, YStack } from 'tamagui'
import { InstanceCardHeader } from '../../../../../components/InstanceCard/InstanceCard'
import CommitteeCard from './CommitteeCard'
import { DoubleDiamond } from './icons'

const MemoizedCommitteeCard = memo(CommitteeCard)

const ChangeCommiteeList = ({ currentUuid, ...props }: { currentUuid: string | null; onClose?: () => void }) => {
  const { data } = useGetCommittees()
  const { mutateAsync, isPending } = useSetMyCommittee()

  const list = useMemo(() => {
    if (currentUuid) {
      const index = data.findIndex((x) => x.uuid === currentUuid)
      if (index !== -1) {
        const [selected] = data.splice(index, 1)
        data.unshift(selected)
      }
    }
    return data
  }, [data, currentUuid])

  const [selected, setSelected] = useState<string | null>(currentUuid)
  const [pendingSelected, setPendingSelected] = useState<string | null>(null)
  const { current: handlePress } = useRef((uuid: string) => () => {
    setPendingSelected(uuid)
    mutateAsync(uuid)
      .then(() => {
        setSelected(uuid)
        props.onClose?.()
      })
      .finally(() => {
        setPendingSelected(null)
      })
  })
  const media = useMedia()
  const key = media.gtSm ? 'gtSm' : 'sm'
  return (
    <FlatList
      style={{ flex: 1 }}
      data={list}
      key={key}
      numColumns={media.gtSm ? 2 : undefined}
      ListHeaderComponent={<Text.P $gtSm={{ pb: 16 }}>Vous pouvez seulement changer de comité au sein de votre Assemblée.</Text.P>}
      renderItem={({ item }) => (
        <MemoizedCommitteeCard
          flexBasis={media.gtSm ? 0 : undefined}
          committee={item}
          loading={pendingSelected === item.uuid && isPending}
          selected={selected === item.uuid}
          onPress={handlePress(item.uuid)}
        />
      )}
      keyExtractor={(item) => item.uuid}
      contentContainerStyle={{ gap: media.gtSm ? 0 : 16, flexGrow: 1, padding: 16, marginBottom: 24 }}
      columnWrapperStyle={media.gtSm ? { gap: 16, paddingBottom: 16, flex: 1 } : undefined}
    />
  )
}

const windowSize = Dimensions.get('window')
export default function ChangeCommitteeModal({
  currentCommitteeUuid,
  ...modalProps
}: Omit<ComponentPropsWithoutRef<typeof ModalOrPageBase>, 'header'> & { currentCommitteeUuid: string | null }) {
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
            <VoxHeader.Title icon={Diamond}>Changer de comité</VoxHeader.Title>
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
                title="Changer de comité"
                headerLeft={<VoxButton onPress={modalProps.onClose} variant="text" shrink iconLeft={X} size="lg" />}
              />
            </VoxCard.Content>
          ) : null}
          <View style={{ flex: 1 }}>
            <BoundarySuspenseWrapper>
              <ChangeCommiteeList currentUuid={currentCommitteeUuid} onClose={modalProps.onClose} />
            </BoundarySuspenseWrapper>
          </View>
        </YStack>
      </SafeAreaView>
    </ModalOrPageBase>
  )
}
