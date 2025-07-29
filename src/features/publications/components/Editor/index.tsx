import { forwardRef, useImperativeHandle, useRef, useMemo, useEffect, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useForm, FormProvider } from 'react-hook-form'
import { getTokenValue, isWeb, YStack } from 'tamagui'
import { useLocalSearchParams, router } from 'expo-router'
import { StyleRendererContextProvider } from './context/styleRenderContext'
import { getHTML } from './HtmlOneRenderer'
import { RenderFields } from './RenderFields'
import defaultTheme from './themes/default-theme'
import { EditorMethods, RenderFieldRef } from './types'
import { createNodeByType, getDefaultFormValues, unZipMessage, zipMessage } from './utils'
import { useGetAvailableSenders, useGetMessage, useAutoSave } from '@/services/publications/hook'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import { RestAvailableSender, RestGetMessageFiltersResponse } from '@/services/publications/schema'

export { getHTML, defaultTheme }

export type MessageEditorProps = {
  theme: S.MessageStyle
  defaultValue?: S.Message
  onSubmit: (x: S.Message) => void
  displayToolbar?: boolean
  messageId?: string
  onDisplayToolbarChange?: (display: boolean) => void
  sender: RestAvailableSender
  onMessageIdCreated?: (messageId: string) => void
  messageFilters?: RestGetMessageFiltersResponse
}

export type MessageEditorRef = {
  submit: () => void
  unSelect: () => void
}

const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>((props, ref) => {
  const searchParams = useLocalSearchParams<{ scope?: string; template?: string }>()
  const scopeFromQuery = searchParams?.scope
  const templateFromQuery = searchParams?.template
  
  const messageQueryParams = useMemo(() => ({
    messageId: props.messageId ?? '', 
    scope: scopeFromQuery ?? '', 
    enabled: !!props.messageId
  }), [props.messageId, scopeFromQuery])
  
  const { data: message } = useGetMessage(messageQueryParams)
  
  const availableSendersQueryParams = useMemo(() => ({
    scope: message?.author.scope ?? scopeFromQuery ?? ''
  }), [message?.author.scope, scopeFromQuery])
  
  const { data: availableSenders } = useGetAvailableSenders(availableSendersQueryParams)

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
      } catch (e) {
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
    debouncedSave, 
    immediateSave,
    isPending: isAutoSaving,
    lastSaved,
    hasError,
    createdMessageId,
  } = useAutoSave({
    messageId: props.messageId,
    scope: scopeFromQuery ?? '',
  })

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
  const editorMethods = useRef({
    addField: (node: S.NodeType | S.Node, afterField?: S.FieldsArray[number], atStart?: boolean) => {
      const field = { id: `field_${uniqueId()}`, type: typeof node === 'string' ? node : node.type }
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
        immediateSave(currentValues.formValues, fields, currentValues.metaData, props.sender)
      }, 100)
    },
    moveField: (...xs) => {
      renderFieldsRef.current?.moveField(...xs)
      debouncedSave(getValues().formValues, renderFieldsRef.current?.getFields() ?? [], getValues().metaData, props.sender)
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
    debouncedSave(getValues().formValues, renderFieldsRef.current?.getFields() ?? [], getValues().metaData, props.sender)
  }, [debouncedSave, getValues, props.sender])

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(
      (x) => {
        const fields = renderFieldsRef.current!.getFields()
        immediateSave(x.formValues, fields, x.metaData, props.sender).then(() => {
          props.onSubmit(zipMessage(x.formValues, fields, x.metaData))
        }).catch((error) => {
          console.error('Submit error:', error)
        })
      },
      (errors) => {
        console.error('Validation errors:', errors);
        console.error('Form errors details:', JSON.stringify(errors, null, 2));
      }
    ),
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
        $gtSm={
          isWeb
            ? {
              paddingTop: '$large',
              paddingBottom: 170 + getTokenValue('$medium'),
            }
            : undefined
        }
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
                availableSenders={availableSenders}
                message={message}
                onNodeChange={handleNodeChange}
                messageFilters={props.messageFilters}
                messageId={props.messageId}
                scope={scopeFromQuery ?? ''}
              />
            </FormProvider>
          </StyleRendererContextProvider>
        </YStack>
      </YStack>

      <AutoSaveIndicator
        isSaving={isAutoSaving}
        lastSaved={lastSaved}
        hasError={hasError}
      />
    </YStack>
  )
})

export default MessageEditor
