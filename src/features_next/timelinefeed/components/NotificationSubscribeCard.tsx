import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { useUserStore } from '@/store/user-store'
import { X } from '@tamagui/lucide-icons'
import { addMonths } from 'date-fns'
import { Link } from 'expo-router'
import { Image, isWeb, useMedia, XStack, YStack } from 'tamagui'

export default function NotificationSubscribeCard() {
  const userStore = useUserStore()
  const media = useMedia()
  const handleClose = () => userStore.setHideReSubscribeAlert(addMonths(new Date(), 1).toISOString())

  return (
    <VoxCard bg={media.sm ? 'transparent' : undefined}>
      <VoxCard.Content>
        <XStack justifyContent="flex-end" gap="$medium">
          <VoxButton variant="text" shrink iconLeft={X} onPress={handleClose} />
        </XStack>
        <YStack alignItems="center" gap="$medium" justifyContent="center">
          <Image source={require('../assets/reabo-illu.png')} />
          <Text.MD semibold> Pensez à vous réabonner !</Text.MD>
          <Text.SM secondary multiline textAlign="center">
            Vous ne recevez pas nos emails nationaux et locaux car vous êtes désabonnés de nos communication.
          </Text.SM>
          <XStack justifyContent="center" gap="$medium">
            <Link href={{ pathname: '/profil/communications', params: { autorun: '1' } }} asChild={!isWeb}>
              <VoxButton variant="outlined">Me réabonner</VoxButton>
            </Link>
          </XStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
