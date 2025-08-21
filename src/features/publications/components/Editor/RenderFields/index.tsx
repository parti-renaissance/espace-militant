import React, { forwardRef, RefObject, useCallback, useImperativeHandle, useRef, useState, useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { RenderFieldRef, EditorMethods } from '@/features/publications/components/Editor/types'
import { Control } from 'react-hook-form'
import { isWeb, YStack } from 'tamagui'
import { MetaDataForm } from './MetaDataForm'
import { RenderField } from './RenderField'
import { EditorInsertionToolbar } from '../EditorInsertionToolbar'
import { RestAvailableSendersResponse, RestGetMessageResponse, RestGetMessageFiltersResponse } from '@/services/publications/schema'

type RenderFieldsProps = {
  defaultStruct: S.FieldsArray
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  displayToolbar?: boolean
  availableSenders?: RestAvailableSendersResponse
  message?: RestGetMessageResponse
  onNodeChange?: () => void
  messageFilters?: RestGetMessageFiltersResponse
  messageId?: string
  scope: string
}

export const RenderFields = forwardRef<RenderFieldRef, RenderFieldsProps>(function RenderFields(props, ref) {
  const [fields, setFields] = useState<S.FieldsArray>(props.defaultStruct)
  const scrollRef = useRef<ScrollView>(null)
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
    const sender = props.message?.sender || (props.availableSenders && props.availableSenders.length > 0 ? props.availableSenders[0] : null)
    return sender?.theme?.primary || '#4291E1'
  }, [props.message?.sender, props.availableSenders])

  const { isWebPageLayoutScrollActive } = usePageLayoutScroll()

  const memoizedHeaderComponent = useMemo(() => (
    <MetaDataForm
      control={props.control}
      availableSenders={memoizedAvailableSenders}
      message={memoizedMessage}
      displayToolbar={props.displayToolbar}
      onMetaDataChange={props.onNodeChange}
      messageFilters={props.messageFilters}
      messageId={props.messageId}
      scope={props.scope}
    />
  ), [props.control, memoizedAvailableSenders, memoizedMessage, props.displayToolbar, props.onNodeChange, props.messageFilters, props.messageId, props.scope])

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
            control={props.control}
            editorMethods={props.editorMethods}
            field={undefined}
            display={true}
            showAddBar={true}
            onShowAddBar={() => { }}
            onCloseAddBar={undefined}
          />
        ) : (
          fields.map((field, index) => (
            <RenderField
              key={field.id}
              field={field}
              control={props.control}
              edgePosition={getFieldEdge(index)}
              editorMethods={props.editorMethods}
              displayToolbar={props.displayToolbar}
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
