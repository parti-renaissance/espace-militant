import { EventFilters } from '@/core/entities/Event'
import { useSession } from '@/ctx/SessionProvider'
import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/events/api'
import { eventPostFormError } from '@/services/events/error'
import { PAGINATED_QUERY_FEED } from '@/services/timeline-feed/hook/index'
import { useToastController } from '@tamagui/toast'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { RestPostCountInvitationsEventRequest, RestPostEventRequest, RestPostPublicEventSubsciptionRequest } from '../schema'
import { optimisticToggleSubscribe, optimisticUpdate } from './helpers'
import { QUERY_KEY_PAGINATED_SHORT_EVENTS, QUERY_KEY_SINGLE_EVENT } from './queryKeys'

type FetchShortEventsOptions = {
  filters?: EventFilters
  postalCode?: string
  zoneCode?: string
}

const fetchEventList = async (pageParam: number, opts: FetchShortEventsOptions) =>
  await api.getEvents({ page: pageParam, zipCode: opts.postalCode, filters: opts.filters, orderByBeginAt: true })

const fetchEventPublicList = async (pageParam: number, opts: FetchShortEventsOptions) => {
  return await api.getPublicEvents({ page: pageParam, filters: opts.filters, zoneCode: opts.zoneCode, orderByBeginAt: true })
}

export const useSuspensePaginatedEvents = (opts: { filters?: EventFilters; postalCode?: string; zoneCode?: string }) => {
  const { isAuth } = useSession()
  const filtersKey = opts.filters
    ? JSON.stringify({
        ...opts.filters,
        finishAfter: opts.filters.finishAfter ? format(opts.filters.finishAfter, 'yyyy-MM-dd') : '',
      })
    : ''

  return useInfiniteQuery({
    queryKey: [QUERY_KEY_PAGINATED_SHORT_EVENTS, isAuth ? 'private' : 'public', filtersKey],
    queryFn: ({ pageParam }) => (isAuth ? fetchEventList(pageParam, opts) : fetchEventPublicList(pageParam, opts)),
    getNextPageParam: (lastPage) =>
      lastPage ? (lastPage.metadata.last_page > lastPage.metadata.current_page ? lastPage.metadata.current_page + 1 : null) : null,
    getPreviousPageParam: (firstPage) => (firstPage ? firstPage.metadata.current_page - 1 : null),
    initialPageParam: 1,
  })
}

export const useSubscribeEvent = ({ id: eventId, slug }: { id: string; slug?: string }) => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.subscribeToEvent(eventId),
    onSuccess: () => {
      toast.show('Succès', { message: "Inscription à l'événement réussie", type: 'success' })
      optimisticToggleSubscribe(true, { eventId, slug }, queryClient)
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible de s'inscrire à cet événement", type: 'error' })
      }
    },
  })
}

export const useUnsubscribeEvent = ({ id: eventId, slug }: { id: string; slug?: string }) => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.unsubscribeFromEvent(eventId),
    onSuccess: () => {
      toast.show('Succès', { message: "Désinscription de l'événement réussie", type: 'success' })
      optimisticToggleSubscribe(false, { eventId, slug }, queryClient)
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: 'Impossible de se désinscrire de cet événement', type: 'error' })
      }
    },
  })
}

export const useGetEvent = ({ id: eventId }: { id: string }) => {
  const { session } = useSession()

  return useSuspenseQuery({
    queryKey: [QUERY_KEY_SINGLE_EVENT, eventId],
    queryFn: () => (session ? api.getEventDetails(eventId) : api.getPublicEventDetails(eventId)),
    refetchOnMount: true,
  })
}

export const useSubscribePublicEvent = ({ id: eventId, slug }: { id: string; slug?: string }) => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RestPostPublicEventSubsciptionRequest) => api.subscribePublicEvent(eventId, payload),
    onSuccess: () => {
      toast.show('Succès', { message: "Inscription à l'événement réussie", type: 'success' })
    },
    onMutate: () => optimisticToggleSubscribe(true, { eventId, slug }, queryClient),
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible de s'inscrire à cet événement", type: 'error' })
      }
      optimisticToggleSubscribe(false, { eventId, slug }, queryClient)
      return error
    },
  })
}

