import { YStack } from 'tamagui'

import type { InscriptionConfigItem } from '../config'

type SignupInscriptionHeaderProps = Pick<InscriptionConfigItem, 'TitleComponent' | 'SubtitleComponent'>

export default function SignupInscriptionHeader({ TitleComponent, SubtitleComponent }: SignupInscriptionHeaderProps) {
  return (
    <YStack gap="$medium">
      {TitleComponent}
      {SubtitleComponent}
    </YStack>
  )
}
