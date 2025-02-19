import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SelectOption, SF } from '@/components/base/Select/SelectV3'
import { createEventSchema, EventFormData } from '@/features/events/pages/create-edit/schema'
import { getFormatedScope as getFormatedScopeData } from '@/features/ScopesSelector/utils'
import { isPathExist } from '@/services/common/errors/utils'
import { eventPostFormError } from '@/services/events/error'
import { useCreateEvent, useDeleteEventImage, useMutationEventImage, useSuspenseGetCategories } from '@/services/events/hook'
import { EventCategory } from '@/services/events/schema'
import { useGetExecutiveScopes, useGetSuspenseProfil } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkle } from '@tamagui/lucide-icons'
import { addHours, addMinutes, formatISO, isAfter, isBefore, isEqual, isValid, setMilliseconds, setMinutes, setSeconds, subHours } from 'date-fns'
import { router, useNavigation } from 'expo-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { useConfirmAlert } from './ConfirmAlert'
import { EventFormProps } from './types'
import visibilityOptions from './visibility-options'

export const getFormatedScope = (scope: RestUserScopesResponse[number]): SelectOption<string> => {
  const { name, description } = getFormatedScopeData(scope)
  return {
    value: scope.code,
    label: [
      <SF.Text key="name" semibold>
        {name}
      </SF.Text>,
      ' ',
      <SF.Text key="description">{description}</SF.Text>,
    ],
    theme: 'purple',
    icon: Sparkle,
  }
}

