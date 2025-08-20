import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/publications/api'
import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { RestGetMessageResponse, RestPostMessageRequest, RestPutMessageFiltersRequest } from './schema'
import { PAGINATED_QUERY_FEED } from '@/services/timeline-feed/hook/index'

export const useCreateMessage = (props: { uuid?: string }) => {
  const toast = useToastController()
  const errorMessage = props.uuid ? 'Impossible de modifier ce message' : 'Impossible de créer ce message'
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:
      props.uuid !== undefined
        ? ({ payload, scope }: { payload: RestPostMessageRequest; scope: string }) => api.updateMessage({ payload, messageId: props.uuid!, scope })
        : api.createMessage,
    onSuccess: (data) => {
      if (props.uuid) {
        queryClient.invalidateQueries({ queryKey: ['message', props.uuid] })
        queryClient.invalidateQueries({ queryKey: ['message-content', props.uuid] })
      } else if (data?.uuid) {
        queryClient.invalidateQueries({ queryKey: ['message', data.uuid] })
        queryClient.invalidateQueries({ queryKey: ['message-content', data.uuid] })
      }
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: errorMessage, type: 'error' })
      }
      return error
    },
  })
}

export const useSendMessage = (props: { uuid: string }) => {
  const toast = useToastController()
  const errorMessage = "L'envoi de l'email n'a pas abouti"
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ test, scope }: Omit<Parameters<typeof api.sendMessage>[0], 'messageId'> & { test?: boolean }) =>
      test
        ? api.sendTestMessage({ scope, messageId: props.uuid })
        : api.sendMessage({
          scope,
          messageId: props.uuid,
        }),
    onSuccess: () => {
      // Invalider le feed pour rafraîchir les publications après envoi
      queryClient.invalidateQueries({
        queryKey: [PAGINATED_QUERY_FEED],
      })
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: errorMessage, type: 'error' })
      }
      return error
    },
  })
}

export const useGetMessage = (props: { messageId: string; scope: string; enabled: boolean }) => {
  return useQuery({
    queryKey: ['message', props.messageId],
    queryFn: () => api.getMessage({ messageId: props.messageId, scope: props.scope }),
    enabled: props.enabled,
    refetchOnMount: true,
    staleTime: 60 * 5000,
  })
}

export const useGetMessageContent = (props: { messageId?: string; scope?: string; enabled: boolean }) => {
  return useQuery({
    queryKey: ['message-content', props.messageId],
    queryFn: () => (props.messageId && props.scope ? api.getMessageContent({ messageId: props.messageId, scope: props.scope }) : Promise.resolve(undefined)),
    enabled: Boolean(props.messageId && props.scope) && props.enabled,
    refetchOnMount: true,
  })
}

class MessageNotSynchronizedError extends Error {
  constructor(messageId?: string) {
    super(`Message ${messageId} n'est pas synchronisé`)
  }
}

export const useGetIsMessageTilSync = (props: { payload?: { messageId: string; scope: string } }) => {
  return useQuery({
    queryKey: ['message-til-sync', props?.payload?.messageId],
    queryFn: () =>
      props.payload?.messageId && props.payload?.scope
        ? api.getMessage({ messageId: props.payload.messageId, scope: props.payload.scope }).then((x) => {
          if (x.synchronized) {
            return x as Omit<RestGetMessageResponse, 'synchronized'> & { synchronized: true }
          }
          throw new MessageNotSynchronizedError(props.payload?.messageId)
        })
        : Promise.resolve(undefined),
    enabled: Boolean(props.payload?.messageId && props.payload?.scope),
    retry: (attempts, error) => {
      if (attempts > 20) return false
      if (error instanceof MessageNotSynchronizedError) {
        return true
      }
      return false
    },
    retryDelay: 1000,
  })
}

export const useMutationEventImage = () => {
  // const toast = useToastController()
  // const queryClient = useQueryClient()
  // return useMutation({
  //   mutationFn: (x: {
  //     eventId: string
  //     scope: string
  //     payload: string
  //     slug: string
  //     size: {
  //       width: number
  //       height: number
  //     }
  //   }) => api.uploadEventImage(x),
  //   onSuccess: (_, { payload, size, eventId, slug }) => {
  //     optimisticUpdate(
  //       { image: { url: payload, ...size } },
  //       {
  //         eventId,
  //         slug,
  //       },
  //       queryClient,
  //     )
  //   },
  //   onError: (error) => {
  //     if (error instanceof GenericResponseError) {
  //       toast.show('Erreur', { message: error.message, type: 'error' })
  //     } else {
  //       toast.show('Oups', { message: "Un problème est survenu lors de l'ajout de l'image de l'événement, veuillez réessayer.", type: 'warning' })
  //     }
  //     return error
  //   },
  // })
}

export const usePaginatedMessages = (scope: string, status?: 'draft' | 'sent') => {
  return useInfiniteQuery({
    queryKey: ['messages', scope, status],
    queryFn: ({ pageParam = 1 }) => api.getMessages({ scope, page: pageParam, status, orderCreatedAt: 'desc' }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.last_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.metadata.current_page > 1 ? firstPage.metadata.current_page - 1 : undefined,
    placeholderData: (prev) => prev,
    refetchOnMount: true,
  })
}

export const useGetMessageCountRecipients = (props: { messageId?: string; scope?: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['message-count-recipients', props.messageId],
    queryFn: () => (props.messageId && props.scope ? api.getMessageCountRecipients({ messageId: props.messageId, scope: props.scope }) : Promise.resolve(undefined)),
    enabled: Boolean(props.messageId && props.scope) && props.enabled,
  })
}

export const useGetMessageCountRecipientsPartial = (props: { messageId?: string; scope?: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['message-count-recipients-partial', props.messageId],
    queryFn: () => (props.messageId && props.scope ? api.getMessageCountRecipients({ messageId: props.messageId, scope: props.scope, partial: true }) : Promise.resolve(undefined)),
    enabled: Boolean(props.messageId && props.scope) && props.enabled,
  })
}

export const useGetAvailableSenders = (props: { scope: string; }) => {
  return useQuery({
    queryKey: ['available-senders', props.scope],
    queryFn: () => api.getAvailableSenders({ scope: props.scope }),
    staleTime: 60 * 1000,
  })
}

export const useGetMessageFilters = (props: { messageId?: string; scope?: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['message-filters', props.messageId],
    queryFn: () => (props.messageId && props.scope ? api.getMessageFilters({ messageId: props.messageId, scope: props.scope }) : Promise.resolve(undefined)),
    enabled: props.enabled,
  })
}

export const usePutMessageFilters = (props: { messageId?: string; scope?: string }) => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RestPutMessageFiltersRequest) =>
      api.putMessageFilters({
        messageId: props.messageId!,
        payload,
        scope: props.scope!
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['message-count-recipients-partial', props.messageId],
      })
    },
    onError: (error) => {
      toast.show('Erreur', { message: 'Une erreur est survenue lors de la mise à jour des filtres', type: 'error' })
      return error
    }
  })
}

export { useAutoSave } from '@/features/publications/components/Editor/hooks/useAutoSave'

export const useGetFilterCollection = (props: { scope: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['filter-collection', props.scope],
    queryFn: () => api.getFilterCollection({ scope: props.scope }),
    enabled: props.enabled !== false,
    staleTime: 60 * 1000, // 1 minute
  })
}
