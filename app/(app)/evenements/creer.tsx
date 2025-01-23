import Input from '@/components/base/Input/Input'
import Select, { SelectOption } from '@/components/base/Select/SelectV3'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Unlock } from '@tamagui/lucide-icons'
import { addHours, getHours, setHours } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'

const VisibilityOptions: SelectOption<EventFormData['visibility']>[] = [
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
  const currentDate = new Date()
  const currentHour = getHours(currentDate)
  const startDate = setHours(currentDate, Math.round(currentHour))
  const { control } = useForm<EventFormData>({
    defaultValues: {
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
                return <Input size="sm" color="gray" placeholder="Titre" defaultValue={field.value} onChange={field.onChange} />
              }}
              control={control}
              name="name"
            />

            <Controller
              render={({ field }) => {
                return <Select size="sm" color="gray" label="Accées" value={field.value} options={VisibilityOptions} onChange={field.onChange} />
              }}
              control={control}
              name="visibility"
            />
          </VoxCard.Content>
        </VoxCard>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}
