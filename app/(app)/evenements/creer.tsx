import { Suspense, useMemo, useState } from 'react'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFrame } from '@/components/base/FormFrames'
import Input from '@/components/base/Input/Input'
import Select, { SelectOption, SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import DatePickerField from '@/components/DatePickerV2'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Sparkle, Unlock, Video, Webcam } from '@tamagui/lucide-icons'
import { addHours, addMinutes, getHours, getMinutes, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { Controller, useForm } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'

function getTimezoneOffsetLabel(timeZone: string) {
  const offset = getTimezoneOffset(timeZone)

  return `UTC ${offset < 0 ? '' : '+'}${offset / 1000 / 60 / 60}h`
}

const timezones = Intl.supportedValuesOf('timeZone').map((timeZone) => ({
  value: timeZone,
  label: `${timeZone} (${getTimezoneOffsetLabel(timeZone)})`,
}))

export const getFormatedScope = (scope: RestUserScopesResponse[number]): SelectOption<string> => {
  return {
    value: scope.code,
    label: (
      <>
        <SF.Text semibold>{scope.name}</SF.Text> <SF.Text>{scope.zones.map(({ name, code }) => `${name} (${code})`).join(', ')}</SF.Text>
      </>
    ),
    theme: 'purple',
    icon: Sparkle,
  }
}

const visibilityOptions: SelectOption<EventFormData['visibility']>[] = [
  {
    value: 'adherent',
    icon: Lock,
    theme: 'yellow',
    label: 'Réservé aux adhérents',
  },
  {
    value: 'adherent_dues',
    icon: Lock,
    theme: 'yellow',
    label: 'Réservé aux adhérents à jour',
  },
  {
    value: 'private',
    icon: Lock,
    theme: 'gray',
    label: 'Réservé aux millitants',
  },
  {
    value: 'public',
    icon: Unlock,
    label: 'Ouvert au public',
  },
]

const roundMinutesToNextDecimal = (date: Date) => {
  // Remove seconds and milliseconds for precision
  const cleanDate = setMilliseconds(setSeconds(date, 0), 0)

  // Get the current minutes
  const currentMinutes = cleanDate.getMinutes()

  // Round up to the next multiple of 10
  const roundedMinutes = Math.ceil(currentMinutes / 10) * 10

  // Adjust the date
  if (roundedMinutes === 60) {
    // If rounding moves to the next hour
    return addMinutes(cleanDate, roundedMinutes - currentMinutes) // Add remaining minutes to reach the next hour
  } else {
    return setMinutes(cleanDate, roundedMinutes) // Set the rounded minutes
  }
}

export default function CreateEvent() {
  return (
    <Suspense>
      <CreateEventForm />
    </Suspense>
  )
}

export function CreateEventForm() {
  const scopes = useGetExecutiveScopes()
  const scopeOptions = useMemo(() => scopes.data.list.map(getFormatedScope), [scopes.data.list])
  const cleanDate = roundMinutesToNextDecimal(new Date())
  const startDate = addHours(cleanDate, 1)
  const [mode, setMode] = useState('meeting')

  const defaultValues = {
    scope: scopes.data.default?.code,
    name: '',
    category: undefined,
    description: '',
    begin_at: startDate,
    finish_at: addHours(startDate, 1),
    time_zone: 'Europe/Paris',
    capacity: undefined,
    mode: 'meeting',
    visio_url: undefined,
    post_address: {
      address: '',
      postal_code: '',
      city_name: '',
      country: '',
    },
    visibility: 'public',
    live_url: '',
  } as const

  const { control, handleSubmit, getValues } = useForm<EventFormData>({
    defaultValues,
    resolver: zodResolver(createEventSchema),
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(
    (e) => {
      console.log(e)
    },
    (e) => {
      const values = getValues()
      const errors = createEventSchema.safeParse(values)
      console.log(errors.error)
      console.log(e)
    },
  )

  return (
    <PageLayout>
      <PageLayout.MainSingleColumn justifyContent="center" alignItems="center">
        <VoxCard width={400}>
          <VoxCard.Content>
            <Controller
              render={({ field, fieldState }) => {
                return (
                  <Select
                    error={fieldState.error?.message}
                    size="sm"
                    theme="purple"
                    matchTextWithTheme
                    label="Pour"
                    value={field.value}
                    options={scopeOptions}
                    onChange={field.onChange}
                  />
                )
              }}
              control={control}
              name="scope"
            />
            <VoxCard.Separator />
            <YStack>
              <Controller
                render={({ field, fieldState }) => {
                  return (
                    <Input error={fieldState.error?.message} size="sm" color="gray" placeholder="Titre" defaultValue={field.value} onChange={field.onChange} />
                  )
                }}
                control={control}
                name="name"
              />
            </YStack>

            <Controller
              render={({ field, fieldState }) => {
                return (
                  <Select
                    error={fieldState.error?.message}
                    size="sm"
                    color="gray"
                    label="Accées"
                    value={field.value}
                    options={visibilityOptions}
                    onChange={field.onChange}
                  />
                )
              }}
              control={control}
              name="visibility"
            />

            <Controller
              render={({ field, fieldState }) => {
                return (
                  <Select
                    error={fieldState.error?.message}
                    size="sm"
                    color="gray"
                    label="Catégorie"
                    value={field.value}
                    options={visibilityOptions}
                    onChange={field.onChange}
                  />
                )
              }}
              control={control}
              name="category"
            />
            <VoxCard.Separator />
            <FormFrame height="auto" flexDirection="column" paddingHorizontal={0} pt="$medium" overflow="hidden" theme="gray">
              <Controller
                render={({ field, fieldState }) => {
                  return (
                    <YStack>
                      <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                        <XStack>
                          <FormFrame.Label>Date début</FormFrame.Label>
                        </XStack>
                        <XStack gap="$small">
                          <DatePickerField error={fieldState.error?.message} type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                          <DatePickerField error={fieldState.error?.message} type="time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        </XStack>
                      </XStack>
                      {fieldState.error ? (
                        <XStack paddingHorizontal="$medium" alignSelf="flex-end" pt="$xsmall">
                          <Text.XSM textAlign="right" color="$orange5">
                            {fieldState.error?.message}
                          </Text.XSM>
                        </XStack>
                      ) : null}
                    </YStack>
                  )
                }}
                control={control}
                name="begin_at"
              />
              <Controller
                render={({ field, fieldState }) => {
                  return (
                    <YStack>
                      <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                        <XStack>
                          <FormFrame.Label>Date fin</FormFrame.Label>
                        </XStack>
                        <XStack gap="$small">
                          <DatePickerField error={fieldState.error?.message} type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                          <DatePickerField error={fieldState.error?.message} type="time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        </XStack>
                      </XStack>
                      {fieldState.error ? (
                        <XStack paddingHorizontal="$medium" alignSelf="flex-end" pt="$xsmall">
                          <Text.XSM textAlign="right" color="$orange5">
                            {fieldState.error?.message}
                          </Text.XSM>
                        </XStack>
                      ) : null}
                    </YStack>
                  )
                }}
                control={control}
                name="finish_at"
              />

              <Controller
                render={({ field }) => {
                  return (
                    <Select
                      size="sm"
                      color="gray"
                      label="Fuseau horaire"
                      value={field.value}
                      searchable
                      options={timezones}
                      onChange={field.onChange}
                      frameProps={{
                        pb: '$medium',
                        pt: '$medium',
                        height: 50,
                      }}
                    />
                  )
                }}
                control={control}
                name="time_zone"
              />
            </FormFrame>
            <VoxCard.Separator />
            <Controller
              render={({ field }) => {
                return (
                  <ButtonGroup
                    flex={1}
                    size="md"
                    switchMode
                    options={[
                      { value: 'meeting', label: 'En Présentiel' },
                      { value: 'online', label: 'En ligne' },
                    ]}
                    onChange={(x) => {
                      field.onChange(x)
                      setMode(x as EventFormData['mode'])
                    }}
                    value={field.value}
                  />
                )
              }}
              control={control}
              name="mode"
            />
            {mode === 'meeting' ? (
              <Controller
                render={({ field, fieldState }) => {
                  return (
                    <AddressAutocomplete
                      size="sm"
                      color="gray"
                      label="Localisation"
                      error={fieldState.error?.message}
                      setAddressComponents={(x) => {
                        field.onChange({
                          address: x.address,
                          city_name: x.city,
                          postal_code: x.postalCode,
                          country: x.country,
                        })
                      }}
                    />
                  )
                }}
                control={control}
                name="post_address"
              />
            ) : (
              <YStack>
                <Controller
                  render={({ field, fieldState }) => {
                    return (
                      // <YStack height={44}>
                      <Input
                        size="sm"
                        color="gray"
                        placeholder="Lien visio"
                        inputMode="url"
                        error={fieldState.error?.message}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        iconRight={<Webcam size={16} color="$gray4" />}
                      />
                      // </YStack>
                    )
                  }}
                  control={control}
                  name="visio_url"
                />
              </YStack>
            )}
            <VoxCard.Separator />
            <YStack>
              <Controller
                render={({ field }) => {
                  return (
                    <YStack height={100}>
                      <Input size="sm" color="gray" placeholder="Description" inputMode="url" multiline defaultValue={field.value} onChange={field.onChange} />
                    </YStack>
                  )
                }}
                control={control}
                name="description"
              />
            </YStack>
            <XStack gap="$medium" alignContent="center" alignItems="center">
              <Text.MD secondary>Optionnel</Text.MD>
              <VoxCard.Separator />
            </XStack>

            <YStack>
              <Controller
                render={({ field }) => {
                  return (
                    <YStack height={44}>
                      <Input
                        size="sm"
                        color="gray"
                        placeholder="Lien du live"
                        inputMode="url"
                        defaultValue={field.value}
                        onChange={field.onChange}
                        iconRight={<Video size={16} color="$gray4" />}
                      />
                    </YStack>
                  )
                }}
                control={control}
                name="live_url"
              />
            </YStack>

            <VoxButton onPress={() => onSubmit()}>Créer</VoxButton>
          </VoxCard.Content>
        </VoxCard>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}