export const usePaginatedEventPartcipants = (props: { eventId: string }) => {
  return useInfiniteQuery({
    queryKey: ['eventParticipants', props.eventId],
    queryFn: ({ pageParam }) => api.getEventParticipants({ eventId: props.eventId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage ? (lastPage.metadata.last_page > lastPage.metadata.current_page ? lastPage.metadata.current_page + 1 : null) : null,
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined
      }
      return firstPageParam - 1
    },
  })
}

export const useSuspenseGetCategories = () => {
  return useSuspenseQuery({
    queryKey: ['eventCategories'],
    queryFn: () => api.getEventCategories(),
  })
}

export const useCreateEvent = ({ editSlug, editUuid }: { editSlug?: string; editUuid?: string }) => {
  const queryClient = useQueryClient()
  const toast = useToastController()
  const successMessage = editSlug ? 'Événement modifié avec succès' : 'Événement créé avec succès'
  const errorMessage = editSlug ? 'Impossible de modifier cet événement' : 'Impossible de créer cet événement'
  return useMutation({
    mutationFn: editUuid
      ? ({ payload, scope }: { payload: RestPostEventRequest; scope: string }) => api.updateEvent({ payload, eventId: editUuid, scope })
      : api.createEvent,
    onSuccess: (payload) => {
      toast.show('Succès', { message: successMessage, type: 'success' })
      if (editSlug) {
        optimisticUpdate(
          payload,
          {
            eventId: payload.uuid,
            slug: payload.slug,
          },
          queryClient,
        )
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_PAGINATED_SHORT_EVENTS],
        })
        queryClient.invalidateQueries({
          queryKey: [PAGINATED_QUERY_FEED],
        })
      }
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else if (error instanceof eventPostFormError) {
        toast.show('Validation', { message: 'Un ou plusieurs champs sont invalides.', type: 'warning' })
      } else {
        toast.show('Erreur', { message: errorMessage, type: 'error' })
      }
      return error
    },
  })
}

export const useMutationEventImage = () => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (x: {
      eventId: string
      scope: string
      payload: string
      slug: string
      size: {
        width: number
        height: number
      }
    }) => api.uploadEventImage(x),
    onSuccess: (_, { payload, size, eventId, slug }) => {
      optimisticUpdate(
        { image: { url: payload, ...size } },
        {
          eventId,
          slug,
        },
        queryClient,
      )
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Oups', { message: "Un problème est survenu lors de l'ajout de l'image de l'événement, veuillez réessayer.", type: 'warning' })
      }
      return error
    },
  })
}

export const useDeleteEventImage = () => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (x: { eventId: string; scope: string; slug: string }) => api.deleteEventImage(x),
    onSuccess: (_, { eventId, slug }) => {
      optimisticUpdate(
        { image: null },
        {
          eventId,
          slug,
        },
        queryClient,
      )
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Oups', { message: "Un problème est survenu lors de la suppression de l'image de l'événement, veuillez réessayer.", type: 'error' })
      }
      return error
    },
  })
}

export const useDeleteEvent = () => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: (_, { eventId }) => {
      toast.show('Succès', { message: 'Événement supprimée', type: 'success' })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_PAGINATED_SHORT_EVENTS],
      })
      queryClient.invalidateQueries({
        queryKey: [PAGINATED_QUERY_FEED],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_SINGLE_EVENT, eventId],
      })
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible de supprimer l'événement", type: 'error' })
      }
      return error
    },
  })
}

export const useCancelEvent = () => {
  const toast = useToastController()
  return useMutation({
    mutationFn: api.cancelEvent,
    onSuccess: () => {
      toast.show('Succès', { message: 'Événement annulé', type: 'success' })
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible d'annuler l'événement", type: 'error' })
      }
      return error
    },
  })
}

export const useCountInvitationsEvent = ({
  roles,
  agora,
  scope,
}: RestPostCountInvitationsEventRequest & { scope: string }) => {
  return useQuery({
    queryKey: [QUERY_KEY_SINGLE_EVENT, roles, agora, scope],
    queryFn: () =>
      api.countInvitationsEvent({
        payload: { roles, agora },
        scope,
      }),
    refetchOnMount: true,
  })
}
