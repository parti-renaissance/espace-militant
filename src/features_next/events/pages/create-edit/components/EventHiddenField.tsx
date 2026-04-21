import { useState } from 'react'
import { useMedia, XStack, YStack } from 'tamagui'
import { EyeOff, Info } from '@tamagui/lucide-icons'

import SwitchV2 from '@/components/base/SwitchV2/SwitchV2'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import VoxCard from '@/components/VoxCard/VoxCard'

type EventHiddenFieldProps = {
  value: boolean
  onChange: (value: boolean) => void
}
const EventHiddenField = ({ value, onChange }: EventHiddenFieldProps) => {
  const [open, setOpen] = useState(false)
  const media = useMedia()
  return (
    <>
      <XStack alignItems="center" justifyContent="space-between" gap="$small" px="$medium">
        <XStack gap="$small">
          <Text.MD secondary>Événement non répertorié ?</Text.MD>
          <Info size={16} color="$blue5" onPress={() => setOpen(true)} />
        </XStack>
        <SwitchV2 checked={value} onPress={() => onChange(!value)} />
      </XStack>
      <ModalOrBottomSheet open={open} onClose={() => setOpen(false)}>
        <VoxCard maxWidth={media.sm ? undefined : 500} borderWidth={media.sm ? 0 : 1}>
          <VoxCard.Content gap="$medium">
            <Text.LG>Événement non répertorié</Text.LG>
            <XStack gap="$medium" flex={1} alignItems="center">
              <YStack width={20}>
                <EyeOff size={20} color="$textPrimary" />
              </YStack>
              <YStack flex={1} gap="$medium">
                <Text.MD>
                  En activant cette option, <Text.MD bold>l’événement ne sera accessible que par son lien direct</Text.MD> et ne pourra pas être retrouvé via la
                  plateforme.
                </Text.MD>
                <Text.MD color="$orange9">
                  N’utilisez cette option que si il est <Text.MD bold>absolument nécessaire</Text.MD> de cacher cet événement et ne le partager que via email ou
                  Telegram.
                </Text.MD>
              </YStack>
            </XStack>
          </VoxCard.Content>
        </VoxCard>
      </ModalOrBottomSheet>
    </>
  )
}

export default EventHiddenField
