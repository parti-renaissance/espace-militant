import type { MapState } from '@rnmapbox/maps'
import type { Position as GeoPosition } from 'geojson'

import type { HubItemMapInitialBounds } from '../components/HubItemMap'

export type MapSearchBbox = {
  ne: { lat: number; lng: number }
  sw: { lat: number; lng: number }
}

export type MapCameraSnapshot = {
  center: [number, number]
  zoom: number
  bbox: MapSearchBbox
}

export const MAP_IDLE_DEBOUNCE_MS = 300
export const ZOOM_SEARCH_DELTA_THRESHOLD = 0.5
export const BBOX_CENTER_OFFSET_RATIO = 0.3

export const mapSearchBboxFromHubBounds = (bounds: HubItemMapInitialBounds): MapSearchBbox => ({
  ne: { lat: bounds.ne[1], lng: bounds.ne[0] },
  sw: { lat: bounds.sw[1], lng: bounds.sw[0] },
})

export const mapCameraSnapshotFromHubBounds = (bounds: HubItemMapInitialBounds, zoom: number): MapCameraSnapshot => {
  const bbox = mapSearchBboxFromHubBounds(bounds)
  return {
    center: [(bounds.ne[0] + bounds.sw[0]) / 2, (bounds.ne[1] + bounds.sw[1]) / 2],
    zoom,
    bbox,
  }
}

export const mapCameraSnapshotFromVisibleBounds = (
  bounds: [GeoPosition, GeoPosition],
  zoom: number,
): MapCameraSnapshot => {
  const [ne, sw] = bounds
  return {
    center: [(ne[0] + sw[0]) / 2, (ne[1] + sw[1]) / 2],
    zoom,
    bbox: {
      ne: { lat: ne[1], lng: ne[0] },
      sw: { lat: sw[1], lng: sw[0] },
    },
  }
}

export const mapCameraSnapshotFromMapState = (state: MapState): MapCameraSnapshot => {
  const { center, bounds, zoom } = state.properties
  return {
    center: center as [number, number],
    zoom,
    bbox: {
      ne: { lat: bounds.ne[1], lng: bounds.ne[0] },
      sw: { lat: bounds.sw[1], lng: bounds.sw[0] },
    },
  }
}

/** Affiche le bouton si le zoom ou le centre dépassent la zone morte par rapport à la dernière recherche. */
export const shouldShowSearchInThisAreaButton = (current: MapCameraSnapshot, lastSearch: MapCameraSnapshot): boolean => {
  if (Math.abs(current.zoom - lastSearch.zoom) > ZOOM_SEARCH_DELTA_THRESHOLD) {
    return true
  }

  const bboxWidthLng = Math.abs(lastSearch.bbox.ne.lng - lastSearch.bbox.sw.lng)
  const bboxHeightLat = Math.abs(lastSearch.bbox.ne.lat - lastSearch.bbox.sw.lat)
  const centerDeltaLng = Math.abs(current.center[0] - lastSearch.center[0])
  const centerDeltaLat = Math.abs(current.center[1] - lastSearch.center[1])

  return (
    centerDeltaLng > bboxWidthLng * BBOX_CENTER_OFFSET_RATIO || centerDeltaLat > bboxHeightLat * BBOX_CENTER_OFFSET_RATIO
  )
}
