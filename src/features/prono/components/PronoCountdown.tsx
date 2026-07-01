import { Clock } from '@tamagui/lucide-icons'
import { styled, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import { padCountdownUnit as pad, usePronoCountdown } from '../hooks/usePronoCountdown'

const Bar = styled(XStack, {
  alignSelf: 'stretch',
  backgroundColor: '#3A3DA8',
  borderRadius: 16,
  paddingTop: 24,
  marginLeft: 20,
  marginRight: 20,
  paddingBottom: '$small',
  paddingHorizontal: '$medium',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$small',
})

type PronoCountdownProps = {
  targetAt: string
}

export default function PronoCountdown({ targetAt }: PronoCountdownProps) {
  const remaining = usePronoCountdown(targetAt)

  const units: { value: number; unit: string }[] = [
    { value: remaining.days, unit: 'j' },
    { value: remaining.hours, unit: 'h' },
    { value: remaining.minutes, unit: 'm' },
    { value: remaining.seconds, unit: 's' },
  ]

  return (
    <YStack gap="$small" alignItems="center" marginTop={-32}>
      <Bar>
        <Clock size={18} color="white" />
        <Text.MD semibold color="white">
          Résultat dans
        </Text.MD>
        <XStack alignItems="baseline" gap="$xsmall">
          {units.map(({ value, unit }) => (
            <XStack key={unit} alignItems="baseline">
              <Text.LG bold color="white">
                {pad(value)}
              </Text.LG>
              <Text.SM color="white">{unit}</Text.SM>
            </XStack>
          ))}
        </XStack>
      </Bar>
      <Text.MD medium lineHeight={22} letterSpacing={0} textAlign="center" color="#4555D1">
        Le résultat vous sera notifié à la fin du match
      </Text.MD>
    </YStack>
  )
}
