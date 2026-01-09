import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useGetTags } from '@/services/profile/hook'
import type { RestDetailedProfileResponse } from '@/services/profile/schema'
import { RestProfilResponse } from '@/services/profile/schema'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { getMembershipStatus } from '@/utils/membershipStatus'
import { FullWrapper } from './FullWrapper'
import ImpossibleMembershipCard from './ImpossibleMembershipCard'
import JoinMembershipCard from './JoinMembershipCard'
import RenewMembershipCard from './RenewMembershipCard'
import ValidMembershipCard from './ValidMembershipCard'
import { UserTagEnum } from '@/core/entities/UserProfile'

type MembershipCardProps = Pick<RestDetailedProfileResponse, 'last_membership_donation' | 'other_party_membership'> & {
  full?: boolean
}

const cardsByStatus = {
  valid: ValidMembershipCard,
  impossible: ImpossibleMembershipCard,
  renew: RenewMembershipCard,
  join: JoinMembershipCard,
} as const

type CardStatus = keyof typeof cardsByStatus

const getCardByStatus = (status: CardStatus) => cardsByStatus[status]

const getMembershipCardStatus = (tags: RestProfilResponse['tags']): CardStatus | null => {
  const codes = tags.map((tag) => tag.code)

  if (codes.includes('sympathisant:autre_parti')) {
    return 'impossible'
  }
  const status = getMembershipStatus(tags)

  if (status === 'tofinish') {
    return 'join'
  }

  return status as CardStatus
}

const MembershipCard = (props: MembershipCardProps) => {
  const { tags, isPending } = useGetTags({ tags: [UserTagEnum.SYMPATHISANT, UserTagEnum.ADHERENT] })
  if (isPending || !tags)
    return (
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Title />
          <SkeCard.Content>
            <SkeCard.Description />
          </SkeCard.Content>
        </SkeCard.Content>
      </SkeCard>
    )
  const status = getMembershipCardStatus(tags ?? [])
  if (!status) return null
  const Card = getCardByStatus(status)
  return (
    <FullWrapper title="Cotisations" full={props.full}>
      <Card {...props} />
    </FullWrapper>
  )
}

export default MembershipCard
