type ActionCoordinates = {
  latitude?: number | null
  longitude?: number | null
}

export const hasValidActionCoordinates = (address?: ActionCoordinates | null): address is ActionCoordinates & {
  latitude: number
  longitude: number
} => {
  if (address?.latitude == null || address?.longitude == null) {
    return false
  }

  const { latitude, longitude } = address

  return Number.isFinite(latitude) && Number.isFinite(longitude) && !(latitude === 0 && longitude === 0)
}
