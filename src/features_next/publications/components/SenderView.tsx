import React, { useMemo, useState } from "react"
import { XStack, YStack } from "tamagui"
import Text from "@/components/base/Text"
import ProfilePicture from "@/components/ProfilePicture"
import { Clipboard, ClipboardCheck, ClipboardEdit, Clock, UserCog } from "@tamagui/lucide-icons"
import { VoxButton } from "@/components/Button"
import SendersSelectModal from "./SendersSelectModal"

export type SenderProfileProps = {
  sender: {
    name: string | null
    role?: string | null
    pictureLink?: string
    textColor?: string
  }
}

const SenderProfile = ({ sender }: SenderProfileProps) => {
  const profilePictureProps = useMemo(() => ({
    size: 40,
    rounded: true,
    src: sender.pictureLink,
    alt: "Profile picture",
    fullName: sender.name ?? 'U'
  }), [sender.pictureLink, sender.name])


  return (
    <XStack gap="$small" alignItems="center">
      <ProfilePicture {...profilePictureProps} />
      <Text>
        <Text.SM medium>{sender.name}</Text.SM>
        <Text.BR />
        <Text.SM medium color={sender.textColor ?? '$gray5'}>
          {sender.role}
        </Text.SM>
      </Text>
    </XStack>
  )
}

SenderProfile.displayName = 'SenderProfile'

export type SenderViewProps = {
  uuid: string
  first_name: string
  last_name: string
  role?: string | null
  image_url?: string | null
  theme: {
    soft: string
    hover: string
    active: string
    primary: string
  } | null
  instance?: string | null
  zone?: string | null
  scope?: string | null
}

const StatusBadge = ({ status }: { status: 'published' | 'draft' | string }) => {
  const { label, Icon, theme } = useMemo(() => {
    switch (status) {
      case 'published':
        return {
          label: 'Publiée',
          Icon: ClipboardCheck,
          theme: 'green' as const,
        }
      case 'draft':
        return {
          label: 'Brouillon',
          Icon: ClipboardEdit,
          theme: 'gray' as const,
        }
      default:
        return {
          label: status,
          Icon: Clipboard,
          theme: 'gray' as const,
        }
    }
  }, [status])

  return (
    <XStack
      theme={theme}
      backgroundColor={'$color1'}
      borderRadius={999}
      paddingVertical={4}
      paddingHorizontal={8}
      alignItems="center"
      flexShrink={1}
      gap="$xsmall"
    >
      {Icon && <Icon size={12} color={'$color5'} />}
      <Text.SM semibold color={'$color5'} ellipsizeMode="tail" numberOfLines={1}>
        {label}
      </Text.SM>
    </XStack>
  )
}

export const SenderView = ({
  sender,
  status,
  datetime,
  availableSenders,
  onSenderSelect
}: {
  sender: SenderViewProps | null
  status?: 'published' | 'draft' | string
  datetime?: string
  availableSenders?: SenderViewProps[]
  onSenderSelect?: (sender: SenderViewProps) => void
}) => {
  const [showSenderModal, setShowSenderModal] = useState(false)

  const senderProps = useMemo(() => {
    if (!sender) {
      return {
        name: null,
        role: undefined,
        pictureLink: undefined
      }
    }

    return {
      name: `${sender?.first_name} ${sender?.last_name}`,
      role: sender?.role || undefined,
      pictureLink: sender?.image_url || undefined,
      textColor: sender?.theme?.primary ?? '$gray5'
    }
  }, [sender])

  const memoizedSender = useMemo(() => {
    return <SenderProfile sender={senderProps} />
  }, [sender])

  return (
    <>
      <YStack gap="$medium">
        <XStack justifyContent="space-between" gap="$small">
          <XStack
            backgroundColor={sender?.theme?.soft ?? '$gray1'}
            borderRadius={999}
            paddingVertical={4}
            paddingHorizontal={8}
            alignItems="center"
            flexShrink={1}
          >
            <Text.SM semibold color={sender?.theme?.primary ?? '$gray5'} ellipsizeMode="tail" numberOfLines={1}>
              {sender?.instance ?? 'Instance inconnue'} {sender?.zone ? `• ${sender?.zone}` : ''}
            </Text.SM>
          </XStack>
          {datetime && (
            <XStack gap="$small" alignItems="center">
              <Clock size={16} color="$textSecondary" />
              <Text.SM secondary>{datetime}</Text.SM>
            </XStack>
          )}
          {status && (
            <StatusBadge status={status} />
          )}
        </XStack>
        <XStack gap="$small" alignItems="center" justifyContent="space-between">
          {memoizedSender}
          {availableSenders && availableSenders.length > 0 && (
            <YStack justifyContent="center" alignItems="center">
              <VoxButton size="md" variant="soft" textColor="$textSecondary" shrink iconLeft={UserCog} onPress={() => setShowSenderModal(true)} />
            </YStack>
          )}
        </XStack>
      </YStack>
      {availableSenders && availableSenders.length > 0 && (
        <SendersSelectModal
          open={showSenderModal}
          onClose={() => setShowSenderModal(false)}
          availableSenders={availableSenders}
          selectedSender={sender}
          onSenderSelect={onSenderSelect}
        />
      )}
    </>
  )
}

SenderView.displayName = 'SenderView'

export default SenderView