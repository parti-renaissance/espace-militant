import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import { ButtonRenderer } from '@/features/message/components/NodeRenderer/ButtonRenderer'
import { ImageRenderer } from '@/features/message/components/NodeRenderer/ImageRenderer'
import { RichTextRenderer } from '@/features/message/components/NodeRenderer/RichTextRenderer'
import TestMessage from '@/features/message/data/test'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { uniqueId } from 'lodash'
import { Control, Controller, useForm } from 'react-hook-form'
import { isWeb, YStack } from 'tamagui'
import { StyleRendererContextProvider } from '../../context/styleRenderContext'
import headingImagePlaceholderNode from '../../data/headingImagePlaceholder'
import defaultTheme from '../../themes/default-theme'
import { NodeEditor } from './components/NodeEditor'
import { NodeSelectorWrapper } from './components/NodeSelectorWrapper'
import MessageEditorToolbar, { MessageEditorToolBarRef } from './components/ToolBar'
import { RenderFieldRef } from './types'
import { createNodeByType, getDefaultFormValues, unZipMessage, zipMessage } from './utils'

const dataTest = S.MessageSchema.safeParse(TestMessage)

const MessageEditorPage: React.FC = () => {
  return (
    <PageLayout webScrollable>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

const RenderField = memo((props: { field: S.FieldsArray[number]; control: Control<S.GlobalForm> }) => {
  switch (props.field.type) {
    case 'image':
      return (
        <NodeSelectorWrapper control={props.control} field={props.field}>
          <Controller control={props.control} name={`formValues.image.${props.field.id}`} render={({ field }) => <ImageRenderer data={field.value} />} />
        </NodeSelectorWrapper>
      )
    case 'button':
      return (
        <NodeSelectorWrapper control={props.control} field={props.field}>
          <Controller control={props.control} name={`formValues.button.${props.field.id}`} render={({ field }) => <ButtonRenderer data={field.value} />} />
        </NodeSelectorWrapper>
      )
    case 'doc':
      return (
        <NodeSelectorWrapper control={props.control} field={props.field}>
          <Controller control={props.control} name={`formValues.doc.${props.field.id}`} render={({ field }) => <RichTextRenderer data={field.value} />} />
        </NodeSelectorWrapper>
      )
    default:
      return null
  }
})

const data = dataTest.success ? dataTest.data : undefined

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.GlobalForm>
  onAddField: (x: S.FieldsArray[number]) => void
  onRemoveField: (x: S.FieldsArray[number]) => void
}

const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)
  const scrollRef = useRef<FlatList>(null)

  useImperativeHandle(ref, () => {
    return {
      getFields: () => fields,
      scrollToField: (field) => {
        if (isWeb) {
          const htmlId = `field-${field.type}-${field.id}`
          const el = document.getElementById(htmlId)
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        } else {
          const index = fields.findIndex((x) => x.id === field.id)
          if (index === -1) return
          scrollRef.current?.scrollToIndex({
            index,
            viewPosition: 0.5,
            animated: true,
          })
        }
      },
      addField: (from, type) => {
        const uuid = uniqueId()
        const newField = { id: uuid, type: type }
        props.onAddField(newField)
        setFields((xs) => {
          if (from === null) {
            return [...xs, newField]
          }
          const _appendTo = xs.findIndex((x) => x.id === from.id)
          const appendTo = _appendTo === -1 ? xs.length : _appendTo
          return [...xs.slice(0, appendTo + 1), newField, ...xs.slice(appendTo + 1)]
        })
      },

      removeField: ({ id, type }: S.FieldsArray[number]) => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === id)
          if (fieldIndex === -1) return xs
          return [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
        })
        props.onRemoveField({ type, id })
      },

      moveField: (field, distance) => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === field.id)
          if (fieldIndex === -1) return xs
          const fieldRemoved = [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
          const fieldMoved = [...fieldRemoved.slice(0, fieldIndex + distance), field, ...fieldRemoved.slice(fieldIndex + distance)]
          return fieldMoved
        })
      },
    }
  }, [fields])

  const RenderItem = useCallback(({ item }: ListRenderItemInfo<S.FieldsArray[number]>) => <RenderField control={props.control} field={item} />, [])

  const keyExtractor = useCallback((props: S.FieldsArray[number]) => props.id, [])

  return (
    <FlatList
      style={renderFieldsStyle.flatlist}
      ref={scrollRef}
      contentContainerStyle={renderFieldsStyle.flatlistContainer}
      data={fields}
      renderItem={RenderItem}
      keyExtractor={keyExtractor}
    />
  )
})

const renderFieldsStyle = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: 600,
  },
  flatlistContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 50,
    overflow: 'hidden',
    marginBottom: 200,
  },
})

function _EventFormScreen() {
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

  const handleAddField = useCallback((x: S.FieldsArray[number]) => {
    setValue(`formValues.${x.type}.${x.id}`, createNodeByType(x.type))
    setValue(`selectedField`, x)
    toolbarRef.current?.toggleAddBar(false)
    setTimeout(() => {
      renderFieldsRef.current?.scrollToField(x)
    })
  }, [])

  const handleRemoveField = useCallback(
    (x: S.FieldsArray[number]) => () => {
      unregister(`formValues.${x.type}.${x.id}`)
    },
    [],
  )

  const onSubmit = handleSubmit((x) => console.log(x, zipMessage(x.formValues, renderFieldsRef.current!.getFields())))
  return (
    <>
      <PageLayout.MainSingleColumn>
        <YStack flex={1} gap="$medium" alignItems="center" position="relative">
          <StyleRendererContextProvider value={defaultTheme}>
            <RenderFields
              ref={renderFieldsRef}
              control={control}
              defaultStruct={defaultData.struct}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
            />
          </StyleRendererContextProvider>
          <MessageEditorToolbar ref={toolbarRef} control={control} renderFieldsRef={renderFieldsRef} />
        </YStack>
      </PageLayout.MainSingleColumn>
      <PageLayout.SideBarRight width={500} showOn="gtSm">
        <VoxButton onPress={onSubmit}>handle submit</VoxButton>
        <VoxCard>
          <VoxCard.Content>
            <NodeEditor control={control} />
          </VoxCard.Content>
        </VoxCard>
      </PageLayout.SideBarRight>
    </>
  )
}

export default MessageEditorPage
