import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import TestMessage from '@/features/message/data/test'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus } from '@tamagui/lucide-icons'
import { Link, router } from 'expo-router'
import { uniqueId } from 'lodash'
import { useForm } from 'react-hook-form'
import { getTokenValue, isWeb, useMedia, XStack, YStack } from 'tamagui'
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
        metaData: {
          object: '',
        },
        struct: [defaultField] as S.FieldsArray,
        states: {
          ...getDefaultFormValues(),
          ['image']: { [defaultField.id]: headingImagePlaceholderNode },
        } as S.MessageFormValues,
      }

  const { control, handleSubmit, setValue, unregister } = useForm<S.GlobalForm>({
    defaultValues: { formValues: defaultData.states, selectedField: null },
    resolver: zodResolver(S.MessageFormValuesValidatorSchema),
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
  const media = useMedia()

  const onSubmit = handleSubmit((x) => console.log(x, zipMessage(x.formValues, renderFieldsRef.current!.getFields(), x.metaData)))
  return (
    <>
      <PageLayout.MainSingleColumn>
        <StickyBox webOnly offsetTop={media.gtSm ? '$large' : undefined} style={{ zIndex: 10 }}>
          <YStack $gtSm={{ marginVertical: '$large', borderRadius: 50, overflow: 'hidden', zIndex: 10 }}>
            <VoxHeader borderRadius={20}>
              <XStack alignItems="center" flex={1} width="100%">
                <XStack alignContent="flex-start">
                  <Link href={router.canGoBack() ? '../' : '/message'} replace asChild={!isWeb}>
                    <VoxButton size="lg" variant="text" theme="orange">
                      Annuler
                    </VoxButton>
                  </Link>
                </XStack>
                <XStack flexGrow={1} justifyContent="center">
                  <VoxHeader.Title icon={MailPlus}>Message</VoxHeader.Title>
                </XStack>
                <XStack>
                  <VoxButton size="lg" variant="text" theme="purple" onPress={onSubmit}>
                    Suivant
                  </VoxButton>
                </XStack>
              </XStack>
            </VoxHeader>
          </YStack>
        </StickyBox>
        <YStack alignItems="center" flex={1}>
          <YStack
            maxWidth={500}
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
              <StyleRendererContextProvider value={defaultTheme}>
                <RenderFields ref={renderFieldsRef} control={control} defaultStruct={defaultData.struct} />
              </StyleRendererContextProvider>
            </YStack>
          </YStack>
        </YStack>
        <MessageEditorToolbar ref={toolbarRef} control={control} editorMethods={editorMethods} />
      </PageLayout.MainSingleColumn>
    </>
  )
})

export default MessageEditorPage
