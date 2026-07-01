import { Phone } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import { openExternalLink } from '@/utils/linkHandler'

const CONTACT_NATIONAL_LINK = 'https://parti.re/app-soutenir/contact-national'

type SoutenirContactNationalButtonProps = {
  userId?: string
}

export default function SoutenirContactNationalButton({ userId }: SoutenirContactNationalButtonProps) {
  return (
    <VoxButton variant="outlined" iconLeft={Phone} onPress={() => openExternalLink(CONTACT_NATIONAL_LINK, { public_id: userId })}>
      Être contacté par les équipes
    </VoxButton>
  )
}
