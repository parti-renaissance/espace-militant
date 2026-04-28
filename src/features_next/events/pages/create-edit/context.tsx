import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { router, useNavigation } from 'expo-router'
import { Sparkle } from '@tamagui/lucide-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { addHours, addMinutes, formatISO, isAfter, isBefore, isEqual, isPast, isValid, setMilliseconds, setMinutes, setSeconds, subHours } from 'date-fns'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import { SelectOption, SF } from '@/components/base/Select/SelectV3'

import { isPathExist } from '@/services/common/errors/utils'
import { eventPostFormError } from '@/services/events/error'
import { useCreateEvent, useDeleteEventImage, useMutationEventImage, useSuspenseGetCategories } from '@/services/events/hook'
import { EventCategory, RestFullEvent } from '@/services/events/schema'
import { useGetExecutiveScopes, useGetSuspenseProfil } from '@/services/profile/hook'
import { RestUserScopesResponse, UserScopesEnum } from '@/services/profile/schema'
import { getFormatedScope as getFormatedScopeData } from '@/services/profile/utils'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { FEATURES } from '@/utils/Scopes'

import { useConfirmAlert } from './components/ConfirmAlert'
import { createEventSchema, EventFormData } from './schema'
import getVisibilityOptions from './visibility-options'

export type EventFormProps = {
  edit?: RestFullEvent
}

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

