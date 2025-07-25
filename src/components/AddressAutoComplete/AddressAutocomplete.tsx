import React, { ComponentProps, memo, useCallback, useState } from 'react'
import usePlaceAutocomplete from '@/components/AddressAutoComplete/Hooks/usePlaceAutocomplete'
import usePlaceDetails from '@/components/AddressAutoComplete/Hooks/usePlaceDetails'
import googleAddressMapper from '@/data/mapper/googleAddressMapper'
import { MapPin, Search } from '@tamagui/lucide-icons'
import { useDebounceValue, YStack } from 'tamagui'
import Select from '../base/Select/SelectV3'

export interface AddressAutocompleteProps {
  defaultValue?: string
  setAddressComponents?: (addressComponents: {
    address: string
    city: string
    postalCode: string
    country: string
    location?: {
      lat: number
      lng: number
    }
  }) => void
  onBlur?: () => void
  error?: string
  minimal?: boolean
  maxWidth?: string | number
  minWidth?: string | number
  forceSelect?: boolean
  placeholder?: string
  onReset?: () => void
  enableFallback?: boolean
}

function AddressAutocomplete({
  setAddressComponents,
  defaultValue,
  error,
  maxWidth,
  minWidth,
  onBlur,
  onReset,
  enableFallback = false,
  ...rest
}: Readonly<AddressAutocompleteProps> & Omit<ComponentProps<typeof Select>, 'handleQuery' | 'options' | 'value' | 'onChange'>): JSX.Element {
  const [value, setValue] = useState<string>('default')
  const [query, setQuery] = useState<string>('')

  const address = useDebounceValue(query, 500)

  const { data: autocompleteResults, isFetching } = usePlaceAutocomplete({ address, keepPreviousData: true })
  const { mutateAsync } = usePlaceDetails()

  // On input notify that user is interacting with component
  const onInput = useCallback((text: string) => {
    setQuery(text)
  }, [])

  // When place is selected, setPlaceId and trigger results close.
  const onPlaceSelect = (id: string) => {
    if (id.length === 0) {
      onReset?.()
      onBlur?.()
      return
    }
    setValue(id)
  
    // Trouver la prédiction sélectionnée dans les résultats autocomplete
    const selectedPrediction = autocompleteResults?.find(x => x.place_id === id)
  
    mutateAsync(id)
      .then((placeDetails) => {
        if (placeDetails?.formatted && placeDetails.details && placeDetails.geometry) {
          const fallback = enableFallback && selectedPrediction ? !isProbablyAddress(selectedPrediction) : false
          setAddressComponents?.(
            googleAddressMapper({ placeDetails, addressFallback: fallback })
          )
        }
      })
      .finally(() => {
        onBlur?.()
      })
  }

  const isProbablyAddress = (prediction: google.maps.places.AutocompletePrediction): boolean => {
    const types = prediction.types || [];
    const mainText = prediction.structured_formatting?.main_text || '';
    const secondaryText = prediction.structured_formatting?.secondary_text || '';
  
    const hasAddressLikeType = types.some(t =>
      ['street_address', 'premise', 'subpremise', 'route', 'establishment'].includes(t)
    );
  
    const containsStreetInSecondary = /(rue|avenue|boulevard|chemin|impasse|route|place)/i.test(secondaryText);
  
    const startsWithNumber = /^\d+/.test(mainText);
  
    return hasAddressLikeType || containsStreetInSecondary || startsWithNumber;
  };  

  return (
    <YStack minWidth={minWidth} maxWidth={maxWidth}>
      <Select
        placeholder={'Adresse'}
        value={value}
        onChange={onPlaceSelect}
        icon={MapPin}
        searchable
        searchableOptions={{
          autocompleteCallback: onInput,
          isFetching,
          icon: Search,
        }}
        {...rest}
        options={[
          ...(autocompleteResults?.map((x) => ({
            value: x.place_id,
            label: enableFallback && !isProbablyAddress(x) ? `🔜 Lieu communiqué bientôt, ${x.description}` : x.description,
          })) ?? []),
          ...(defaultValue ? [{ value: 'default', label: defaultValue }] : []),
        ]}
        error={error}
      />
    </YStack>
  )
}

export default memo(AddressAutocomplete)
