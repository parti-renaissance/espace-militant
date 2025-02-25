import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { FormFileImage } from '@/components/base/FormFileUpload/FormFileImage'
import Select, { SelectOption } from '@/components/base/Select/SelectV3'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import DescriptionInput from '@/features/events/pages/create-edit/DescriptionInput'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import TestMessage from '@/features/message/data/test'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { ChevronDown, ChevronUp, Image, Link, Plus, Text, Trash } from '@tamagui/lucide-icons'
import Head from 'expo-router/head'
import { uniqueId } from 'lodash'
import { Control, Controller, useForm } from 'react-hook-form'
import { View, XStack, YStack } from 'tamagui'
import headingImagePlaceholderNode from '../../data/headingImagePlaceholder'
import { createNodeByType, getDefaultFormValues, unZipMessage, updateNode, zipMessage } from './utils'

const dataTest = S.MessageSchema.safeParse(TestMessage)

const MessageEditorPage: React.FC = () => {
  return (
    <PageLayout webScrollable>
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={100}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={100} />
    </PageLayout>
  )
}

const fieldOptions: SelectOption<S.NodeType>[] = [
  {
    label: 'Un bouton',
    icon: Link,
    value: 'button',
  },
  {
    value: 'image',
    icon: Image,
    label: 'Une image',
  },
  {
    value: 'doc',
    icon: Text,
    label: 'Un block Text',
  },
]

const RenderField = (props: { type: S.NodeType; control: Control<S.MessageFormValues>; uuid: string }) => {
  switch (props.type) {
    case 'image':
      return (
        <Controller
          control={props.control}
          name={`image.${props.uuid}`}
          render={({ field }) => <FormFileImage value={field.value?.image} onChange={(x) => field.onChange(updateNode('image', { image: x }))} />}
        />
      )
    case 'button':
      return <Controller control={props.control} name={`button.${props.uuid}`} render={() => <VoxButton>bouton</VoxButton>} />
    case 'doc':
      return (
        <Controller
          control={props.control}
          name={`doc.${props.uuid}`}
          render={({ field }) => (
            <DescriptionInput
              value={{ json: field.value ? JSON.stringify(field.value) : '', html: '', pure: '' }}
              label="Corps"
              onChange={(x) => field.onChange(JSON.parse(x.json))}
              onBlur={() => {}}
            />
          )}
        />
      )
    default:
      return null
  }
}

const RenderFieldWithUI = memo(
  (props: {
    control: Control<S.MessageFormValues>
    handleAddField: (f: string) => (x: S.NodeType) => void
    handleMove: (id: string, distance: number) => () => void
    handleDeleteField: (x: S.FieldsArray[number]) => () => void
    field: S.FieldsArray[number]
  }) => {
    return (
      <YStack gap="$medium">
        <XStack alignItems="center" gap="$small" flex={1}>
          <XStack>
            <YStack gap="$xsmall">
              <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronUp} onPress={props.handleMove(props.field.id, -1)} />
              <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronDown} onPress={props.handleMove(props.field.id, +1)} />
            </YStack>
          </XStack>
          <View flex={1}>
            <RenderField type={props.field.type} uuid={props.field.id} control={props.control} />
          </View>
          <XStack>
            <VoxButton theme="purple" variant="soft" size="xl" shrink iconLeft={Trash} onPress={props.handleDeleteField(props.field)} />
          </XStack>
        </XStack>
        <XStack justifyContent="center">
          <Select
            theme="purple"
            size="xs"
            icon={Plus}
            label="Ajouter"
            noValuePlaceholder="un block"
            options={fieldOptions}
            onChange={props.handleAddField(props.field.id)}
          />
        </XStack>
      </YStack>
    )
  },
)

const data = dataTest.success ? dataTest.data : undefined

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.MessageFormValues>
  onAddField: (x: S.FieldsArray[number]) => void
  onRemoveField: (x: S.FieldsArray[number]) => void
}

type RenderFieldRef = {
  getFields: () => S.FieldsArray
}

const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)

  const handleAddField = useCallback(
    (from: string) => (x: S.NodeType) => {
      const uuid = uniqueId()
      props.onAddField({ type: x, id: uuid })
      setFields((xs) => {
        const _appendTo = xs.findIndex((x) => x.id === from)
        const appendTo = _appendTo === -1 ? xs.length : _appendTo
        return [...xs.slice(0, appendTo + 1), { type: x, id: uuid }, ...xs.slice(appendTo + 1)]
      })
    },
    [],
  )

  const handleDeleteField = useCallback(
    ({ id, type }: S.FieldsArray[number]) =>
      () => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === id)
          if (fieldIndex === -1) return xs
          return [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
        })
        props.onRemoveField({ type, id })
      },
    [],
  )

  const handleMove = useCallback(
    (id: string, distance: number) => () => {
      setFields((xs) => {
        const fieldIndex = xs.findIndex((x) => x.id === id)
        if (fieldIndex === -1) return xs
        const field = xs[fieldIndex]
        const fieldRemoved = [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
        const fieldMoved = [...fieldRemoved.slice(0, fieldIndex + distance), field, ...fieldRemoved.slice(fieldIndex + distance)]
        return fieldMoved
      })
    },
    [],
  )

  useImperativeHandle(ref, () => {
    return { getFields: () => fields }
  }, [fields])

  const RenderItem = useCallback(
    ({ item }: ListRenderItemInfo<S.FieldsArray[number]>) => (
      <RenderFieldWithUI control={props.control} handleMove={handleMove} handleDeleteField={handleDeleteField} handleAddField={handleAddField} field={item} />
    ),
    [],
  )

  const keyExtractor = useCallback((props: S.FieldsArray[number]) => props.id, [])

  return <FlatList data={fields} renderItem={RenderItem} keyExtractor={keyExtractor} />
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

  const { control, handleSubmit, setValue, unregister } = useForm<S.MessageFormValues>({
    defaultValues: defaultData.states,
  })

  const renderFieldsRef = useRef<RenderFieldRef>(null)

  const handleAddField = useCallback((x: S.FieldsArray[number]) => {
    setValue(`${x.type}.${x.id}`, createNodeByType(x.type))
  }, [])

  const handleRemoveField = useCallback(
    (x: S.FieldsArray[number]) => () => {
      unregister(`${x.type}.${x.id}`)
    },
    [],
  )

  const onSubmit = handleSubmit((x) => console.log(x, zipMessage(x, renderFieldsRef.current!.getFields())))
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nouvel événement')}</title>
      </Head>

      <VoxButton onPress={onSubmit}>handle submit</VoxButton>

      <YStack flex={1} gap="$medium" padding="$medium">
        <RenderFields
          ref={renderFieldsRef}
          control={control}
          defaultStruct={defaultData.struct}
          onAddField={handleAddField}
          onRemoveField={handleRemoveField}
        />
      </YStack>
    </>
  )
}

export default MessageEditorPage
