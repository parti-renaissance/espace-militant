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
}

function AddressAutocomplete({
  setAddressComponents,
  defaultValue,
  error,
  maxWidth,
  minWidth,
  onBlur,
  onReset,
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
      return
    }
    setValue(id)
    mutateAsync(id).then((placeDetails) => {
      if (placeDetails?.formatted && placeDetails.details && placeDetails.geometry) {
        setAddressComponents?.(googleAddressMapper(placeDetails))
      }
    })
  }

  return (
    <YStack minWidth={minWidth} maxWidth={maxWidth}>
      <Select
        placeholder={'Adresse'}
        value={value}
        onChange={onPlaceSelect}
        onBlur={onBlur}
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
            label: x.description,
          })) ?? []),
          ...(defaultValue ? [{ value: 'default', label: defaultValue }] : []),
        ]}
        error={error}
      />
    </YStack>
  )
}

export default memo(AddressAutocomplete)

const lol = 'fergerger'
lol.startsWith('@')
