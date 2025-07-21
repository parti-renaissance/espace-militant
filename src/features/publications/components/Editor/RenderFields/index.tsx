import React, { forwardRef, RefObject, useCallback, useImperativeHandle, useRef, useState, useMemo } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import useFlatListHeader from '@/features/publications/components/Editor/hooks/useFlatListHeader'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { RenderFieldRef, EditorMethods } from '@/features/publications/components/Editor/types'
import { Control } from 'react-hook-form'
import { isWeb, YStack } from 'tamagui'
import { MetaDataForm } from './MetaDataForm'
import { RenderField } from './RenderField'
import { EditorInsertionToolbar } from '../EditorInsertionToolbar'
import { RestAvailableSendersResponse, RestGetMessageResponse } from '@/services/publications/schema'

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  displayToolbar?: boolean
  availableSenders?: RestAvailableSendersResponse
  message?: RestGetMessageResponse
  onNodeChange?: () => void
}

export const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)
  const scrollRef = useRef<FlatList>(null)
  const insets = useSafeAreaInsets()
  const fieldLength = useRef(fields.length)
  const memoizedAvailableSenders = useMemo(() => props.availableSenders, [props.availableSenders])
  const memoizedMessage = useMemo(() => props.message, [props.message])

  const getFieldEdge = useCallback((index: number) => {
    if (index === 0 && fieldLength.current === 1) {
      return 'alone'
    } else if (index === 0) {
      return 'leading'
    } else if (index === fieldLength.current - 1) {
      return 'trailing'
    }
    return undefined
  }, [])

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
            viewOffset: insets.top,
            animated: true,
          })
        }
      },
      addField: (newField, afterField, atStart) => {
        setFields((xs) => {
          if (atStart) {
            const newFields = [newField, ...xs]
            fieldLength.current = newFields.length
            return newFields
          }
          if (!afterField) {
            const newFields = [...xs, newField]
            fieldLength.current = newFields.length
            return newFields
          }
          const _appendTo = xs.findIndex((x) => x.id === afterField.id)
          const appendTo = _appendTo === -1 ? xs.length : _appendTo
          const newFields = [...xs.slice(0, appendTo + 1), newField, ...xs.slice(appendTo + 1)]
          fieldLength.current = newFields.length
          return newFields
        })
      },

      removeField: ({ id }: S.FieldsArray[number]) => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === id)
          if (fieldIndex === -1) return xs
          const newFields = [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
          fieldLength.current = newFields.length
          return newFields
        })
      },

      moveField: (field, distance) => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === field.id)
          const clamp = (x: number) => Math.min(Math.max(x, 0), xs.length)
          if (fieldIndex === -1) return xs
          const mesureDistance = clamp(fieldIndex + distance)
          const fieldRemoved = [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
          const fieldMoved = [...fieldRemoved.slice(0, mesureDistance), field, ...fieldRemoved.slice(mesureDistance)]
          return fieldMoved
        })
      },
    }
  }, [fields])

  const senderThemeColor = useMemo(() => {
    const sender = props.message?.sender || (props.availableSenders && props.availableSenders.length > 0 ? props.availableSenders[0] : null)
    return sender?.theme?.primary || '#4291E1'
  }, [props.message?.sender, props.availableSenders])

  const RenderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<S.FieldsArray[number]>) => (
      <RenderField
        field={item}
        control={props.control}
        edgePosition={getFieldEdge(index)}
        editorMethods={props.editorMethods}
        displayToolbar={props.displayToolbar}
        senderThemeColor={senderThemeColor}
        onNodeChange={props.onNodeChange}
      />
    ),
    [props.control, props.editorMethods, props.displayToolbar, senderThemeColor, props.onNodeChange],
  )

  const keyExtractor = useCallback((props: S.FieldsArray[number]) => props.id, [])
  const reTryScrollOnFail = useCallback((info: { index: number }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500))
    wait.then(() => {
      scrollRef.current?.scrollToIndex({ index: info.index, animated: true })
    })
  }, [])

  const memoizedHeaderComponent = useMemo(() => (
    <MetaDataForm 
      control={props.control} 
      availableSenders={memoizedAvailableSenders} 
      message={memoizedMessage} 
      displayToolbar={props.displayToolbar}
      onMetaDataChange={props.onNodeChange}
    />
  ), [props.control, memoizedAvailableSenders, memoizedMessage, props.displayToolbar, props.onNodeChange])

  const { scrollHandler } = useFlatListHeader()
  const { isWebPageLayoutScrollActive } = usePageLayoutScroll()

  return (
    <YStack flex={1} overflow="hidden">
      <Animated.FlatList
          style={renderFieldsStyle.flatlist}
          scrollEnabled={!isWebPageLayoutScrollActive}
          onScroll={scrollHandler}
          ref={scrollRef}
          contentContainerStyle={[!isWebPageLayoutScrollActive ? { paddingBottom: insets.bottom + 96 } : undefined]}
          data={fields}
          onScrollToIndexFailed={reTryScrollOnFail}
          renderItem={RenderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={memoizedHeaderComponent}
          ListEmptyComponent={
            <EditorInsertionToolbar
              control={props.control}
              editorMethods={props.editorMethods}
              field={undefined}
              display={true}
              showAddBar={true}
              onShowAddBar={() => { }}
              onCloseAddBar={undefined}
            />
          }
        />
    </YStack>
  )
})

const renderFieldsStyle = StyleSheet.create({
  flatlist: {
    flex: 1,
    backgroundColor: 'hsl(240, 9%, 98%)',
    paddingTop: 12,
    paddingBottom: 12,
  },
})
