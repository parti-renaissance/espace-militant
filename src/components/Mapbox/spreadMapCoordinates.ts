const METERS_PER_DEGREE_LAT = 111_320
const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5))
const DEFAULT_RADIUS_METERS = 5
const DEFAULT_LOCATION_GROUP_DECIMALS = 6

/** Point minimal pour disperser des marqueurs superposés sur une carte. */
export type SpreadableMapPoint = {
  id: string
  longitude: number
  latitude: number
}

export type SpreadMapCoordinatesOptions = {
  /** Rayon du cercle de dispersion en mètres (défaut : 5). */
  radiusMeters?: number
  /**
   * Si `true`, seuls les points partageant la même adresse (arrondie) sont décalés ;
   * les points isolés gardent leurs coordonnées exactes.
   */
  onlyWhenOverlapping?: boolean
  /** Précision du regroupement « même adresse » (défaut : 6 décimales, ~0,1 m). */
  locationGroupDecimals?: number
}

const coordinateCache = new Map<string, [number, number]>()

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

const hashId = (id: string): number => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const stableAngleFromId = (id: string): number => (hashId(id) * GOLDEN_ANGLE_RAD) % (2 * Math.PI)

const locationGroupKey = (latitude: number, longitude: number, decimals: number) => {
  const factor = 10 ** decimals
  return `${Math.round(latitude * factor) / factor}:${Math.round(longitude * factor) / factor}`
}

const cacheKey = (point: SpreadableMapPoint, radiusMeters: number) => `${point.id}:${point.longitude}:${point.latitude}:${radiusMeters}`

/** Dispersion stable d’un point autour de ses coordonnées (angle dérivé de `id`). */
export const spreadMapCoordinate = (point: SpreadableMapPoint, options?: SpreadMapCoordinatesOptions): [number, number] => {
  const radiusMeters = options?.radiusMeters ?? DEFAULT_RADIUS_METERS
  const radiusDeg = radiusMeters / METERS_PER_DEGREE_LAT
  const angle = stableAngleFromId(point.id)
  const cosLat = Math.cos(toRadians(point.latitude))
  const safeCosLat = Math.max(cosLat, 0.1)
  const deltaLat = radiusDeg * Math.sin(angle)
  const deltaLng = (radiusDeg * Math.cos(angle)) / safeCosLat
  return [point.longitude + deltaLng, point.latitude + deltaLat]
}

/**
 * Coordonnées dispersées par `id`, avec cache module pour limiter les recalculs.
 * Chaque `id` conserve toujours la même position sur le cercle, indépendamment de l’ordre de la liste.
 */
export const spreadMapCoordinates = (points: SpreadableMapPoint[], options?: SpreadMapCoordinatesOptions): Map<string, [number, number]> => {
  const radiusMeters = options?.radiusMeters ?? DEFAULT_RADIUS_METERS
  const onlyWhenOverlapping = options?.onlyWhenOverlapping ?? false
  const locationDecimals = options?.locationGroupDecimals ?? DEFAULT_LOCATION_GROUP_DECIMALS

  const overlapCounts = new Map<string, number>()
  if (onlyWhenOverlapping) {
    for (const point of points) {
      const locKey = locationGroupKey(point.latitude, point.longitude, locationDecimals)
      overlapCounts.set(locKey, (overlapCounts.get(locKey) ?? 0) + 1)
    }
  }

  const result = new Map<string, [number, number]>()
  const activeCacheKeys = new Set<string>()

  for (const point of points) {
    const pointCacheKey = cacheKey(point, radiusMeters)
    activeCacheKeys.add(pointCacheKey)

    if (onlyWhenOverlapping) {
      const locKey = locationGroupKey(point.latitude, point.longitude, locationDecimals)
      if ((overlapCounts.get(locKey) ?? 0) <= 1) {
        result.set(point.id, [point.longitude, point.latitude])
        continue
      }
    }

    const cached = coordinateCache.get(pointCacheKey)
    if (cached) {
      result.set(point.id, cached)
      continue
    }

    const coords = spreadMapCoordinate(point, { radiusMeters })
    coordinateCache.set(pointCacheKey, coords)
    result.set(point.id, coords)
  }

  for (const key of coordinateCache.keys()) {
    if (!activeCacheKeys.has(key)) {
      coordinateCache.delete(key)
    }
  }

  return result
}
