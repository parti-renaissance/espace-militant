import React, { memo } from 'react'
import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import { ButtonRenderer } from '@/features/message/components/NodeRenderer/ButtonRenderer'
import { ImageRenderer } from '@/features/message/components/NodeRenderer/ImageRenderer'
import { RichTextRenderer } from '@/features/message/components/NodeRenderer/RichTextRenderer'
import { NodeSelectorWrapper } from '@/features/message/pages/create-update/components/NodeSelectorWrapper'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Image as ImageIcon, Text as TextIcon } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'
import { ButtonNodeEditor } from '../NodeEditor/ButtonNodeEditor'
import { ImageNodeEditor } from '../NodeEditor/ImageNodeEditor'
import { RichTextNodeEditor } from '../NodeEditor/RichTextNodeEditor'

const EmptyImageRenderer = () => {
  return (
    <FormFrame borderRadius={0} height={200}>
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$large">
        <XStack gap="$small">
          <ImageIcon size={16} color="$blue5" />
          <Text.MD color="$blue5">Aucune image</Text.MD>
        </XStack>
      </YStack>
    </FormFrame>
  )
}

const EmptyButtonRenderer = () => {
  return (
    <ButtonRenderer
      data={{
        type: 'button',
        marks: ['primary'],
        content: {
          link: 'http://parti-renaissance.fr',
          text: 'Bouton (vide)',
        },
      }}
    />
  )
}

const EmptyRichTextRender = () => {
  return (
    <FormFrame borderRadius={0} height={250} backgroundColor="white">
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$large">
        <XStack gap="$small">
          <TextIcon size={16} color="$blue5" />
          <Text.MD color="$blue5">Aucun text</Text.MD>
        </XStack>
      </YStack>
    </FormFrame>
  )
}

export const RenderField = memo((props: { field: S.FieldsArray[number]; control: Control<S.GlobalForm>; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  switch (props.field.type) {
    case 'image':
      return (
        <Controller
          control={props.control}
          name={`formValues.image.${props.field.id}`}
          render={({ field, fieldState }) => {
            return (
              <>
                <NodeSelectorWrapper control={props.control} field={props.field} edgePosition={props.edgePosition} error={fieldState.error?.message}>
                  {field.value.content ? <ImageRenderer data={field.value} /> : <EmptyImageRenderer />}
                </NodeSelectorWrapper>
                <Controller
                  control={props.control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <ImageNodeEditor
                        onBlur={() => onChange({ edit: false, field: props.field })}
                        onChange={field.onChange}
                        present={Boolean(value?.field.id === props.field.id) && value?.edit === true}
                        value={field.value}
                      />
                    )
                  }}
                  name="selectedField"
                />
              </>
            )
          }}
        />
      )
    case 'button':
      return (
        <Controller
          control={props.control}
          name={`formValues.button.${props.field.id}`}
          render={({ field, fieldState }) => (
            <>
              <NodeSelectorWrapper control={props.control} field={props.field} edgePosition={props.edgePosition} error={fieldState.error?.message}>
                {field.value.content ? <ButtonRenderer data={field.value} /> : <EmptyButtonRenderer />}
              </NodeSelectorWrapper>
              <Controller
                control={props.control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <ButtonNodeEditor
                      onBlur={() => onChange({ edit: false, field: props.field })}
                      present={value?.field.id === props.field.id && value.edit}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )
                }}
                name="selectedField"
              />
            </>
          )}
        />
      )
    case 'richtext':
      return (
        <Controller
          control={props.control}
          name={`formValues.richtext.${props.field.id}`}
          render={({ field, fieldState }) => (
            <>
              <NodeSelectorWrapper control={props.control} field={props.field} edgePosition={props.edgePosition} error={fieldState.error?.message}>
                {field.value.content && field.value.content.pure.length > 0 ? (
                  <RichTextRenderer id={props.field.id} data={field.value} />
                ) : (
                  <EmptyRichTextRender />
                )}
              </NodeSelectorWrapper>
              <Controller
                control={props.control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <RichTextNodeEditor
                      onBlur={() => onChange({ edit: false, field: props.field })}
                      present={value?.field.id === props.field.id && value.edit}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )
                }}
                name="selectedField"
              />
            </>
          )}
        />
      )
    default:
      return null
  }
})
