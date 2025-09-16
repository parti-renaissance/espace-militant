import { Fragment } from 'react'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import DatePickerField from '@/components/DatePicker'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import NationalitySelect from '@/components/NationalitySelect/NationalitySelect'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import { Info } from '@tamagui/lucide-icons'
import { Controller } from 'react-hook-form'
import { View, useMedia } from 'tamagui'
import AbstractProfilForm from './AbstractProfilForm'
import { validateInformationsFormSchema } from './schema'

const InformationsForm = ({ profile }: { profile: RestDetailedProfileResponse }) => {
  const media = useMedia()
  
  return (
    <AbstractProfilForm
      uuid={profile.uuid}
      defaultValues={
        {
          gender: profile.gender,
          first_name: profile.first_name,
          last_name: profile.last_name,
          birthdate: profile.birthdate,
          nationality: profile.nationality,
        } as const
      }
      validatorSchema={validateInformationsFormSchema}
    >
      {({ control }) => (
        <Fragment>
          {profile.certified && (
            <MessageCard iconLeft={Info} theme="yellow">
              Votre profil étant certifié, vous ne pouvez pas modifier vos informations d’identité.
            </MessageCard>
          )}
          <Text.LG semibold>Identité</Text.LG>
          <View gap="$large">
            <Controller
              name="gender"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Select
                  placeholder="Civilité"
                  onBlur={onBlur}
                  color="gray"
                  disabled={!!profile.certified}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  options={[
                    { value: 'male', label: 'Monsieur' },
                    { value: 'female', label: 'Madame' },
                  ]}
                />
              )}
            />
            <View flexDirection={media.gtMd ? 'row' : undefined} gap={media.gtMd ? '$medium' : '$large'}>
              <View flex={media.gtMd ? 1 : undefined} flexBasis={media.gtMd ? 0 : undefined}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <Input
                      color="gray"
                      disabled={!!profile.certified}
                      placeholder="Prénom"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </View>

              <View flex={media.gtMd ? 1 : undefined} flexBasis={media.gtMd ? 0 : undefined}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <Input
                      color="gray"
                      disabled={!!profile.certified}
                      placeholder="Nom"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>
            <View flexDirection={media.gtMd ? 'row' : undefined} gap={media.gtMd ? '$medium' : '$large'}>
              <View flex={media.gtMd ? 1 : undefined} flexBasis={media.gtMd ? 0 : undefined}>
                <Controller
                  name="birthdate"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <DatePickerField
                      color="gray"
                      disabled={!!profile.certified}
                      label="Date de naissance"
                      type="date"
                      value={value ?? undefined}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </View>

              <View flex={media.gtMd ? 1 : undefined} flexBasis={media.gtMd ? 0 : undefined}>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <NationalitySelect
                      id="nationality"
                      color="gray"
                      value={value ?? 'FR'}
                      placeholder="Nationalité"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </Fragment>
      )}
    </AbstractProfilForm>
  )
}

export default InformationsForm
