import { VoxButton, VoxButtonProps } from '@/components/Button'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'

type RenewMembershipButtonProps = {
  text?: string
  page: string
  state?: string
} & VoxButtonProps

export default function ({ page, state, text = 'Me mettre à jour', size = 'lg', ...rest }: RenewMembershipButtonProps) {
  const { isPending, open: handleAdhesionLink } = useOpenExternalContent({ slug: 'adhesion', utm_campaign: page })

  return (
    <VoxButton size={size} theme="yellow" disabled={isPending} onPress={handleAdhesionLink({ state })} {...rest}>
      {text}
    </VoxButton>
  )
}