export const formatCategorie = (cat: EventCategory): SelectOption<string> => {
  return {
    label: cat.name,
    subLabel: cat.description ?? undefined,
    value: cat.slug,
  }
}

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
const useEventFormData = ({ edit }: EventFormProps) => {
  const scopes = useGetExecutiveScopes()
  const scopeOptions = useMemo(() => scopes.data.list.filter((x) => x.features.includes('events')).map(getFormatedScope), [scopes.data.list])
  const { data } = useGetSuspenseProfil({ enabled: true })

  const isAuthor = useMemo(() => {
    if (!edit) return true
    if (!edit.organizer) return false
    if (edit.organizer.uuid === data?.uuid) return true
    return false
  }, [edit, data])

  const categories = useSuspenseGetCategories()
  const catOptions = categories.data.map(formatCategorie)
  const cleanDate = roundMinutesToNextDecimal(new Date())
  const startDate = addHours(cleanDate, 1)
  const [mode, setMode] = useState(edit?.mode ?? 'meeting')

  const editMode = Boolean(edit)

  const navigation = useNavigation()

  const { mutateAsync, isPending } = useCreateEvent({ editSlug: edit?.slug, editUuid: edit?.uuid })
  const { mutateAsync: uploadImage, isPending: isUploadImagePending } = useMutationEventImage()
  const { mutateAsync: deleteImage, isPending: isUploadDeletePending } = useDeleteEventImage()

  const editEventScope = edit?.organizer?.scope ?? 'national'

  const defaultValues = {
    scope: edit ? (edit.organizer?.scope ?? 'national') : scopes.data.default?.code,
    name: edit?.name ?? '',
    image: edit?.image,
    category: edit?.category?.slug ?? '',
    description: edit?.description ?? '',
    begin_at: edit?.begin_at ? new Date(edit.begin_at) : startDate,
    finish_at: edit?.finish_at ? new Date(edit.finish_at) : addHours(startDate, 1),
    time_zone: edit?.time_zone ?? 'Europe/Paris',
    capacity: edit?.capacity ?? undefined,
    mode: edit?.mode ?? 'meeting',
    visio_url: edit?.visio_url ?? undefined,
    post_address: edit?.post_address
      ? {
          address: edit.post_address.address ?? undefined,
          city: edit.post_address.city ?? undefined,
          city_name: edit.post_address.city_name ?? undefined,
          country: edit.post_address.country ?? undefined,
        }
      : undefined,
    visibility: edit?.visibility ?? 'public',
    live_url: edit?.live_url ?? undefined,
    send_invitation_email: edit ? undefined : true,
  } as const

  const { control, handleSubmit, reset, setError, getValues, setValue, watch } = useForm<EventFormData>({
    defaultValues,
    resolver: zodResolver(createEventSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const handleOnChangeBeginAt = useCallback(
    (onChange: (y: Date) => void) => (x: Date) => {
      if (isAfter(x, getValues('finish_at')) || isEqual(x, getValues('finish_at'))) {
        const updatedDate = addHours(x, 1)
        if (isValid(updatedDate)) {
          setValue('finish_at', updatedDate)
        }
      }
      onChange(x)
    },
    [],
  )

  const handleOnChangeFinishAt = useCallback(
    (onChange: (y: Date) => void) => (x: Date) => {
      if (isBefore(x, getValues('begin_at')) || isEqual(x, getValues('begin_at'))) {
        const updatedDate = subHours(x, 1)
        if (isValid(updatedDate)) {
          setValue('begin_at', updatedDate)
        }
      }
      onChange(x)
    },
    [],
  )

  const finalSubmit: SubmitHandler<EventFormData> = async (data) => {
    const { scope, image, mode, visio_url, post_address, ...payload } = data
    const fullScope = scopes.data?.list?.find((x) => x.code === scope) ?? { attributes: { committees: edit?.committee } }
    try {
      const newEvent = await mutateAsync({
        payload: {
          ...payload,
          finish_at: formatISO(payload.finish_at),
          begin_at: formatISO(payload.begin_at),
          mode,
          visio_url: mode === 'online' ? visio_url : undefined,
          post_address: mode === 'meeting' ? post_address : undefined,
          committee: fullScope?.attributes?.committees?.[0]?.uuid ?? null,
        },
        scope,
      })

      let errorImage = false
      try {
        if (newEvent) {
          if (edit && edit.image?.url && image === null) {
            await deleteImage({ scope, eventId: newEvent.uuid, slug: newEvent.slug })
          } else if (image && image.url && image.url.startsWith('data:') && image.width !== null && image.height !== null) {
            await uploadImage({
              scope,
              eventId: newEvent.uuid,
              payload: image.url,
              slug: newEvent.slug,
              size: {
                width: image.width,
                height: image.height,
              },
            })
          }
        }
      } catch (e) {
        errorImage = true
      }

      if (errorImage && newEvent.slug) {
        router.replace({
          pathname: '/evenements/[id]/modifier',
          params: {
            id: newEvent.slug,
          },
        })
      } else if (edit && router.canGoBack()) {
        router.back()
      } else if (newEvent?.slug) {
        router.replace({
          pathname: '/evenements/[id]',
          params: {
            id: newEvent.slug,
            greet: editMode ? undefined : 'new',
          },
        })
      } else if (router.canGoBack()) {
        router.back()
      } else {
        router.replace({
          pathname: '/evenements',
        })
      }

      reset()
    } catch (e) {
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
    }
  }

  const _onSubmit = handleSubmit(finalSubmit)
  const finalOnSubmit = useDebouncedCallback(_onSubmit)

  const { ConfirmAlert, present } = useConfirmAlert({
    title: 'Créer l’événement ?',
    onAccept: finalOnSubmit,
    control,
    watch,
  })

  const modalBeforeSubmit = handleSubmit(() => present())
  const onSubmit = edit ? finalOnSubmit : modalBeforeSubmit

  return {
    control,
    onSubmit,
    isPending,
    isUploadImagePending,
    isUploadDeletePending,
    scopeOptions,
    catOptions,
    mode,
    setMode,
    visibilityOptions,
    navigation,
    editMode,
    editEventScope,
    event: edit,
    isAuthor,
    handleOnChangeFinishAt,
    handleOnChangeBeginAt,
    ConfirmAlert,
  }
}

export type EventFormContext = ReturnType<typeof useEventFormData>

const eventFormContext = createContext<EventFormContext | null>(null)

export const EventFormContextProvider = (props: { children: React.ReactNode } & EventFormProps) => {
  const data = useEventFormData({ edit: props.edit })

  return <eventFormContext.Provider children={props.children} value={data} />
}

export const useEventFormContext = () => {
  const ctx = useContext(eventFormContext)
  if (ctx === null) {
    throw new Error('Missing Form Event Context')
  }
  return ctx
}
