import { Share2 } from '@tamagui/lucide-icons'
import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import ShareButton from '@/components/Buttons/ShareButton'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { XStack, YStack } from 'tamagui'
import { useGetProfil } from '@/services/profile/hook'

const ReferralsLinkCard = () => {
  const { data: user } = useGetProfil()
  const copyURL = useHandleCopyUrl()
  const { handleShareOrCopy } = useShareOrCopy()

  const onCopyURL = () => copyURL(user?.referral_link ?? '')
  const onShare = () => {
    if (!user?.referral_link) return
    return handleShareOrCopy({ url: user.referral_link, message: 'Lorem' })
  }

  return (
    <VoxCard bg="$textSurface" inside>
      <VoxCard.Content>
        <Text.LG fontWeight={600}>Lien de parrainage</Text.LG>
        <Text.SM color="$textSecondary" lineHeight={20}>
          Partagez votre lien d’adhésion personnel. Il vous identifie en tant que parrain.
        </Text.SM>

        <XStack gap="$medium" flex={1}>
          <YStack flexShrink={1}>
            <ShareButton url={user?.referral_link} onPress={onCopyURL} />
          </YStack>
          <YStack>
            <VoxButton variant="outlined" iconRight={Share2} bg="$white1" size="xl" onPress={onShare}>
              Partager
            </VoxButton>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default ReferralsLinkCard
