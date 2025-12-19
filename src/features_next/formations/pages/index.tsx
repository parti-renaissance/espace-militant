import { useGetTags } from '@/services/profile/hook'
import { UserTagEnum } from '@/core/entities/UserProfile'
import { getMembershipStatus } from '@/utils/membershipStatus'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useMedia, YStack } from 'tamagui'
import { JoinMembershipCard, RenewMembershipCard, AccessFormationsCard } from '../components/MembershipCards'
import { Layout, LayoutScrollView } from '@/components/AppStructure'
import { ContentBackButton } from '@/components/ContentBackButton'

function FormationsSkeleton() {
  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView>
        <YStack gap="$medium">
          <ContentBackButton fallbackPath="/evenements" />
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Title />
              <SkeCard.Image />
            </SkeCard.Content>
          </SkeCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

function FormationsContent({ status }: { status: ReturnType<typeof getMembershipStatus> }) {
  const media = useMedia()

  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView
        padding={media.sm ? false : { safeAreaTop: false }}
        contentInsetAdjustmentBehavior="never"
      >
        <YStack gap="$medium">
          <ContentBackButton fallbackPath="/evenements" />
          {(status === 'join' || status === 'tofinish') && <JoinMembershipCard />}
          {status === 'renew' && <RenewMembershipCard />}
          {status === 'valid' && <AccessFormationsCard />}
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export default function FormationsScreen() {
  const { tags, isPending } = useGetTags({ tags: [UserTagEnum.SYMPATHISANT, UserTagEnum.ADHERENT] })

  if (isPending || !tags) {
    return <FormationsSkeleton />
  }

  const status = getMembershipStatus(tags ?? [])

  return <FormationsContent status={status} />
}

