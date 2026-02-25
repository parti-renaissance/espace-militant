import React, { forwardRef, RefObject, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb, YStack } from 'tamagui'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { EditorMethods, RenderFieldRef } from '@/features_next/publications/components/Editor/types'

import { useEditorStore } from '@/features_next/publications/components/Editor/store/editorStore'

import { EditorInsertionToolbar } from '../EditorInsertionToolbar'
import { MetaDataForm } from './MetaDataForm'
import { RenderField } from './RenderField'

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  editorMethods: RefObject<EditorMethods>
  onNodeChange?: () => void
}

export const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)
  const scrollRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const fieldLength = useRef(fields.length)
  const displayToolbar = useEditorStore((s) => s.displayToolbar)
  const availableSenders = useEditorStore((s) => s.availableSenders)
  const message = useEditorStore((s) => s.message)

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
          // For ScrollView, we need to calculate approximate position
          // This is a simplified approach - you might need to adjust based on your actual field heights
          const estimatedFieldHeight = 150 // Adjust this value based on your actual field heights
          const scrollToY = index * estimatedFieldHeight
          scrollRef.current?.scrollTo({
            y: scrollToY,
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
          fieldLength.current = fieldMoved.length
          return fieldMoved
        })
      },
    }
  }, [fields])

  const senderThemeColor = useMemo(() => {
    const sender = message?.sender || (availableSenders && availableSenders.length > 0 ? availableSenders[0] : null)
    return sender?.theme?.primary || '#4291E1'
  }, [message?.sender, availableSenders])

  const { isWebPageLayoutScrollActive } = usePageLayoutScroll()

  const memoizedHeaderComponent = useMemo(
    () => <MetaDataForm onMetaDataChange={props.onNodeChange} />,
    [props.onNodeChange],
  )

  return (
    <YStack flex={1} overflow="hidden">
      <ScrollView
        style={renderFieldsStyle.scrollview}
        scrollEnabled={!isWebPageLayoutScrollActive}
        ref={scrollRef}
        contentContainerStyle={[!isWebPageLayoutScrollActive ? { paddingBottom: insets.bottom + 96 } : undefined]}
        showsVerticalScrollIndicator={false}
      >
        {memoizedHeaderComponent}
        {fields.length === 0 ? (
          <EditorInsertionToolbar
            editorMethods={props.editorMethods}
            field={undefined}
            display={true}
            showAddBar={true}
            onShowAddBar={() => {}}
            onCloseAddBar={undefined}
          />
        ) : (
          fields.map((field, index) => (
            <RenderField
              key={field.id}
              field={field}
              edgePosition={getFieldEdge(index)}
              editorMethods={props.editorMethods}
              senderThemeColor={senderThemeColor}
              onNodeChange={props.onNodeChange}
            />
          ))
        )}
      </ScrollView>
    </YStack>
  )
})

const renderFieldsStyle = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: 'hsl(240, 9%, 98%)',
    paddingBottom: 12,
    overflow: 'visible',
  },
})
