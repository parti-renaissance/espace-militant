import MapboxGl from '@/components/Mapbox/Mapbox'
import { isBefore } from 'date-fns'

import type { RestAction } from '@/services/actions/schema'

export function createActionMapSource(actions: RestAction[], active: string): MapboxGl.ShapeSource['props']['shape'] {
  return {
    type: 'FeatureCollection',
    features: actions.map((action) => {
      const isActive = action.uuid === active
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [action.post_address.longitude, action.post_address.latitude],
        },
        properties: {
          priority: isActive ? 1 : 0,
          isRegister: !!action.user_registered_at,
          isPassed: isBefore(action.date, new Date()),
          isActive,
          ...action,
        },
      }
    }),
  }
}
