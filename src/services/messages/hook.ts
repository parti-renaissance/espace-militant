import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/messages/api'
import { useToastController } from '@tamagui/toast'
import { useMutation } from '@tanstack/react-query'
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
