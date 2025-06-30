import React, { forwardRef, RefObject, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import useFlatListHeader from '@/features/message/components/Editor/hooks/useFlatListHeader'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { RenderFieldRef, EditorMethods } from '@/features/message/components/Editor/types'
import { Control } from 'react-hook-form'
import { isWeb, YStack } from 'tamagui'
import { MetaDataForm } from './MetaDataForm'
import { RenderField } from './RenderField'
import { AddFieldButton } from '../AddFieldButton'

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  displayToolbar?: boolean
}

export const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)
  const scrollRef = useRef<FlatList>(null)
  const insets = useSafeAreaInsets()
  const fieldLength = useRef(fields.length)

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

  const RenderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<S.FieldsArray[number]>) => (
      <RenderField
        control={props.control}
        field={item}
        edgePosition={getFieldEdge(index)}
        editorMethods={props.editorMethods}
        displayToolbar={props.displayToolbar ?? true}
      />
    ),
    [props.control, props.editorMethods, props.displayToolbar],
  )

  const keyExtractor = useCallback((props: S.FieldsArray[number]) => props.id, [])
  const reTryScrollOnFail = useCallback((info: { index: number }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500))
    wait.then(() => {
      scrollRef.current?.scrollToIndex({ index: info.index, animated: true })
    })
  }, [])

  const { scrollHandler, handleHeaderLayout, headerStyle, headerHeight } = useFlatListHeader()
  const { isWebPageLayoutScrollActive } = usePageLayoutScroll()

  return (
    <YStack flex={1} overflow="hidden">
      <Animated.View style={!isWebPageLayoutScrollActive ? headerStyle : undefined} onLayout={handleHeaderLayout}>
        <MetaDataForm control={props.control} />
      </Animated.View>
      {headerHeight > 0 ? (
        <Animated.FlatList
          style={renderFieldsStyle.flatlist}
          scrollEnabled={!isWebPageLayoutScrollActive}
          onScroll={scrollHandler}
          ref={scrollRef}
          contentContainerStyle={[!isWebPageLayoutScrollActive ? { paddingBottom: insets.bottom + 96, paddingTop: headerHeight } : undefined]}
          data={fields}
          onScrollToIndexFailed={reTryScrollOnFail}
          renderItem={RenderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <AddFieldButton
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
      ) : null}
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
