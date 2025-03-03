import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import TestMessage from '@/features/message/data/test'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { uniqueId } from 'lodash'
import { useForm } from 'react-hook-form'
import { YStack } from 'tamagui'
import { StyleRendererContextProvider } from '../../context/styleRenderContext'
import headingImagePlaceholderNode from '../../data/headingImagePlaceholder'
import defaultTheme from '../../themes/default-theme'
import { RenderFields } from './components/RenderFields'
import MessageEditorToolbar, { MessageEditorToolBarRef } from './components/ToolBar'
import { EditorMethods, RenderFieldRef } from './types'
import { createNodeByType, getDefaultFormValues, unZipMessage, zipMessage } from './utils'

const dataTest = S.MessageSchema.safeParse(TestMessage)

const MessageEditorPage: React.FC = () => {
  const editorRef = useRef<EditorMethods>(null)
  return (
    <PageLayout
      webScrollable
      onPress={() => {
        editorRef.current?.unSelect()
      }}
    >
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <Editor ref={editorRef} />
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

const data = dataTest.success ? dataTest.data : undefined

const Editor = forwardRef<EditorMethods, object>(function Editor(_, ref) {
  const defaultField = {
    type: 'image',
    id: uniqueId(),
  } as const

  const defaultData = data
    ? unZipMessage(data)
    : {
        struct: [defaultField] as S.FieldsArray,
        states: {
          ...getDefaultFormValues(),
          ['image']: { [defaultField.id]: headingImagePlaceholderNode },
        } as S.MessageFormValues,
      }

  const { control, handleSubmit, setValue, unregister } = useForm<S.GlobalForm>({
    defaultValues: { formValues: defaultData.states, selectedField: null },
  })

  const renderFieldsRef = useRef<RenderFieldRef>(null)
  const toolbarRef = useRef<MessageEditorToolBarRef>(null)
  const editorMethods = useRef({
    addField: (node: S.NodeType | S.Node, afterField?: S.FieldsArray[number]) => {
      const field = { id: uniqueId(), type: typeof node === 'string' ? node : node.type }
      setValue(`formValues.${field.type}.${field.id}`, typeof node === 'string' ? createNodeByType(node) : node)
      setValue(`selectedField`, { edit: true, field })
      toolbarRef.current?.toggleAddBar(false)
      renderFieldsRef.current?.addField(field, afterField)
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

  useImperativeHandle(ref, () => editorMethods.current!)

  const onSubmit = handleSubmit((x) => console.log(x, zipMessage(x.formValues, renderFieldsRef.current!.getFields())))
  return (
    <>
      <PageLayout.MainSingleColumn alignItems="center">
        <YStack maxWidth={500} width="100%" flexGrow={1}>
          <YStack flex={1} gap="$medium" position="relative">
            <StyleRendererContextProvider value={defaultTheme}>
              <RenderFields ref={renderFieldsRef} control={control} defaultStruct={defaultData.struct} />
            </StyleRendererContextProvider>
          </YStack>
        </YStack>
        <MessageEditorToolbar ref={toolbarRef} control={control} editorMethods={editorMethods} />
      </PageLayout.MainSingleColumn>
      {/* <PageLayout.SideBarRight width={500} showOn="gtSm">
        <YStack onPress={(e) => e.stopPropagation()}>
          <VoxButton onPress={onSubmit}>handle submit</VoxButton>
          <VoxCard>
            <VoxCard.Content>
              <NodeEditor control={control} />
            </VoxCard.Content>
          </VoxCard>
        </YStack>
      </PageLayout.SideBarRight> */}
    </>
  )
})

export default MessageEditorPage
