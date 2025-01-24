import { Suspense, useMemo, useState } from 'react'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFrame } from '@/components/base/FormFrames'
import Input from '@/components/base/Input/Input'
import Select, { SelectOption, SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Sparkle, Unlock, Video } from '@tamagui/lucide-icons'
import { addHours, getHours, setHours } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { Controller, useForm } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'

function getTimezoneOffsetLabel(timeZone) {
  const offset = getTimezoneOffset(timeZone)

  return `UTC ${offset < 0 ? '' : '+'}${offset / 1000 / 60 / 60}h`
}

const timezones = useMemo(() => {
  return Intl.supportedValuesOf('timeZone').map((timeZone) => ({
    value: timeZone,
    label: `${timeZone} (${getTimezoneOffsetLabel(timeZone)})`,
  }))
}, [])

console.log(timezones)

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
  const currentDate = new Date()
  const currentHour = getHours(currentDate)
  const startDate = setHours(currentDate, Math.round(currentHour))
  const [mode, setMode] = useState('meeting')
  const { control } = useForm<EventFormData>({
    defaultValues: {
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
    },
    resolver: zodResolver(createEventSchema),
  })
  return (
    <PageLayout>
      <PageLayout.MainSingleColumn justifyContent="center" alignItems="center">
        <VoxCard width={400}>
          <VoxCard.Content>
            <Controller
              render={({ field }) => {
                return <Select size="sm" theme="purple" matchTextWithTheme label="Pour" value={field.value} options={scopeOptions} onChange={field.onChange} />
              }}
              control={control}
              name="scope"
            />
            <VoxCard.Separator />
            <YStack>
              <Controller
                render={({ field }) => {
                  return (
                    <YStack height={44}>
                      <Input size="sm" color="gray" placeholder="Titre" defaultValue={field.value} onChange={field.onChange} />
                    </YStack>
                  )
                }}
                control={control}
                name="name"
              />
            </YStack>

            <Controller
              render={({ field }) => {
                return <Select size="sm" color="gray" label="Accées" value={field.value} options={visibilityOptions} onChange={field.onChange} />
              }}
              control={control}
              name="visibility"
            />

            <Controller
              render={({ field }) => {
                return <Select size="sm" color="gray" label="Catégorie" value={field.value} options={visibilityOptions} onChange={field.onChange} />
              }}
              control={control}
              name="category"
            />
            <VoxCard.Separator />
            <FormFrame height="auto" flexDirection="column" paddingHorizontal={0} pt="$medium" overflow="hidden" theme="gray">
              <Controller
                render={({ field }) => {
                  return (
                    <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                      <XStack>
                        <FormFrame.Label>Date début</FormFrame.Label>
                      </XStack>
                      <XStack gap="$small">
                        <FormFrame.Button>
                          <Text.MD>12/04/2024</Text.MD>
                        </FormFrame.Button>
                        <FormFrame.Button>
                          <Text.MD>13h00</Text.MD>
                        </FormFrame.Button>
                      </XStack>
                    </XStack>
                  )
                }}
                control={control}
                name="begin_at"
              />
              <Controller
                render={({ field }) => {
                  return (
                    <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                      <XStack>
                        <FormFrame.Label>Date fin</FormFrame.Label>
                      </XStack>
                      <XStack gap="$small">
                        <FormFrame.Button>
                          <Text.MD>12/04/2024</Text.MD>
                        </FormFrame.Button>
                        <FormFrame.Button>
                          <Text.MD>13h00</Text.MD>
                        </FormFrame.Button>
                      </XStack>
                    </XStack>
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
                        // borderRadius: 6,
                        // paddingHorizontal: 0,
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
                render={({ field }) => {
                  return (
                    <AddressAutocomplete
                      size="sm"
                      color="gray"
                      label="Localisation"
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
                  render={({ field }) => {
                    return (
                      <YStack height={44}>
                        <Input
                          size="sm"
                          color="gray"
                          placeholder="Lien visio"
                          inputMode="url"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          iconRight={<Video size={16} color="$gray4" />}
                        />
                      </YStack>
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
                    <YStack height={200}>
                      <Input size="sm" color="gray" placeholder="Description" inputMode="url" multiline defaultValue={field.value} onChange={field.onChange} />
                    </YStack>
                  )
                }}
                control={control}
                name="description"
              />
            </YStack>
          </VoxCard.Content>
        </VoxCard>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}
