import React, { useMemo, memo } from "react"
import { XStack } from "tamagui"
import Text from "@/components/base/Text"
import ProfilePicture from "@/components/ProfilePicture"

export type SenderProps = {
  sender: {
    name: string | null
    role?: string | null
    pictureLink?: string
    textColor?: string
  }
}

const Sender = ({ sender }: SenderProps) => {
  console.log('Sender component render - sender:', sender)
  
  const profilePictureProps = useMemo(() => ({
    size: "$4" as const,
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

Sender.displayName = 'Sender'

export default Sender