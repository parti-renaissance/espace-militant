import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { ProfileNav, VoxHeader } from '@/components/Header/Header'
import { useSession } from '@/ctx/SessionProvider'
import { Link, Slot } from 'expo-router'
import { useMedia, XStack } from 'tamagui'

export default function AppLayout() {
  const { isAuth } = useSession()
  const media = useMedia()

  if (!isAuth && media.sm) {
    return (
      <>
        <VoxHeader justifyContent="space-between" zIndex={100}>
          <XStack flex={1} flexBasis={0}>
            <Link href="/" replace>
              <EuCampaignIllustration cursor="pointer" showText={false} />
            </Link>
          </XStack>
          <ProfileNav flex={1} flexBasis={0} justifyContent="flex-end" />
        </VoxHeader>
        <Slot />
      </>
    )
  }

  return <Slot />
}
