import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/publications/api'
import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { RestAvailableSender, RestGetMessageResponse, RestPostMessageRequest, RestPutMessageFiltersRequest } from './schema'
import { PAGINATED_QUERY_FEED } from '@/services/timeline-feed/hook/index'
import { useCallback, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { zipMessage } from '@/features/publications/components/Editor/utils'
import { getHTML } from '@/features/publications/components/Editor/HtmlOneRenderer'
import { defaultTheme } from '@/features/publications/components/Editor'

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

export const useAutoSave = (props: {
  messageId?: string
  scope: string
}) => {
  const lastSavedContent = useRef<string>('')
  const pendingSaves = useRef<Set<string>>(new Set())
  const createdMessageId = useRef<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined)
  const [hasError, setHasError] = useState<boolean>(false)

  const { mutateAsync: saveMessage, isPending } = useCreateMessage({ uuid: props.messageId })

  // Fonction utilitaire pour vérifier si un node a du contenu
  const hasContent = useCallback((node: S.Node): boolean => {
    if (!node.content) return false

    switch (node.type) {
      case 'richtext':
        return Boolean(node.content.pure && node.content.pure.length > 0)
      case 'button':
        return Boolean(node.content.text && node.content.text.length > 0 &&
          node.content.link && node.content.link.length > 0)
      case 'image':
        return Boolean(node.content.url && node.content.url.length > 0)
      default:
        return false
    }
  }, [])

  // Fonction pour vérifier si un message a du contenu valide
  const hasValidContent = useCallback((formValues: S.MessageFormValues, fields: S.FieldsArray): boolean => {
    return fields.some(field => {
      const node = formValues[field.type]?.[field.id]
      return node && hasContent(node)
    })
  }, [hasContent])

  // Fonction de sauvegarde avec vérification de changement et de contenu
  const performSave = useCallback(async (
    formValues: S.MessageFormValues,
    fields: S.FieldsArray,
    metaData: S.MessageMetaData,
    sender: RestAvailableSender | null,
    forceSave = false
  ) => {
    const currentContent = JSON.stringify({ formValues, fields, metaData })
    const contentHash = `${currentContent}_${Date.now()}`

    // Éviter les sauvegardes en double
    if (pendingSaves.current.has(contentHash)) {
      return
    }

    // Éviter les sauvegardes inutiles sauf si forcée
    if (!forceSave && currentContent === lastSavedContent.current) {
      return
    }

    // Vérifier qu'il y a du contenu valide avant de sauvegarder
    if (!forceSave && !hasValidContent(formValues, fields)) {
      return
    }

    const message = zipMessage(formValues, fields, metaData)
    const htmlContent = getHTML(defaultTheme, message, sender)

    try {
      pendingSaves.current.add(contentHash)
      setHasError(false)

      const message = zipMessage(formValues, fields, metaData)
      const result = await saveMessage({
        scope: props.scope,
        payload: {
          type: metaData.scope,
          subject: metaData.subject,
          label: metaData.subject,
          json_content: JSON.stringify(message),
          content: htmlContent,
        },
      })

      // Si c'est la première sauvegarde et qu'on n'avait pas d'ID, stocker le nouvel ID
      if (!props.messageId && result?.uuid && !createdMessageId.current) {
        createdMessageId.current = result.uuid
      }

      lastSavedContent.current = currentContent
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving message:', error)
      setHasError(true)
    } finally {
      pendingSaves.current.delete(contentHash)
    }
  }, [saveMessage, props.scope, hasValidContent, props.messageId])

  // Sauvegarde debounced pour les modifications continues (seulement si contenu valide)
  const debouncedSave = useDebouncedCallback(
    (formValues: S.MessageFormValues, fields: S.FieldsArray, metaData: S.MessageMetaData, sender: RestAvailableSender | null) => {
      performSave(formValues, fields, metaData, sender, false)
    },
    3000, // 3 secondes de délai
    {
      leading: false,
      trailing: true,
      maxWait: 15000, // Maximum 15 secondes d'attente
    }
  )

  // Sauvegarde immédiate pour les actions critiques
  const immediateSave = useCallback((
    formValues: S.MessageFormValues,
    fields: S.FieldsArray,
    metaData: S.MessageMetaData,
    sender: RestAvailableSender | null
  ) => {
    debouncedSave.cancel() // Annuler les sauvegardes en attente
    return performSave(formValues, fields, metaData, sender, true) // Force save
  }, [performSave, debouncedSave])

  return {
    debouncedSave,
    immediateSave,
    isPending,
    lastSaved,
    hasError,
    createdMessageId: createdMessageId.current,
  }
}

export const useGetFilterCollection = (props: { scope: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['filter-collection', props.scope],
    queryFn: () => api.getFilterCollection({ scope: props.scope }),
    enabled: props.enabled !== false,
    staleTime: 60 * 1000, // 1 minute
  })
}
