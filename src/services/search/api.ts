import { api } from '@/utils/api'
import * as schemas from './schema'

// API pour les zones
export const getZoneAutocomplete = (params: schemas.ZoneAutocompleteRequest) =>
  api({
    method: 'get',
    path: '/api/v3/zone/autocomplete',
    requestSchema: schemas.ZoneAutocompleteRequestSchema,
    responseSchema: schemas.ZoneAutocompleteResponseSchema,
    type: 'private',
  })(params)

// API pour les places (Google Places)
export const getPlaceAutocomplete = (params: schemas.PlaceAutocompleteRequest) =>
  api({
    method: 'get',
    path: '/api/v3/place/autocomplete',
    requestSchema: schemas.PlaceAutocompleteRequestSchema,
    responseSchema: schemas.PlaceAutocompleteResponseSchema,
    type: 'private',
  })(params)

export const getPlaceDetails = (params: schemas.PlaceDetailsRequest) =>
  api({
    method: 'get',
    path: '/api/v3/place/details',
    requestSchema: schemas.PlaceDetailsRequestSchema,
    responseSchema: schemas.PlaceDetailsResponseSchema,
    type: 'private',
  })(params) 