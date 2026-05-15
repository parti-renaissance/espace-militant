import React from 'react'
import { TouchableOpacity } from 'react-native'
import { YStack } from 'tamagui'
import { Controller } from 'react-hook-form'

import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import CountrySelect from '@/components/CountrySelect/CountrySelect'

import { useActionFormContext } from '../helpers/context'

export default function ActionAddressField() {
  const { control, manualAddress, onManualAddressToggle } = useActionFormContext()

  return (
    <YStack gap="$medium">
      {manualAddress ? (
        <YStack gap="$medium">
          <Controller
            name="post_address.address"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input size="sm" color="gray" placeholder="Adresse" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
            )}
          />
          <Controller
            name="post_address.city_name"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input size="sm" color="gray" placeholder="Ville" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
            )}
          />
          <Controller
            name="post_address.postal_code"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input size="sm" color="gray" placeholder="Code postal" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
            )}
          />
          <Controller
            name="post_address.country"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <CountrySelect
                id="country_select"
                color="gray"
                value={value ?? undefined}
                placeholder="Pays"
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
        </YStack>
      ) : (
        <Controller
          name="post_address"
          control={control}
          render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
            <AddressAutocomplete
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
      )}
      <TouchableOpacity onPress={onManualAddressToggle}>
        {manualAddress ? (
          <Text color="$textSecondary" textAlign="center">
            <Text color="$blue6">Revenir</Text> à une saisie simplifiée
          </Text>
        ) : (
          <Text color="$textSecondary" textAlign="center">
            Un problème ? <Text color="$blue6">Cliquez ici</Text> pour saisir manuellement votre adresse.
          </Text>
        )}
      </TouchableOpacity>
    </YStack>
  )
}
