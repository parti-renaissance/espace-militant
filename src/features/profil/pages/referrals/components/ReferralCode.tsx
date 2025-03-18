import React, { useCallback } from 'react'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useSession } from '@/ctx/SessionProvider'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import { Copy, Share2 } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import Button, { VoxButton } from '../../../../../components/Button'

export default function ReferralCode() {
  const { user } = useSession()

  const copyURL = useHandleCopyUrl()
  const { handleShareOrCopy } = useShareOrCopy()

  const shareURL = useCallback(() => {
    if (!user.data?.referral_link) return
    return handleShareOrCopy({ url: user.data?.referral_link, message: 'Lorem' })
  }, [user.data])

  const onCopyURL = useCallback(() => copyURL(user.data?.referral_link ?? ''), [user.data])

  return (
    <VoxCard bg="#F9F9FA" borderColor="#E9ECEE" borderWidth={1} inside>
      <VoxCard.Content pr="$large">
        <Text.SM bold>Partagez votre lien de parrainage</Text.SM>
        <Text.SM color="$textSecondary" lineHeight={20}>
          Le lien ci-dessous est votre lien d’adhésion personnel. Si celui-ci est utilisé pour adhérer, vous serez automatiquement reconnu comme le parrain.
        </Text.SM>

        <XStack gap={'$8'} mt={'$4'}>
          <YStack flex={11}>
            <Button variant="outlined" bg="$white1" size="xl" width="100%" justifyContent="space-between">
              <XStack flexShrink={1}>
                <Text.MD secondary numberOfLines={1} flex={1} textDecorationLine="underline">
                  {user.data?.referral_link?.replace('https://', '')}
                </Text.MD>
              </XStack>
              <XStack justifyContent="flex-end" onPress={onCopyURL}>
                <Copy color="$textSecondary" size={24} />
              </XStack>
            </Button>
          </YStack>

          <YStack flex={1}>
            <VoxButton variant="outlined" iconRight={Share2} bg={'$white1'} size={'xl'} onPress={shareURL}>
              Partager
            </VoxButton>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
