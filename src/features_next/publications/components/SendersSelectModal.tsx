import React from "react"
import { useMedia, XStack, YStack } from "tamagui"
import Text from "@/components/base/Text"
import ProfilePicture from "@/components/ProfilePicture"
import { Check, PenLine } from "@tamagui/lucide-icons"
import ModalOrBottomSheet from "@/components/ModalOrBottomSheet/ModalOrBottomSheet"
import { SenderViewProps } from "./SenderView"

type SendersSelectModalProps = {
  open: boolean
  onClose: () => void
  availableSenders: SenderViewProps[]
  selectedSender: SenderViewProps | null
  onSenderSelect?: (sender: SenderViewProps) => void
}

type SenderItemProps = {
  sender: SenderViewProps
  isSelected: boolean
  onPress: (sender: SenderViewProps) => void
}

const SenderItem = ({ sender, isSelected, onPress }: SenderItemProps) => {
  const fullName = sender.first_name && sender.last_name 
    ? `${sender.first_name} ${sender.last_name}` 
    : sender.first_name || sender.last_name || 'Expéditeur inconnu'

  return (
    <XStack 
      alignItems="center" 
      gap="$medium" 
      py="$small" 
      px={20} 
      bg={isSelected ? '$textOutline' : 'white'}
      hoverStyle={{ 
        backgroundColor: '$textOutline20',
        cursor: 'pointer' 
      }}
      pressStyle={{ 
        backgroundColor: '$textOutline32' 
      }}
      onPress={() => onPress(sender)}
    >
      <ProfilePicture
        size={40}
        rounded
        fullName={fullName}
        src={sender.image_url ?? undefined}
        alt={fullName}
      />
      <YStack flex={1} flexShrink={1}>
        <Text.SM medium numberOfLines={1}>{fullName}</Text.SM>
        <Text.SM medium color={sender.theme?.primary ?? '$textSecondary'} numberOfLines={1}>{sender.role}</Text.SM>
      </YStack>
      <YStack opacity={isSelected ? 1 : 0}>
        <Check size={20} color="$textPrimary" />
      </YStack>
    </XStack>
  )
}

SenderItem.displayName = 'SenderItem'

export const SendersSelectModal = ({
  open,
  onClose,
  availableSenders,
  selectedSender,
  onSenderSelect
}: SendersSelectModalProps) => {
  const media = useMedia()

  const handleSenderPress = (sender: SenderViewProps) => {
    onSenderSelect?.(sender)
    onClose()
  }

  return (
    <ModalOrBottomSheet open={open} onClose={onClose} allowDrag>
      <YStack width={media.gtMd ? 480 : undefined}>
        <XStack h={64} alignItems="center" padding="$medium" gap="$small" borderBottomColor="$textOutline" borderBottomWidth={1}>
          <PenLine size={20} color="$textPrimary" />
          <Text.LG>Qui signe la publication ?</Text.LG>
        </XStack>
        <YStack p="$medium" bg="$textSurface" borderBottomColor="$textOutline" borderBottomWidth={1}>
          <Text.SM lineHeight={20}>
            <Text.SM semibold lineHeight={20}>Seuls les membres de l'équipe peuvent être signataires d'une publication. </Text.SM>
            Le signataire par défaut est le rôle principal de l'instance.
          </Text.SM>
        </YStack>
        <YStack>
          {availableSenders.map((availableSender) => (
            <SenderItem
              key={availableSender.uuid || availableSender.first_name || 'unknown'}
              sender={availableSender}
              isSelected={availableSender.uuid === selectedSender?.uuid || (availableSender.uuid === null && selectedSender?.uuid === null && availableSender.first_name === "Sans signataire" && selectedSender?.first_name === "Sans signataire")}
              onPress={handleSenderPress}
            />
          ))}
        </YStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}

SendersSelectModal.displayName = 'SendersSelectModal'

export default SendersSelectModal

