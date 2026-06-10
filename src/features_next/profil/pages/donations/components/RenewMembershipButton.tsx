import { VoxButton, VoxButtonProps } from '@/components/Button'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { HIT_SOURCES, type HitSource } from '@/services/hits/constants'

type RenewMembershipButtonProps = {
  text?: string
  source?: string
  hitSource?: HitSource
  page: string
  state?: string
} & VoxButtonProps

export default function ({
  source,
  hitSource = HIT_SOURCES.PAGE_PROFIL,
  page,
  state,
  text = 'Me mettre à jour',
  size = 'lg',
  ...rest
}: RenewMembershipButtonProps) {
  const { isPending, open: handleAdhesionLink } = useOpenExternalContent({
    slug: 'adhesion',
    source: hitSource,
    utm_source: source,
    utm_campaign: page,
  })

  return (
    <VoxButton size={size} theme="yellow" disabled={isPending} onPress={handleAdhesionLink({ state })} {...rest}>
      {text}
    </VoxButton>
  )
}
