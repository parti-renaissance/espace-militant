import { useQuery } from '@tanstack/react-query'
import { getZoneAutocomplete, getPlaceAutocomplete, getPlaceDetails } from './api'
import { ZoneAutocompleteRequest, PlaceAutocompleteRequest, PlaceDetailsRequest } from './schema'

export const QUERY_KEY_ZONE_AUTOCOMPLETE = 'zones-autocomplete'
export const QUERY_KEY_ZONE_DETAILS = 'zone-details'
export const QUERY_KEY_PLACE_AUTOCOMPLETE = 'places-autocomplete'
export const QUERY_KEY_PLACE_DETAILS = 'place-details'

export const useZoneAutocomplete = (params: ZoneAutocompleteRequest, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEY_ZONE_AUTOCOMPLETE, params],
    queryFn: () => getZoneAutocomplete(params),
    enabled: enabled && params.q.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const usePlaceAutocomplete = (params: PlaceAutocompleteRequest, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEY_PLACE_AUTOCOMPLETE, params],
    queryFn: () => getPlaceAutocomplete(params),
    enabled: enabled && params.input.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const usePlaceDetails = (params: PlaceDetailsRequest, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEY_PLACE_DETAILS, params],
    queryFn: () => getPlaceDetails(params),
    enabled: enabled && !!params.place_id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
} 