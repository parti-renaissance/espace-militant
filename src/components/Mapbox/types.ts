export type MapboxOnPressEvent = {
  features: Array<GeoJSON.Feature>
  coordinates: {
    latitude: number
    longitude: number
  }
  point: {
    x: number
    y: number
  }
}
