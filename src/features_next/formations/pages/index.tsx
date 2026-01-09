import { useHasRecentMembership } from '@/services/profile/hook'
import { MembershipStatus } from '@/utils/membershipStatus'
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

function FormationsContent({ hasAccess, status }: { hasAccess: boolean; status: MembershipStatus | null }) {
  const media = useMedia()

  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView
        padding={media.sm ? false : { safeAreaTop: false }}
        contentInsetAdjustmentBehavior="never"
      >
        <YStack gap="$medium">
          <ContentBackButton fallbackPath="/evenements" />
          {hasAccess ? (
            <AccessFormationsCard />
          ) : (
            <>
              {status === 'renew' && <RenewMembershipCard />}
              {(status === 'join' || status === 'tofinish') && <JoinMembershipCard />}
            </>
          )}
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export default function FormationsScreen() {
  const { hasAccess, isPending, status } = useHasRecentMembership()

  if (isPending) {
    return <FormationsSkeleton />
  }

  return <FormationsContent hasAccess={hasAccess} status={status} />
}

