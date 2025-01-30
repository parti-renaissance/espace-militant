import { createContext, useContext, useMemo, useState } from 'react'
import { SelectOption, SF } from '@/components/base/Select/SelectV3'
import { createEventSchema, EventFormData } from '@/features/events/components/EventForm/schema'
import { isPathExist } from '@/services/common/errors/utils'
import { eventPostFormError } from '@/services/events/error'
import { useCreateEvent, useSuspenseGetCategories } from '@/services/events/hook'
import { EventCategory } from '@/services/events/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Sparkle, Unlock } from '@tamagui/lucide-icons'
import { addHours, addMinutes, setMilliseconds, setMinutes, setSeconds } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { router, useNavigation } from 'expo-router'
import { useForm } from 'react-hook-form'
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
const useEventFormData = () => {
  const scopes = useGetExecutiveScopes()
  const scopeOptions = useMemo(() => scopes.data.list.map(getFormatedScope), [scopes.data.list])

  const categories = useSuspenseGetCategories()
  const catOptions = categories.data.map(formatCategorie)
  const cleanDate = roundMinutesToNextDecimal(new Date())
  const startDate = addHours(cleanDate, 1)
  const [mode, setMode] = useState('meeting')

  const navigation = useNavigation()

  const { mutateAsync, isPending } = useCreateEvent()

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
    post_address: undefined,
    visibility: 'public',
    live_url: undefined,
  } as const

  const { control, handleSubmit, reset, setError } = useForm<EventFormData>({
    defaultValues,
    resolver: zodResolver(createEventSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const _onSubmit = handleSubmit(
    async (data) => {
      const { scope, ...payload } = data
      return mutateAsync({ payload, scope })
        .then(({ slug }) => {
          const fallback = navigation.canGoBack() ? '../' : ('/evenements' as const)
          router.push(
            slug
              ? {
                  pathname: '/evenements/[id]',
                  params: {
                    id: slug,
                  },
                }
              : fallback,
          )
          reset()
        })
        .catch((e) => {
          if (e instanceof eventPostFormError) {
            e.violations.forEach((violation) => {
              if (isPathExist(violation.propertyPath, defaultValues)) {
                const propPath = violation.propertyPath.startsWith('post_address') ? 'post_address' : violation.propertyPath
                setError(propPath, { message: violation.message })
              } else {
                ErrorMonitor.log('Unknown property path / event form', violation)
              }
            })
          }
        })
    },
    (x) => {
      console.log(x)
    },
  )

  const onSubmit = useDebouncedCallback(_onSubmit)

  return {
    control,
    onSubmit,
    isPending,
    scopeOptions,
    catOptions,
    mode,
    setMode,
    timezones,
    visibilityOptions,
    navigation,
  }
}

type EventFormContext = ReturnType<typeof useEventFormData>

const eventFormContext = createContext<EventFormContext | null>(null)

export const EventFormContextProvider = (props: { children: React.ReactNode }) => {
  const data = useEventFormData()

  return <eventFormContext.Provider children={props.children} value={data} />
}

export const useEventFormContext = () => {
  const ctx = useContext(eventFormContext)
  if (ctx === null) {
    throw new Error('Missing Form Event Context')
  }
  return ctx
}
