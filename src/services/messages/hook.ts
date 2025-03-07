import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/messages/api'
import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RestPostMessageResponse } from '../files/schema'
import { RestPostMessageRequest } from './schema'

export const useCreateMessage = (props: { uuid?: string }) => {
  const toast = useToastController()
  const successMessage = props.uuid ? 'Message modifié avec succès' : 'Message créé avec succès'
  const errorMessage = props.uuid ? 'Impossible de modifier ce message' : 'Impossible de créer ce message'
  return useMutation({
    mutationFn:
      props.uuid !== undefined
        ? ({ payload, scope }: { payload: RestPostMessageRequest; scope: string }) => api.updateMessage({ payload, messageId: props.uuid!, scope })
        : api.createMessage,
    onSuccess: () => {
      toast.show('Succès', { message: successMessage, type: 'success' })
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
  const successMessage = 'Email envoyé avec succès'
  const errorMessage = "L'envoi de l'email n'a pas abouti"
  return useMutation({
    mutationFn: ({ test, scope }: Omit<Parameters<typeof api.sendMessage>[0], 'messageId'> & { test?: boolean }) =>
      test
        ? api.sendTestMessage({ scope, messageId: props.uuid })
        : api.sendMessage({
            scope,
            messageId: props.uuid,
          }),
    onSuccess: () => {
      toast.show('Succès', { message: successMessage, type: 'success' })
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
  })
}

class MessageNotSynchronizedError extends Error {
  constructor(messageId?: string) {
    super(`Message ${messageId} n'est pas synchronisé`)
  }
}

export const useGetIsMessageTilSync = (props: { payload?: { messageId: string; scope: string } }) => {
  return useQuery({
    queryKey: ['message', props?.payload?.messageId],
    queryFn: () =>
      props.payload?.messageId && props.payload?.scope
        ? api.getMessage({ messageId: props.payload.messageId, scope: props.payload.scope }).then((x) => {
            if (x.synchronized) {
              return x as Omit<RestPostMessageResponse, 'synchronized'> & { synchronized: true }
            }
            throw new MessageNotSynchronizedError(props.payload?.messageId)
          })
        : Promise.resolve(undefined),
    enabled: Boolean(props.payload?.messageId && props.payload?.scope),
    refetchOnMount: true,
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
