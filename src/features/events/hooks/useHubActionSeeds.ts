import { useMemo } from 'react'

import { mapHubItemToRestActionFull } from '@/services/actions/mapper'
import type { RestActionFull } from '@/services/actions/schema'
import type { RestHubItem } from '@/services/hub/schema'

export const useHubActionSeeds = (items: RestHubItem[] | undefined) =>
  useMemo(() => {
    const seeds = new Map<string, RestActionFull>()
    for (const item of items ?? []) {
      const seed = mapHubItemToRestActionFull(item)
      if (seed) {
        seeds.set(item.uuid, seed)
      }
    }
    return seeds
  }, [items])
