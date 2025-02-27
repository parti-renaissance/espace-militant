import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import { RenderFieldRef } from '@/features/message/pages/create-update/types'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control } from 'react-hook-form'
import { isWeb } from 'tamagui'
import { RenderField } from './RenderField'

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.GlobalForm>
}

export const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
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
      addField: (newField, afterField) => {
        setFields((xs) => {
          if (!afterField) {
            return [...xs, newField]
          }
          const _appendTo = xs.findIndex((x) => x.id === afterField.id)
          const appendTo = _appendTo === -1 ? xs.length : _appendTo
          return [...xs.slice(0, appendTo + 1), newField, ...xs.slice(appendTo + 1)]
        })
      },

      removeField: ({ id }: S.FieldsArray[number]) => {
        setFields((xs) => {
          const fieldIndex = xs.findIndex((x) => x.id === id)
          if (fieldIndex === -1) return xs
          return [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
        })
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
