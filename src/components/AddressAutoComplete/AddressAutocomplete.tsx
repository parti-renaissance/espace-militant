import React, { ComponentProps, memo, useCallback, useState } from 'react'
import usePlaceAutocomplete from '@/components/AddressAutoComplete/Hooks/usePlaceAutocomplete'
import usePlaceDetails from '@/components/AddressAutoComplete/Hooks/usePlaceDetails'
import googleAddressMapper from '@/data/mapper/googleAddressMapper'
import { MapPin, Search } from '@tamagui/lucide-icons'
import { useDebounceValue, YStack } from 'tamagui'
import Select from '../base/Select/SelectV3'

const STREET_TYPES = new Set(['street_address', 'premise', 'subpremise', 'route', 'establishment'])

const hasStreetType = (types: string[] = []) => types.some((t) => STREET_TYPES.has(t))

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
  addressOnly?: boolean
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
  addressOnly = false,
  ...rest
}: Readonly<AddressAutocompleteProps> & Omit<ComponentProps<typeof Select>, 'handleQuery' | 'options' | 'value' | 'onChange'>): JSX.Element {
  const [value, setValue] = useState<string>('default')
  const [query, setQuery] = useState<string>('')

  const address = useDebounceValue(query, 500)

  const { data: autocompleteResults, isFetching } = usePlaceAutocomplete({ address, keepPreviousData: true })
  const { mutateAsync } = usePlaceDetails()

  const onInput = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const onPlaceSelect = (id: string) => {
    if (id.length === 0) {
      onReset?.()
      onBlur?.()
      return
    }
    setValue(id)

    const selectedPrediction = autocompleteResults?.find((x) => x.place_id === id)

    mutateAsync(id)
      .then((placeDetails) => {
        if (placeDetails?.formatted && placeDetails.details && placeDetails.geometry) {
          const fallback = enableFallback && selectedPrediction ? !hasStreetType(selectedPrediction.types) : false
          setAddressComponents?.(googleAddressMapper({ placeDetails, addressFallback: fallback }))
        }
      })
      .finally(() => {
        onBlur?.()
      })
  }

  const predictions = addressOnly
    ? (autocompleteResults?.filter((p) => hasStreetType(p.types)) ?? [])
    : (autocompleteResults ?? [])

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
          ...predictions.map((x) => ({
            value: x.place_id,
            label: enableFallback && !hasStreetType(x.types) ? `🔜 Lieu communiqué bientôt, ${x.description}` : x.description,
          })),
          ...(defaultValue ? [{ value: 'default', label: defaultValue }] : []),
        ]}
        error={error}
      />
    </YStack>
  )
}

export default memo(AddressAutocomplete)
