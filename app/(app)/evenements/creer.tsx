import { Suspense, useMemo } from 'react'
import Input from '@/components/base/Input/Input'
import Select, { SelectOption, SF } from '@/components/base/Select/SelectV3'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Sparkle, Unlock } from '@tamagui/lucide-icons'
import { addHours, getHours, setHours } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'

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
    label: 'Réservé aux adhérants',
  },
  {
    value: 'adherent_dues',
    icon: Lock,
    theme: 'yellow',
    label: 'Réservé aux adhérants à jour',
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
  const { control } = useForm<EventFormData>({
    defaultValues: {
      scope: scopes.data.default?.code,
      name: '',
      category: undefined,
      description: '',
      begin_at: startDate,
      finish_at: addHours(startDate, 1),
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
      <PageLayout.MainSingleColumn alignItems="center" justifyContent="center">
        <VoxCard width={380}>
          <VoxCard.Content>
            <Controller
              render={({ field }) => {
                return <Select size="sm" theme="purple" matchTextWithTheme label="Pour" value={field.value} options={scopeOptions} onChange={field.onChange} />
              }}
              control={control}
              name="scope"
            />
            <VoxCard.Separator />
            <Controller
              render={({ field }) => {
                return <Input size="sm" color="gray" placeholder="Titre" defaultValue={field.value} onChange={field.onChange} />
              }}
              control={control}
              name="name"
            />

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
          </VoxCard.Content>
        </VoxCard>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}