/** Seule catégorie proposée en portée Agora (aligné produit / API). */
const AGORA_EVENT_CATEGORY_SLUG = 'reunion-d-equipe' as const

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
  const scopeOptions = useMemo(() => scopes.data?.list?.filter((x) => x.features.includes(FEATURES.EVENTS)).map(getFormatedScope) ?? [], [scopes.data])
  const { data } = useGetSuspenseProfil({ enabled: true })

  const isAuthor = useMemo(() => {
    if (!edit) return true
    if (!edit.organizer) return false
    if (edit.organizer.uuid === data?.uuid) return true
    return false
  }, [edit, data])

  const categories = useSuspenseGetCategories()
  const baseCatOptions = useMemo(() => categories.data.map(formatCategorie), [categories.data])
  const cleanDate = roundMinutesToNextDecimal(new Date())
  const startDate = addHours(cleanDate, 1)

  const editMode = Boolean(edit)
  const isPastEvent = editMode && !!edit?.begin_at && isPast(edit.begin_at)

  const navigation = useNavigation()

  const { mutateAsync, isPending } = useCreateEvent({ editSlug: edit?.slug, editUuid: edit?.uuid })
  const { mutateAsync: uploadImage, isPending: isUploadImagePending } = useMutationEventImage()
  const { mutateAsync: deleteImage, isPending: isUploadDeletePending } = useDeleteEventImage()

  const editEventScope = edit?.organizer?.scope ?? 'national'

  const initialScopeCode = edit ? (edit.organizer?.scope ?? 'national') : (scopes.data?.default?.code ?? 'national')
  const defaultVisibilityForScope = edit?.visibility ?? (String(initialScopeCode).startsWith('agora_') ? 'invitation' : 'public')
  /** Portée Agora : événements toujours « en ligne » (produit). */
  const defaultModeForScope = String(initialScopeCode).startsWith('agora_') ? 'online' : (edit?.mode ?? 'meeting')

  const defaultValues = {
    isPastEvent,
    scope: initialScopeCode,
    name: edit?.name ?? '',
    image: edit?.image,
    category: edit?.category?.slug ?? '',
    description: {
      pure: edit ? '12345678910' : '',
      json: edit?.json_description ?? '',
      html: edit?.description ?? '',
    },
    begin_at: edit?.begin_at ? new Date(edit.begin_at) : startDate,
    finish_at: edit?.finish_at ? new Date(edit.finish_at) : addHours(startDate, 1),
    time_zone: edit?.time_zone ?? 'Europe/Paris',
    capacity: edit?.capacity ?? undefined,
    mode: defaultModeForScope,
    visio_url: edit?.visio_url ?? undefined,
    post_address: edit?.post_address
      ? {
          address: edit.post_address.address ?? undefined,
          city: edit.post_address.city ?? undefined,
          city_name: edit.post_address.city_name ?? undefined,
          country: edit.post_address.country ?? undefined,
          postal_code: edit.post_address.postal_code ?? undefined,
        }
      : undefined,
    visibility: defaultVisibilityForScope,
    hidden: edit?.hidden ?? false,
    live_url: edit?.live_url ?? undefined,
    send_invitation_email: edit ? undefined : true,
  } as const

  const { control, handleSubmit, reset, setError, getValues, setValue } = useForm<EventFormData>({
    defaultValues,
    resolver: zodResolver(createEventSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  /** Dérivé du formulaire : évite un `useState` dupliqué et un `setMode` dans l’effet (règle set-state-in-effect). */
  const mode = useWatch({ control, name: 'mode' })

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
    [getValues, setValue],
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
    [getValues, setValue],
  )

  const selectedScope = useWatch({
    control,
    name: 'scope',
  })

  const selectedScopeData = useMemo(() => scopes.data?.list?.find((x) => x.code === selectedScope), [scopes.data, selectedScope])

  /** Mémoïsé une fois par `selectedScope` : réutilisé pour le select et pour l’effet de cohérence (pas d’appels redondés à `getVisibilityOptions` dans l’effet). */
  const visibilityOptions = useMemo(() => getVisibilityOptions(selectedScopeData), [selectedScopeData])

  const catOptions: SelectOption<string>[] = useMemo(() => {
    if (!selectedScope?.startsWith('agora_')) {
      return baseCatOptions
    }
    const reunion = baseCatOptions.find((o) => o.value === AGORA_EVENT_CATEGORY_SLUG)
    if (reunion) {
      return [reunion]
    }
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      ErrorMonitor.log('Event form: catégorie Agora absente des données API', { slug: AGORA_EVENT_CATEGORY_SLUG })
    }
    return [{ value: AGORA_EVENT_CATEGORY_SLUG, label: 'Réunion d’équipe' }]
  }, [baseCatOptions, selectedScope])

  const isAgoraLeader = useMemo(
    () => selectedScope === UserScopesEnum.AgoraPresident || selectedScope === UserScopesEnum.AgoraGeneralSecretary,
    [selectedScope],
  )

  const isAgoraScope = Boolean(selectedScope?.startsWith('agora_'))

  /**
   * Synchronise visibilité / catégorie / mode avec la portée et le rôle (un seul effet pour limiter les allers-retours).
   * Transition « leader » : catégorie + visibilité au passage non-leader → leader (pas au montage si déjà leader).
   * Portée Agora : mode toujours « online », y compris après changement de portée ou si le formulaire était resté sur « meeting ».
   */
  const prevIsAgoraLeaderRef = useRef(isAgoraLeader)
  useEffect(() => {
    const scope = selectedScope
    if (!scope) return

    const allowedVisibility = visibilityOptions.map((o) => o.value)

    if (isAgoraLeader && !prevIsAgoraLeaderRef.current) {
      setValue('category', AGORA_EVENT_CATEGORY_SLUG)
      setValue('visibility', 'invitation')
    }
    prevIsAgoraLeaderRef.current = isAgoraLeader

    if (!isAgoraLeader && edit?.visibility === 'invitation' && allowedVisibility.includes('public')) {
      setValue('visibility', 'public', { shouldValidate: true })
    }

    const currentVisibility = getValues('visibility')
    if (allowedVisibility.length > 0 && !allowedVisibility.includes(currentVisibility)) {
      setValue('visibility', allowedVisibility[0] as EventFormData['visibility'], { shouldValidate: true })
    }

    if (scope.startsWith('agora_') && getValues('category') !== AGORA_EVENT_CATEGORY_SLUG) {
      setValue('category', AGORA_EVENT_CATEGORY_SLUG, { shouldValidate: true })
    }

    if (scope.startsWith('agora_') && getValues('mode') !== 'online') {
      setValue('mode', 'online', { shouldValidate: true })
    }
  }, [edit, getValues, isAgoraLeader, selectedScope, setValue, visibilityOptions])
  const agoraUuid = useMemo(() => {
    return scopes.data?.list.find((x) => x.code === selectedScope)?.attributes?.agoras?.[0]?.uuid ?? null
  }, [selectedScope, scopes.data])

  const committeeUuid = useMemo(() => {
    return scopes.data?.list.find((x) => x.code === selectedScope)?.attributes?.committees?.[0]?.uuid ?? null
  }, [selectedScope, scopes.data])

  const finalSubmit: SubmitHandler<EventFormData> = async (data) => {
    const { scope, image, mode, visio_url, post_address, ...payload } = data
    const fullScope = scopes.data?.list?.find((x) => x.code === scope) ?? { attributes: { committees: edit?.committee, agoras: edit?.agoras } }
    try {
      const newEvent = await mutateAsync({
        payload: {
          ...payload,
          finish_at: formatISO(payload.finish_at),
          begin_at: formatISO(payload.begin_at),
          mode,
          description: payload.description?.html ?? '',
          json_description: payload.description?.json ?? '',
          visio_url: mode === 'online' ? visio_url : undefined,
          post_address: mode === 'meeting' ? post_address : undefined,
          committee: fullScope?.attributes?.committees?.[0]?.uuid ?? null,
          agora: agoraUuid,
        },
        scope,
      })

      let errorImage = false
      try {
        if (newEvent) {
          if (edit && edit.image?.url && image === null) {
            await deleteImage({ eventId: newEvent.uuid, slug: newEvent.slug })
          } else if (image && image.url && image.url.startsWith('data:') && image.width !== null && image.height !== null) {
            await uploadImage({
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
      } catch {
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
    setValue,
    isAgoraLeader,
    agoraUuid,
    committeeUuid,
    scope: selectedScope,
  })

  const modalBeforeSubmit = handleSubmit(() => present())
  const onSubmit = edit ? finalOnSubmit : modalBeforeSubmit

  return {
    control,
    setValue,
    onSubmit,
    isPending,
    isUploadImagePending,
    isUploadDeletePending,
    scopeOptions,
    catOptions,
    mode: mode ?? (isAgoraScope ? 'online' : 'meeting'),
    visibilityOptions,
    navigation,
    editMode,
    isPastEvent,
    editEventScope,
    event: edit,
    isAuthor,
    handleOnChangeFinishAt,
    handleOnChangeBeginAt,
    ConfirmAlert,
    isAgoraLeader,
    isAgoraScope,
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
