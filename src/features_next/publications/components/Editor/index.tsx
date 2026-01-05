import { forwardRef, useImperativeHandle, useRef, useMemo, useEffect, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useForm, FormProvider } from 'react-hook-form'
import { getTokenValue, isWeb, YStack, useMedia } from 'tamagui'
import { useLocalSearchParams, router } from 'expo-router'
import { StyleRendererContextProvider } from './context/styleRenderContext'
import { getHTML } from './HtmlOneRenderer'
import { RenderFields } from './RenderFields'
import defaultTheme from './themes/default-theme'
import { EditorMethods, RenderFieldRef } from './types'
import { createNodeByType, getDefaultFormValues, unZipMessage, zipMessage } from './utils'
import { useGetMessage } from '@/services/publications/hook'
import * as S from './schemas/messageBuilderSchema'
import { RestAvailableSender, RestGetMessageFiltersResponse, RestAvailableSendersResponse } from '@/services/publications/schema'
import { DebouncedSaveFunction, ImmediateSaveFunction } from './hooks/useAutoSave'

export { getHTML, defaultTheme }

export type MessageEditorProps = {
  theme: S.MessageStyle
  defaultValue?: S.Message
  onSubmit: () => void
  displayToolbar?: boolean
  messageId?: string
  onDisplayToolbarChange?: (display: boolean) => void
  sender: RestAvailableSender | null
  onMessageIdCreated?: (messageId: string) => void
  messageFilters?: RestGetMessageFiltersResponse
  onDebouncedSave: DebouncedSaveFunction
  onImmediateSave: ImmediateSaveFunction
  createdMessageId?: string | null
  onSenderChange?: (sender: RestAvailableSender | null) => void
  availableSenders?: RestAvailableSendersResponse
}

export type MessageEditorRef = {
  submit: () => void
  save: () => Promise<void>
  unSelect: () => void
}

