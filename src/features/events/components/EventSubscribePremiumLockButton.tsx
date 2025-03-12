import { ComponentPropsWithoutRef } from 'react'
import { VoxButton } from '@/components/Button'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'
import { RestItemEvent } from '@/services/events/schema'
import { HelpingHand } from '@tamagui/lucide-icons'

export type PremiumLockButtonProps = ComponentPropsWithoutRef<typeof VoxButton> &
  Pick<RestItemEvent, 'uuid'> & {
    isPremium?: boolean
    isDue?: boolean
    userUuid?: string
    slug?: string
  }

export const EventSubscribePremiumLockButton = ({ isDue, slug, variant, ...buttonProps }: PremiumLockButtonProps) => {
  const dynVariant = variant === 'contained' ? 'soft' : 'outlined'
  const button = (
    <VoxButton iconLeft={HelpingHand} variant={dynVariant} theme={'yellow'} testID="event-subscribe-lock-button" {...buttonProps}>
      {isDue ? 'Me mettre à jour et m’inscrire' : 'J’adhère pour m’inscrire'}
    </VoxButton>
  )
  return buttonProps.disabled ? (
    button
  ) : (
    <RenewMembershipButton
      text={isDue ? 'Me mettre à jour et m’inscrire' : 'J’adhère pour m’inscrire'}
      iconLeft={HelpingHand}
      variant={dynVariant}
      page={`event_${slug}`}
      testID="event-subscribe-lock-button"
      style={{
        width: buttonProps.full ? '100%' : undefined,
      }}
      {...buttonProps}
    />
  )
}
