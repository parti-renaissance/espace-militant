import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

import { PRONO_PAGE_COPY } from '../model'
import PronoBadge from './PronoBadge'

type PronoHeroSectionProps = {
  showSubtitle?: boolean
  showBadge?: boolean
}

export default function PronoHeroSection({ showSubtitle = true, showBadge = true }: PronoHeroSectionProps) {
  return (
    <YStack gap="$large">
      {showBadge ? <PronoBadge /> : null}
      <YStack gap="$medium">
        <YStack gap="$xsmall">
          <Title size="h1" aria-label="Défie Gabriel Attal">
            <Title.Highlight>je défie Gabriel Attal</Title.Highlight>
          </Title>
          <Title size="h1">
            <Title.Text>sur le prochain match 🇫🇷</Title.Text>
          </Title>
        </YStack>
        {showSubtitle ? (
          <Text fontSize={16} lineHeight={22} letterSpacing={0} color="#27221F">
            {PRONO_PAGE_COPY.subtitle}
          </Text>
        ) : null}
      </YStack>
    </YStack>
  )
}
