import type { OptionsArray } from '@/components/base/BigSwitch'

export const HUB_TABS: OptionsArray = [
  { label: 'Tous', value: 'all' },
  { label: "J'y participe", value: 'subscribed' },
]

export const FEED_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 400,
} as const
