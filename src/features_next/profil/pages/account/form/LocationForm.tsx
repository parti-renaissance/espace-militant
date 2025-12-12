import { Fragment, useCallback, useState } from 'react'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import CountrySelect from '@/components/CountrySelect/CountrySelect'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import { Controller } from 'react-hook-form'
import { View, YStack } from 'tamagui'
import AbstractProfilForm from './AbstractProfilForm'
import { validateLocationFormSchema } from './schema'

export const LocationForm = ({ profile }: { profile: RestDetailedProfileResponse }) => {
  const [manualAddress, setManualAddress] = useState<boolean>(false)

  const onManualAddressToggle = useCallback(() => {
    setManualAddress((v) => !v)
  }, [])

  return (
    <AbstractProfilForm
      uuid={profile.uuid}
      defaultValues={
        {
          post_address: {
            address: profile.post_address?.address,
            city_name: profile.post_address?.city_name,
            postal_code: profile.post_address?.postal_code,
            country: profile.post_address?.country,
          },
        } as const
      }
      validatorSchema={validateLocationFormSchema}
    >
      {({ control }) => (
        <Fragment>
          <Text.LG semibold multiline>
            Localisation
          </Text.LG>

          <Text.P>
            Votre localisation détermine votre Assemblée départementale et votre circonscription legislative. Elle présélectionne également votre comité, mais
            vous pouvez en changer dans la limite du périmètre de votre Assemblée départementale.
            <Text.BR />
            <Text.BR />
            Si vous êtes adhérent, c’est sur cette adresse que vous recevrez votre relevé fiscal.
          </Text.P>

          {manualAddress ? (
            <View gap="$large">
              <Controller
                name="post_address.address"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input color="gray" placeholder="Adresse" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
                )}
              />

              <Controller
                name="post_address.city_name"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input color="gray" placeholder="Ville" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
                )}
              />

              <Controller
                name="post_address.postal_code"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input color="gray" placeholder="Code postal" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
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
            </View>
          ) : (
            <Controller
              name="post_address"
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
                formState: {
                  errors: { post_address: errorObject },
                },
              }) => (
                <AddressAutocomplete
                  color="gray"
                  placeholder="Adresse"
                  defaultValue={`${value?.address} ${value?.city_name}`}
                  onBlur={onBlur}
                  setAddressComponents={(x) =>
                    onChange({
                      address: x.address,
                      city_name: x.city,
                      postal_code: x.postalCode,
                      country: x.country,
                    })
                  }
                  error={
                    errorObject?.address || errorObject?.city_name || errorObject?.postal_code || errorObject?.country
                      ? 'Veuillez saisir une adresse valide (passez en manuel si besoin)'
                      : error?.message
                  }
                />
              )}
            />
          )}

          <YStack gap="$medium">
            {manualAddress ? (
              <VoxButton onPress={onManualAddressToggle} alignSelf="center" variant="outlined">
                Revenir à la saisie simplifiée.
              </VoxButton>
            ) : (
              <>
                <Text.P multiline>Un problème ?</Text.P>
                <VoxButton onPress={onManualAddressToggle} alignSelf="center" variant="outlined">
                  Saisir manuellement votre adresse.
                </VoxButton>
              </>
            )}
          </YStack>
        </Fragment>
      )}
    </AbstractProfilForm>
  )
}

export default LocationForm
