import { useCallback } from 'react'
import { Platform, ViewToken } from 'react-native'
import { useHits } from '@/services/hits/hook'
import { ObjectType } from '@/services/hits/schema'

interface TrackableItem {
  objectType: ObjectType
  objectId: string
  source?: string
  utmSource?: string
  utmCampaign?: string
  referrerCode?: string
}

export const useListImpressionTracking = () => {
  const { trackImpression } = useHits()

  const createOnViewableItemsChanged = useCallback(
    (items: TrackableItem[]) => {
      return ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        // Sur mobile uniquement, tracker les impressions via FlatList/SectionList
        if (Platform.OS !== 'web') {
          viewableItems.forEach((viewToken) => {
            if (viewToken.isViewable && viewToken.item) {
              // Trouver l'item correspondant dans notre liste
              const item = items.find((item) => item.objectId === viewToken.item?.objectID)
              if (item) {
                try {
                  trackImpression({
                    object_type: item.objectType,
                    object_id: item.objectId,
                    source: item.source,
                    utm_source: item.utmSource,
                    utm_campaign: item.utmCampaign,
                    referrer_code: item.referrerCode,
                  })
                } catch (error) {
                  // Silently ignore tracking errors - they should not impact user experience
                  if (__DEV__) {
                    console.warn('[useListImpressionTracking] trackImpression error:', error)
                  }
                }
              }
            }
          })
        }
      }
    },
    [trackImpression]
  )

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 400,
  }

  return {
    createOnViewableItemsChanged,
    viewabilityConfig,
  }
}
