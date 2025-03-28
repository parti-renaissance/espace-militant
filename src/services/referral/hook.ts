import { ReferralService, referralServiceKey } from '@/services/referral/api'
import { ReferralInviteRequestType, ReferralStatisticsType } from '@/services/referral/schema'
import { useToastController } from '@tamagui/toast'
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
  const toast = useToastController()
  const client = useQueryClient()

  return useMutation({
    mutationFn: (values: ReferralInviteRequestType) => ReferralService.invite(values),
    onSettled: () => {
      client.invalidateQueries({
        queryKey: [referralServiceKey],
      })
    },
    onSuccess: () => {
      toast.show('Succès', { message: 'L’invitation a bien été envoyée.', type: 'success' })
    },
  })
}

export function useReferralsPreRegister() {
  const toast = useToastController()
  const client = useQueryClient()

  return useMutation({
    mutationFn: ReferralService.preRegister,
    onSettled: () => {
      client.invalidateQueries({
        queryKey: [referralServiceKey],
      })
    },
    onSuccess: () => {
      toast.show('Succès', { message: 'La préinvitation a bien été envoyée.', type: 'success' })
    },
  })
}
