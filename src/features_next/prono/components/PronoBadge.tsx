import { ComponentProps } from 'react'
import { styled, View } from 'tamagui'

import Text from '@/components/base/Text'

import { PRONO_PAGE_COPY } from '../model'
import SoccerBall from './SoccerBall'

const BadgeFrame = styled(View, {
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$xsmall',
  backgroundColor: '#4555D1',
  borderRadius: '$12',
  paddingVertical: '$xsmall',
  paddingHorizontal: '$small',
})

type PronoBadgeProps = ComponentProps<typeof BadgeFrame>

export default function PronoBadge(props: PronoBadgeProps) {
  return (
    <BadgeFrame {...props}>
      <SoccerBall size={14} color="white" />
      <Text.SM semibold color="white">
        {PRONO_PAGE_COPY.badge}
      </Text.SM>
    </BadgeFrame>
  )
}
