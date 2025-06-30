import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useForm } from 'react-hook-form'
import { getTokenValue, isWeb, YStack } from 'tamagui'
import { StyleRendererContextProvider } from './context/styleRenderContext'
import { getHTML } from './HtmlOneRenderer'
import { RenderFields } from './RenderFields'
import defaultTheme from './themes/default-theme'
import { EditorMethods, RenderFieldRef } from './types'
import { createNodeByType, getDefaultFormValues, unZipMessage, zipMessage } from './utils'

export { getHTML, defaultTheme }

export type MessageEditorProps = {
  theme: S.MessageStyle
  defaultValue?: S.Message
  onSubmit: (x: S.Message) => void
  displayToolbar?: boolean
}

export type MessageEditorRef = {
  submit: () => void
  unSelect: () => void
}

const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>((props, ref) => {
  const defaultData = props.defaultValue
    ? unZipMessage(props.defaultValue)
    : {
        metaData: {
          subject: '',
          scope: undefined,
        },
        struct: [] as S.FieldsArray,
        states: {
          ...getDefaultFormValues(),
        } as S.MessageFormValues,
      }

  const { control, handleSubmit, setValue, unregister } = useForm<S.GlobalForm>({
    defaultValues: { formValues: defaultData.states, metaData: defaultData.metaData, selectedField: null, addBarOpenForFieldId: null },
    resolver: zodResolver(S.MessageFormValuesValidatorSchema),
  })

  const renderFieldsRef = useRef<RenderFieldRef>(null)
  const editorMethods = useRef({
    addField: (node: S.NodeType | S.Node, afterField?: S.FieldsArray[number], atStart?: boolean) => {
      const field = { id: uniqueId(), type: typeof node === 'string' ? node : node.type }
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
    },
    moveField: (...xs) => {
      renderFieldsRef.current?.moveField(...xs)
    },
    scrollToField: (...xs) => {
      renderFieldsRef.current?.scrollToField(...xs)
    },
    getFields: () => renderFieldsRef.current?.getFields() ?? [],
    unSelect: () => setValue('selectedField', null),
    editField: (field: S.FieldsArray[number]) => setValue('selectedField', { edit: true, field }),
  } satisfies EditorMethods)

  useImperativeHandle(ref, () => ({
    submit: handleSubmit((x) => {
      console.log('ref submit');
      props.onSubmit(zipMessage(x.formValues, renderFieldsRef.current!.getFields(), x.metaData))
    }),
    unSelect: () => {
      setValue('selectedField', null)
      setValue('addBarOpenForFieldId', null)
    },
  }))

  return (
    <YStack alignItems="center" flex={1}>
      <YStack
        maxWidth={550}
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
            <RenderFields ref={renderFieldsRef} control={control} defaultStruct={defaultData.struct} editorMethods={editorMethods} displayToolbar={props.displayToolbar} />
          </StyleRendererContextProvider>
        </YStack>
      </YStack>
    </YStack>
  )
})

export default MessageEditor
