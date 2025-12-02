import { useGetProfil } from '@/services/profile/hook'
import { useReferrals, useReferralScoreboard, useReferralStatistics } from '@/services/referral/hook'
import { ReferralsContent } from './components/ReferralsContent'
import { ReferralsSkeleton } from './components/ReferralsSkeleton'
import { ReferralsDenyScreen } from './components/ReferralsDenyScreen'

export default function ReferralsScreen() {
  const { data: user, isLoading: isLoadingUser } = useGetProfil()
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()
  
  // Prefetch referrals for ReferralsTrackingCard
  useReferrals()
  
  if (isLoadingUser || isLoadingScoreboard || isLoadingStatistics) {
    return <ReferralsSkeleton />
  }
  
  const isAdherent = user?.tags?.find((tag) => tag.code.startsWith('adherent:'))
  
  return isAdherent ? (
    <ReferralsContent 
      user={user}
      scoreboard={scoreboard}
      statistics={statistics}
    />
  ) : (
    <ReferralsDenyScreen />
  )
}

export function ReferralsScreenSkeleton() {
  return <ReferralsSkeleton />
}

export function ReferralsScreenDeny() {
  return <ReferralsDenyScreen />
}
