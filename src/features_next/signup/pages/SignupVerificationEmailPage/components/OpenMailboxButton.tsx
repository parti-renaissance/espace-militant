import { Linking } from 'react-native'
import { YStack } from 'tamagui'
import { Mail } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

const MAILBOX_DEEP_LINKS: Record<string, string> = {
  'gmail.com': 'googlegmail://',
  'googlemail.com': 'googlegmail://',
  'outlook.com': 'ms-outlook://',
  'hotmail.com': 'ms-outlook://',
  'live.com': 'ms-outlook://',
  'yahoo.com': 'ymail://',
  'yahoo.fr': 'ymail://',
  'icloud.com': 'message://',
  'me.com': 'message://',
  'proton.me': 'protonmail://',
  'protonmail.com': 'protonmail://',
}

function getDomain(email: string): string | null {
  const parts = email.split('@')
  if (parts.length !== 2) return null
  return parts[1].toLowerCase()
}

type OpenMailboxButtonProps = {
  email: string
}

export default function OpenMailboxButton({ email }: OpenMailboxButtonProps) {
  const handlePress = async () => {
    const domain = getDomain(email)
    const deepLink = domain ? MAILBOX_DEEP_LINKS[domain] : undefined

    if (deepLink) {
      try {
        const canOpen = await Linking.canOpenURL(deepLink)
        if (canOpen) {
          await Linking.openURL(deepLink)
          return
        }
      } catch {
        // fallback below
      }
    }

    const mailto = `mailto:${encodeURIComponent(email)}`
    await Linking.openURL(mailto)
  }

  return (
    <YStack alignItems="center" gap="$small">
      <VoxButton theme="blue" size="sm" iconLeft={Mail} onPress={handlePress}>
        Ouvrir ma boîte mail
      </VoxButton>
    </YStack>
  )
}
