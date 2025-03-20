import { ReferralService, referralServiceKey } from '@/services/referral/api'
import { ReferralInviteRequestType } from '@/services/referral/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useReferrals() {
  return useQuery({
    queryFn: () => ReferralService.get(),
    queryKey: [referralServiceKey],
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
