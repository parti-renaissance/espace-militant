import { Suspense, useEffect, useMemo, useState } from 'react'
import { Keyboard, KeyboardAvoidingView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFrame } from '@/components/base/FormFrames'
import Input from '@/components/base/Input/Input'
import Select, { SelectOption, SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import DatePickerField from '@/components/DatePickerV2'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import DescriptionInput from '@/features/events/components/EventForm/DescriptionInput'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import ScrollView from '@/features/profil/components/ScrollView'
import { useCreateEvent, useSuspenseGetCategories } from '@/services/events/hook'
import { EventCategory } from '@/services/events/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Lock, Sparkle, Unlock, Users, Video, Webcam } from '@tamagui/lucide-icons'
import { addHours, addMinutes, setMilliseconds, setMinutes, setSeconds } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { Link, router, useNavigation } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { getTokenValue, isWeb, XStack, YStack } from 'tamagui'
import { listTimeZones } from 'timezone-support'
import { useDebouncedCallback } from 'use-debounce'

function getTimezoneOffsetLabel(timeZone: string) {
  const offset = getTimezoneOffset(timeZone)

  return `UTC ${offset < 0 ? '' : '+'}${offset / 1000 / 60 / 60}h`
}

const timezones = listTimeZones().map((timeZone) => ({
  value: timeZone,
  label: `${timeZone} (${getTimezoneOffsetLabel(timeZone)})`,
}))

export const getFormatedScope = (scope: RestUserScopesResponse[number]): SelectOption<string> => {
  return {
    value: scope.code,
    label: [<SF.Text semibold>{scope.name}</SF.Text>, ' ', <SF.Text>{scope.zones.map(({ name, code }) => `${name} (${code})`).join(', ')}</SF.Text>],
    theme: 'purple',
    icon: Sparkle,
  }
}

export const formatCategorie = (cat: EventCategory): SelectOption<string> => {
  return {
    label: cat.name,
    value: cat.slug,
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
  const navigation = useNavigation()
  return (
    <PageLayout>
      <PageLayout.MainSingleColumn position="relative">
        <Suspense
          fallback={
            <YStack flex={1}>
              <VoxHeader>
                <XStack alignItems="center" flex={1} width="100%">
                  <XStack alignContent="flex-start">
                    <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
                      <VoxButton size="lg" variant="soft" theme="orange">
                        Annuler
                      </VoxButton>
                    </Link>
                  </XStack>
                  <XStack flexGrow={1} justifyContent="center">
                    <VoxHeader.Title icon={Calendar}>Créer un événement</VoxHeader.Title>
                  </XStack>
                  <XStack>
                    <VoxButton size="lg" variant="text" theme="blue" disabled>
                      Créer
                    </VoxButton>
                  </XStack>
                </XStack>
              </VoxHeader>

              <SkeCard>
                <SkeCard.Content>
                  <SF theme="purple" />
                  <SkeCard.Separator />
                  <SF />
                  <SF />
                  <SF />
                  <SkeCard.Separator />
                  <SF height={200} />
                  <SkeCard.Separator />
                  <XStack gap="$small">
                    <SkeCard.Button />
                    <SkeCard.Button />
                  </XStack>
                  <SF />
                  <SF height={200} />
                  <SkeCard.Separator />
                  <SF />
                  <SF />
                </SkeCard.Content>
              </SkeCard>
            </YStack>
          }
        >
          <CreateEventForm />
        </Suspense>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}

export function CreateEventForm() {
  const scopes = useGetExecutiveScopes()
  const scopeOptions = useMemo(() => scopes.data.list.map(getFormatedScope), [scopes.data.list])

  const categories = useSuspenseGetCategories()
  const catOptions = categories.data.map(formatCategorie)
  const cleanDate = roundMinutesToNextDecimal(new Date())
  const startDate = addHours(cleanDate, 1)
  const [mode, setMode] = useState('meeting')

  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const emitterShow = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardOpen(true)
    })

    const emitterHide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardOpen(false)
    })
    return () => {
      emitterShow.remove()
      emitterHide.remove()
    }
  })

  const navigation = useNavigation()

  const { mutateAsync, isPending } = useCreateEvent()
  const insets = useSafeAreaInsets()

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
    live_url: undefined,
  } as const

  const { control, handleSubmit, reset } = useForm<EventFormData>({
    defaultValues,
    resolver: zodResolver(createEventSchema),
    reValidateMode: 'onChange',
  })

  const _onSubmit = handleSubmit(
    async (data) => {
      const { scope, ...payload } = data
      return mutateAsync({ payload, scope }).then(() => {
        router.push(navigation.canGoBack() ? '../' : '/evenements')
        reset()
      })
    },
    (x) => {
      console.log(x)
    },
  )

  const onSubmit = useDebouncedCallback(_onSubmit)

  return (
    <>
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
              <VoxButton size="lg" variant="text" theme="orange">
                Annuler
              </VoxButton>
            </Link>
          </XStack>
          <XStack flexGrow={1} justifyContent="center">
            <VoxHeader.Title icon={Calendar}>Créer un événement</VoxHeader.Title>
          </XStack>
          <XStack>
            <VoxButton onPress={() => onSubmit()} size="lg" variant="text" theme="blue" loading={isPending}>
              Créer
            </VoxButton>
          </XStack>
        </XStack>
      </VoxHeader>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            pb: '$xxxlarge',
            pt: '$large',
          }}
        >
          <VoxCard>
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
                      <Input
                        error={fieldState.error?.message}
                        size="sm"
                        color="gray"
                        placeholder="Titre"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
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
                      options={catOptions}
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
                          <XStack flex={1}>
                            <FormFrame.Label>Date début</FormFrame.Label>
                          </XStack>
                          <XStack gap="$small" flex={1} justifyContent="flex-end">
                            <DatePickerField
                              error={fieldState.error?.message}
                              type="date"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                            <DatePickerField
                              error={fieldState.error?.message}
                              type="time"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
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
                          <XStack flex={1}>
                            <FormFrame.Label>Date fin</FormFrame.Label>
                          </XStack>
                          <XStack gap="$small" flex={1} justifyContent="flex-end">
                            <DatePickerField
                              error={fieldState.error?.message}
                              type="date"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                            <DatePickerField
                              error={fieldState.error?.message}
                              type="time"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
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
                          height: 'auto',
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
                      theme="blue"
                      variant="soft"
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
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <YStack minHeight={100} maxHeight={300}>
                          <DescriptionInput label="Description" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        </YStack>
                      </>
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
                  render={({ field, fieldState }) => {
                    return (
                      <YStack height={44}>
                        <Input
                          size="sm"
                          color="gray"
                          placeholder="Lien du live"
                          inputMode="url"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          iconRight={<Video size={16} color="$gray4" />}
                        />
                      </YStack>
                    )
                  }}
                  control={control}
                  name="live_url"
                />
              </YStack>

              <YStack>
                <Controller
                  render={({ field }) => {
                    return (
                      <YStack height={44}>
                        <Input
                          size="sm"
                          color="gray"
                          placeholder="Capacité"
                          type="number"
                          inputMode="numeric"
                          defaultValue={field.value?.toString()}
                          onChange={field.onChange}
                          iconRight={<Users size={16} color="$gray4" />}
                        />
                      </YStack>
                    )
                  }}
                  control={control}
                  name="capacity"
                />
              </YStack>
            </VoxCard.Content>
          </VoxCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