const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>((props, ref) => {
  const searchParams = useLocalSearchParams<{ scope?: string; template?: string }>()
  const scopeFromQuery = searchParams?.scope
  const templateFromQuery = searchParams?.template
  const media = useMedia()

  const messageQueryParams = useMemo(() => ({
    messageId: props.messageId ?? '', 
    scope: scopeFromQuery ?? '', 
    enabled: !!props.messageId
  }), [props.messageId, scopeFromQuery])
  
  const { data: message } = useGetMessage(messageQueryParams)

  const defaultData = useMemo(() => {
    if (props.defaultValue) {
      return unZipMessage(props.defaultValue)
    }
    let struct: S.FieldsArray = []
    let states: S.MessageFormValues = getDefaultFormValues()
    if (templateFromQuery) {
      try {
        const template = JSON.parse(templateFromQuery)
        struct = template.map((field: { type: string }, idx: number) => ({
          id: `field_${idx}`,
          type: field.type,
        }))
        struct.forEach((field) => {
          if (!states[field.type]) states[field.type] = {}
          const node = createNodeByType(field.type)
          states[field.type][field.id] = node
        })
      } catch {
        struct = []
        states = getDefaultFormValues()
      }
    }
    return {
      metaData: {
        subject: '',
        scope: scopeFromQuery ?? undefined,
      },
      struct,
      states,
    }
  }, [props.defaultValue, templateFromQuery, scopeFromQuery])

  const formMethods = useForm<S.GlobalForm>({
    defaultValues: { 
      formValues: defaultData.states, 
      metaData: defaultData.metaData, 
      selectedField: null, 
      addBarOpenForFieldId: null,
      filters: {
        hasRecipients: true
      }
    },
    resolver: zodResolver(S.MessageFormValuesValidatorSchema),
  })

  const { control, handleSubmit, setValue, unregister, getValues } = formMethods

  const {
    onDebouncedSave,
    onImmediateSave,
    createdMessageId,
  } = props

  useEffect(() => {
    if (createdMessageId) {
      props.onMessageIdCreated?.(createdMessageId)
      router.setParams({ 
        id: createdMessageId,
        scope: scopeFromQuery 
      })
    }
  }, [createdMessageId, scopeFromQuery, props.onMessageIdCreated])

  const renderFieldsRef = useRef<RenderFieldRef>(null)
  const generateFieldId = useCallback((): string => {
    const usedFieldIds = new Set((renderFieldsRef.current?.getFields() ?? []).map((currentField) => currentField.id))
    let candidateId = ''
    do {
      candidateId = uniqueId('field_')
    } while (usedFieldIds.has(candidateId))
    return candidateId
  }, [])

  const editorMethods = useRef({
    addField: (node: S.NodeType | S.Node, afterField?: S.FieldsArray[number], atStart?: boolean) => {
      const field = { id: generateFieldId(), type: typeof node === 'string' ? node : node.type }
      setValue(`formValues.${field.type}.${field.id}`, typeof node === 'string' ? createNodeByType(node) : node)
      setValue(`selectedField`, { edit: true, field })
      renderFieldsRef.current?.addField(field, afterField, atStart)
      setTimeout(() => {
        renderFieldsRef.current?.scrollToField(field)
      }, 100)
    },
    removeField: (field: S.FieldsArray[number]) => {
      renderFieldsRef.current?.removeField(field)
      unregister(`formValues.${field.type}.${field.id}`)
      setValue('selectedField', null)
      setTimeout(() => {
        const currentValues = getValues()
        const fields = renderFieldsRef.current?.getFields() ?? []
        onImmediateSave(currentValues.formValues, fields, currentValues.metaData, props.sender, zipMessage, getHTML, defaultTheme)
      }, 100)
    },
    moveField: (...xs) => {
      renderFieldsRef.current?.moveField(...xs)
      onDebouncedSave(getValues().formValues, renderFieldsRef.current?.getFields() ?? [], getValues().metaData, props.sender, zipMessage, getHTML, defaultTheme)
    },
    scrollToField: (...xs) => {
      renderFieldsRef.current?.scrollToField(...xs)
    },
    getFields: () => renderFieldsRef.current?.getFields() ?? [],
    unSelect: () => setValue('selectedField', null),
    editField: (field: S.FieldsArray[number]) => setValue('selectedField', { edit: true, field }),
    setEditorMode: (mode: 'edit' | 'preview') => {
      props.onDisplayToolbarChange?.(mode === 'edit')
    }
  } satisfies EditorMethods)

  const handleNodeChange = useCallback(() => {
    onDebouncedSave(getValues().formValues, renderFieldsRef.current?.getFields() ?? [], getValues().metaData, props.sender, zipMessage, getHTML, defaultTheme)
  }, [onDebouncedSave, getValues, props.sender])

  const handleSenderChange = useCallback((newSender: RestAvailableSender) => {
    props.onSenderChange?.(newSender)
    // Sauvegarder immédiatement avec le nouveau sender
    const currentValues = getValues()
    const fields = renderFieldsRef.current?.getFields() ?? []
    onImmediateSave(currentValues.formValues, fields, currentValues.metaData, newSender, zipMessage, getHTML, defaultTheme, true)
      .catch(() => {
        props.onSenderChange?.(null)
      })
  }, [props.onSenderChange, getValues, onImmediateSave])

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(
      (x) => {
        const fields = renderFieldsRef.current!.getFields()
        onImmediateSave(x.formValues, fields, x.metaData, props.sender, zipMessage, getHTML, defaultTheme).then(() => {
          props.onSubmit()
        }).catch((error) => {
          console.error('Submit error:', error)
        })
      },
      (errors) => {
        console.error('Validation errors:', errors);
      }
    ),
    save: async () => {
      const currentValues = getValues()
      const fields = renderFieldsRef.current?.getFields() ?? []
      await onImmediateSave(currentValues.formValues, fields, currentValues.metaData, props.sender, zipMessage, getHTML, defaultTheme)
    },
    unSelect: () => {
      setValue('selectedField', null)
      setValue('addBarOpenForFieldId', null)
    },
  }))

  return (
    <YStack alignItems="center" flex={1}>
      <YStack
        maxWidth={520}
        width="100%"
        flexGrow={1}
        paddingTop={(media.gtSm && isWeb) ? '$large' : undefined}
        paddingBottom={(media.gtSm && isWeb) ? 170 + getTokenValue('$medium') : undefined}
      >
        <YStack flex={1} gap="$medium" position="relative">
          <StyleRendererContextProvider value={props.theme}>
            <FormProvider {...formMethods}>
              <RenderFields
                ref={renderFieldsRef}
                control={control}
                defaultStruct={defaultData.struct}
                editorMethods={editorMethods}
                displayToolbar={props.displayToolbar}
                availableSenders={props.availableSenders}
                message={message}
                onNodeChange={handleNodeChange}
                messageFilters={props.messageFilters}
                messageId={props.messageId}
                scope={scopeFromQuery ?? ''}
                onSenderChange={handleSenderChange}
                selectedSender={props.sender}
              />
            </FormProvider>
          </StyleRendererContextProvider>
        </YStack>
      </YStack>
    </YStack>
  )
})

export default MessageEditor
