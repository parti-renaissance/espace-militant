import { ReferralService, referralServiceKey } from '@/services/referral/api'
import { ReferralInviteRequestType } from '@/services/referral/schema'
import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useReferrals() {
  return useQuery({
    queryFn: () => ReferralService.get(),
    queryKey: [referralServiceKey],
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
