import { type GoogleAddressPlaceResult } from '../network/ApiService'

type GoogleAddressMapperParams = {
  placeDetails: GoogleAddressPlaceResult
  addressFallback?: boolean
}

export default function googleAddressMapper({
  placeDetails,
  addressFallback = false,
}: GoogleAddressMapperParams): {
  address: string
  city: string
  postalCode: string
  country: string
  location: {
    lat: number
    lng: number
  }
} {
  const res = placeDetails.details!
  const extract = (el: string) => res.find(({ types }) => types.includes(el))
  const country = extract('country')

  const place = res.reduce((acc, currentValue) => {
    for (const key of currentValue.types) {
      acc[key] = currentValue
    }

    return acc
  }, {} as PlaceData)

  return {
    address: getAddressValue(place) || (addressFallback ? 'Lieu communiqué bientôt' : ''),
    city: getCityName(place),
    postalCode: getPostalCode(place),
    country: country?.short_name ?? '',
    location: {
      lat: placeDetails.geometry!.location.lat as unknown as number,
      lng: placeDetails.geometry!.location.lng as unknown as number,
    },
  }
}

interface PlaceData {
  street_number: null | google.maps.GeocoderAddressComponent
  route: null | google.maps.GeocoderAddressComponent
  locality: null | google.maps.GeocoderAddressComponent
  postal_town: null | google.maps.GeocoderAddressComponent
  sublocality_level_1: null | google.maps.GeocoderAddressComponent
  sublocality_level_2: null | google.maps.GeocoderAddressComponent
  sublocality_level_3: null | google.maps.GeocoderAddressComponent
  postal_code: null | google.maps.GeocoderAddressComponent
  postal_code_prefix: null | google.maps.GeocoderAddressComponent
  plus_code: null | google.maps.GeocoderAddressComponent
  country: null | google.maps.GeocoderAddressComponent
  administrative_area_level_1: null | google.maps.GeocoderAddressComponent
}

const getCityName = (placeData: PlaceData): string =>
  (placeData.locality && placeData.locality.long_name) ??
  (placeData.sublocality_level_1 && placeData.sublocality_level_1.long_name) ??
  (placeData.postal_town && placeData.postal_town.long_name) ??
  ''

const getPostalCode = (placeData: PlaceData): string =>
  (placeData.postal_code && placeData.postal_code.long_name) ?? (placeData.postal_code_prefix && placeData.postal_code_prefix.long_name) ?? ''

const getAddressValue = (placeData: PlaceData): string =>
  [(placeData.street_number && placeData.street_number.long_name) ?? '', (placeData.route && placeData.route.long_name) ?? ''].join(' ').trim() ??
  [
    (placeData.sublocality_level_3 && placeData.sublocality_level_3.long_name) ?? '',
    (placeData.sublocality_level_2 && placeData.sublocality_level_2.long_name) ?? '',
    (placeData.sublocality_level_1 && placeData.sublocality_level_1.long_name) ?? '',
  ]
    .filter((el) => null != el && '' !== el)
    .join(', ')
    .trim()
