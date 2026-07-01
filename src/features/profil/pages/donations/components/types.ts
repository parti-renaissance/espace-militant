import type { RestDetailedProfileResponse } from '@/services/profile/schema'

export type CommonMembershipCardProps = Pick<RestDetailedProfileResponse, 'last_membership_donation' | 'other_party_membership'> & {
  full?: boolean
}
