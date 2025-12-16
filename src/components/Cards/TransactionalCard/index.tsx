import { VoxCard } from "@/components/VoxCard/VoxCard";
import Text from "@/components/base/Text";
import { BellDot } from "@tamagui/lucide-icons";
import { YStack, XStack, isWeb } from "tamagui";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { genericErrorThrower } from "@/services/common/errors/generic-errors";
import { useHits } from "@/services/hits/hook";

export type TransactionalCardProps = {
  title: string
  description: string
  ctaLink: string
  ctaLabel: string | null
}

export default function TransactionalCard({ title, description, ctaLink, ctaLabel }: TransactionalCardProps) {
  const router = useRouter()
  const { trackClick } = useHits()

  const handleLinkPress = async () => {
    if (!ctaLink) return

    trackClick({
      object_type: 'transactional_message',
      target_url: ctaLink,
      button_name: ctaLabel || undefined,
    })

    try {
      if (ctaLink.startsWith('/')) {
        router.push(ctaLink as Href)
      } else {
        if (isWeb) {
          window.open(ctaLink, '_blank')
        } else {
          WebBrowser.openBrowserAsync(ctaLink)
        }
      }
    } catch (error) {
      genericErrorThrower(error)
    }
  }

  return (
    <VoxCard bg="$blue1" borderColor="$blue2">
      <VoxCard.Content>
        <XStack alignItems="flex-start" gap="$medium">
          <BellDot size={20} color="$blue5" />
          <YStack gap="$small" flex={1}>
            <Text.SM semibold>{title ?? 'Nouveau message'}</Text.SM>
            <Text.SM>{description ?? 'Vous avez reçu un nouveau message'}</Text.SM>
            {ctaLink && (
              <Text.SM color="$blue6" link onPress={handleLinkPress}>
                {ctaLabel ?? 'Voir'}
              </Text.SM>
            )}
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
