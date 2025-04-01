import { ReferralService, referralServiceKey } from '@/services/referral/api'
import { ReferralInviteRequestType, ReferralStatisticsType } from '@/services/referral/schema'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

export function useReferrals() {
  return useQuery({
    queryFn: () => ReferralService.get(),
    queryKey: [referralServiceKey],
  })
}

export function useReferralStatistics(): UseQueryResult<ReferralStatisticsType> {
  return useQuery({
    queryFn: () => ReferralService.statistics(),
    queryKey: [referralServiceKey, 'statistics'],
  })
}

export function useReferralsInvite() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (values: ReferralInviteRequestType) => ReferralService.invite(values),
    onSettled: () => {
      client.invalidateQueries({
        queryKey: [referralServiceKey],
      })
    },
  })
}

export function useReferralsPreRegister() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ReferralService.preRegister,
    onSettled: () => {
      client.invalidateQueries({
        queryKey: [referralServiceKey],
      })
    },
  })
}
