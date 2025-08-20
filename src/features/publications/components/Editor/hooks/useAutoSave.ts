import { useCallback, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastController } from '@tamagui/toast'
import { GenericResponseError } from '@/services/common/errors/generic-errors'
import * as api from '@/services/publications/api'
import { RestAvailableSender, RestPostMessageRequest } from '@/services/publications/schema'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'

export const useAutoSave = (props: {
  messageId?: string
  scope: string
}) => {
  const lastSavedContent = useRef<string>('')
  const pendingSaves = useRef<Set<string>>(new Set())
  const createdMessageId = useRef<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined)
  const [hasError, setHasError] = useState<boolean>(false)
  const toast = useToastController()
  const queryClient = useQueryClient()

  const { mutateAsync: saveMessage, isPending } = useMutation({
    mutationFn: props.messageId !== undefined
      ? ({ payload, scope }: { payload: RestPostMessageRequest; scope: string }) => 
          api.updateMessage({ payload, messageId: props.messageId!, scope })
      : api.createMessage,
    onSuccess: (data) => {
      if (props.messageId) {
        queryClient.invalidateQueries({ queryKey: ['message', props.messageId] })
        queryClient.invalidateQueries({ queryKey: ['message-content', props.messageId] })
      } else if (data?.uuid) {
        queryClient.invalidateQueries({ queryKey: ['message', data.uuid] })
        queryClient.invalidateQueries({ queryKey: ['message-content', data.uuid] })
      }
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        const errorMessage = props.messageId ? 'Impossible de modifier ce message' : 'Impossible de créer ce message'
        toast.show('Erreur', { message: errorMessage, type: 'error' })
      }
      return error
    },
  })

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
    zipMessageFn: (formValues: S.MessageFormValues, fields: S.FieldsArray, metaData: S.MessageMetaData) => S.Message,
    getHTMLFn: (theme: any, message: S.Message, sender: RestAvailableSender | null) => string,
    theme: any,
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

    const message = zipMessageFn(formValues, fields, metaData)
    const htmlContent = getHTMLFn(theme, message, sender)

    try {
      pendingSaves.current.add(contentHash)
      setHasError(false)

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
    (formValues: S.MessageFormValues, fields: S.FieldsArray, metaData: S.MessageMetaData, sender: RestAvailableSender | null, zipMessageFn: any, getHTMLFn: any, theme: any) => {
      performSave(formValues, fields, metaData, sender, zipMessageFn, getHTMLFn, theme, false)
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
    sender: RestAvailableSender | null,
    zipMessageFn: any,
    getHTMLFn: any,
    theme: any
  ) => {
    debouncedSave.cancel() // Annuler les sauvegardes en attente
    return performSave(formValues, fields, metaData, sender, zipMessageFn, getHTMLFn, theme, true) // Force save
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