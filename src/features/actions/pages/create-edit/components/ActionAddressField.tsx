import React from 'react'
import { YStack } from 'tamagui'
import { Controller } from 'react-hook-form'

import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'

import { useActionFormContext } from '../helpers/context'

export default function ActionAddressField() {
  const { control } = useActionFormContext()

  return (
    <YStack gap="$medium">
      <Controller
        name="post_address"
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <AddressAutocomplete
            addressOnly
            size="sm"
            color="gray"
            label="Localisation"
            placeholder="Rechercher une adresse"
            defaultValue={`${value?.address ?? ''} ${value?.city_name ?? ''}`.trim()}
            onBlur={onBlur}
            setAddressComponents={(x) =>
              onChange({
                address: x.address,
                city_name: x.city,
                postal_code: x.postalCode,
                country: x.country,
              })
            }
            error={error?.message}
          />
        )}
      />
    </YStack>
  )
}
