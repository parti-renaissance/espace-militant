import { styled, View, YStack } from 'tamagui';

import Text from '@/components/base/Text';
import Title from '@/components/Title/Title';

import { PRONO_PAGE_COPY } from '../model';
import SoccerBall from './SoccerBall';


const HeroBadge = styled(View, {
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$xsmall',
  backgroundColor: '#4555D1',
  borderRadius: '$12',
  paddingVertical: '$xsmall',
  paddingHorizontal: '$small',
})

export default function PronoHeroSection() {
  return (
    <YStack gap="$medium">
      <HeroBadge>
        <SoccerBall size={14} color="white" />
        <Text.SM semibold color="white">
          {PRONO_PAGE_COPY.badge}
        </Text.SM>
      </HeroBadge>
      <Title size="h1" aria-label="Défie Gabriel Attal">
        <Title.Text>Défie</Title.Text>
        <Title.Highlight>Gabriel Attal</Title.Highlight>
      </Title>
      <Title size="h1" aria-label="Défie Gabriel Attal">
        <Title.Text>sur le prochain match 🇫🇷</Title.Text>
      </Title>
      <Text fontSize={16} lineHeight={22} letterSpacing={0} color="#27221F">
        {PRONO_PAGE_COPY.subtitle}
      </Text>
    </YStack>
  )
}
