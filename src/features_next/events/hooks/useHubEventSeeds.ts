import { useMemo } from 'react'

import type { RestEvent } from '@/services/events/schema'
import { mapHubItemToRestEventSeed } from '@/services/hub/mapper'
import type { RestHubItem } from '@/services/hub/schema'

export const useHubEventSeeds = (items: RestHubItem[] | undefined) =>
  useMemo(() => {
    const seeds = new Map<string, RestEvent>()
    for (const item of items ?? []) {
      const seed = mapHubItemToRestEventSeed(item)
      const slug = item.slug
      if (seed && typeof slug === 'string' && slug.length > 0) {
        seeds.set(slug, seed)
      }
    }
    return seeds
  }, [items])
