import { Fragment, useMemo } from 'react'
import DatePickerField from '@/components/DatePicker'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import NationalitySelect from '@/components/NationalitySelect/NationalitySelect'
import { useGetDetailProfil } from '@/services/profile/hook'
import { Info } from '@tamagui/lucide-icons'
import { Controller } from 'react-hook-form'
import { YStack } from 'tamagui'
import * as z from 'zod'
import AbstractProfilForm from './AbstractProfilForm'
import { validateBirthdateFormSchema, validateNationalityFormSchema } from './schema'

const ForceBirthdateModal = () => {
  const { data: profile } = useGetDetailProfil()
  const message = useMemo(() => {
    const base = 'Pour accéder à votre profil, veuillez renseigner votre '
    if (profile.birthdate && !profile.nationality) {
      return base + 'nationalité.'
    }
    if (!profile.birthdate && profile.nationality) {
      return base + 'date de naissance.'
    }
    return base
  }, [profile])

  return (
    <ModalOrPageBase open={!profile.birthdate || !profile.nationality} header={<VoxHeader.ModalFrame />}>
      <AbstractProfilForm
        uuid={profile.uuid}
        defaultValues={
          {
            birthdate: profile.birthdate,
            nationality: profile.nationality ?? undefined,
          } as const
        }
        validatorSchema={z.object({
          birthdate: validateBirthdateFormSchema,
          nationality: validateNationalityFormSchema,
        })}
      >
        {({ control }) => (
          <Fragment>
            <MessageCard theme="yellow" iconLeft={Info}>
              {message}
            </MessageCard>

            <YStack gap="$large">
              {!profile.birthdate ? (
                <Controller
                  name="birthdate"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <DatePickerField
                      color="gray"
                      label="Date de naissance"
                      type="date"
                      value={value ?? undefined}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              ) : null}
              {!profile.nationality ? (
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <NationalitySelect
                      id="nationality"
                      color="gray"
                      value={value ?? undefined}
                      placeholder="Nationalité"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              ) : null}
            </YStack>
          </Fragment>
        )}
      </AbstractProfilForm>
    </ModalOrPageBase>
  )
}

export default ForceBirthdateModal
