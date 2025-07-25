import React, { memo, RefObject } from 'react'
import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import { ButtonRenderer } from '@/features/publications/components/Editor/NodeRenderer/ButtonRenderer'
import { ImageRenderer } from '@/features/publications/components/Editor/NodeRenderer/ImageRenderer'
import { RichTextRenderer } from '@/features/publications/components/Editor/NodeRenderer/RichTextRenderer'
import { NodeSelectorWrapper } from '@/features/publications/components/Editor/NodeSelectorWrapper'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { EditorMethods } from '@/features/publications/components/Editor/types'
import { Image as ImageIcon } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'
import { ButtonNodeEditor } from '../NodeEditor/ButtonNodeEditor'
import { ImageNodeEditor } from '../NodeEditor/ImageNodeEditor'
import { RichTextNodeEditor } from '../NodeEditor/RichTextNodeEditor'

const EmptyImageRenderer = (props: { data: S.ImageNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  return (
    <FormFrame borderRadius={0} height={200} style={wrapperStyle}>
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$large">
        <XStack gap="$small">
          <ImageIcon size={16} color="$blue5" />
          <Text.MD color="$blue5">Ajouter une image</Text.MD>
        </XStack>
      </YStack>
    </FormFrame>
  )
}

const EmptyButtonRenderer = (props: { edgePosition?: 'leading' | 'trailing' | 'alone', color?: string }) => {
  return (
    <ButtonRenderer
      edgePosition={props.edgePosition}
      data={{
        type: 'button',
        marks: ['primary'],
        content: {
          link: 'http://parti-renaissance.fr',
          text: 'Bouton (vide)',
          color: props.color || '#4291E1',
        },
      }}
    />
  )
}

const EmptyRichTextRender = (props: { data: S.RichTextNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  return (
    <FormFrame borderRadius={0} height={120} backgroundColor="white" style={wrapperStyle}>
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$large">
      <Text.MD secondary lineHeight={22}>Ajoutez ici le contenu que vous souhaitez partager avec vos destinataires</Text.MD>
      </YStack>
    </FormFrame>
  )
}

export const RenderField = memo((props: { 
  field: S.FieldsArray[number]; 
  control: Control<S.GlobalForm>; 
  edgePosition?: 'leading' | 'trailing' | 'alone';
  editorMethods: RefObject<EditorMethods>;
  displayToolbar?: boolean;
  senderThemeColor?: string;
  onNodeChange?: (fieldId: string, nodeType: string, newValue: S.Node) => void;
}) => {
  switch (props.field.type) {
    case 'image':
      return (
        <Controller
          control={props.control}
          name={`formValues.image.${props.field.id}`}
          render={({ field, fieldState }) => {
            return (
              <>
                <NodeSelectorWrapper 
                  control={props.control} 
                  field={props.field} 
                  edgePosition={props.edgePosition} 
                  error={fieldState.error?.message}
                  editorMethods={props.editorMethods}
                  displayToolbar={props.displayToolbar ?? true}
                >
                  {field?.value?.content ? <ImageRenderer data={field.value} edgePosition={props.edgePosition} displayToolbar={props.displayToolbar} /> : <EmptyImageRenderer data={field.value} />}
                </NodeSelectorWrapper>
                <Controller 
                  control={props.control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <ImageNodeEditor
                        onBlur={() => onChange(null)}
                        onChange={(newValue) => {
                          field.onChange(newValue)
                          props.onNodeChange?.(props.field.id, props.field.type, newValue)
                        }}
                        present={value?.field?.id === props.field.id && value?.edit === true}
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
              <NodeSelectorWrapper 
                control={props.control} 
                field={props.field} 
                edgePosition={props.edgePosition} 
                error={fieldState.error?.message}
                editorMethods={props.editorMethods}
                displayToolbar={props.displayToolbar ?? true}
              >
                {field.value.content ? (
                  <ButtonRenderer data={field.value} edgePosition={props.edgePosition} displayToolbar={props.displayToolbar} />
                ) : (
                  <EmptyButtonRenderer edgePosition={props.edgePosition} color={props.senderThemeColor} />
                )}
              </NodeSelectorWrapper>
              <Controller
                control={props.control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <ButtonNodeEditor
                      onBlur={() => onChange(null)}
                      present={value?.field?.id === props.field.id && value.edit}
                      onChange={(newValue) => {
                         // TODO: sauvegarder le contenu avec editorRef.current?.debouncedSave()
                        field.onChange(newValue)
                        props.onNodeChange?.(props.field.id, props.field.type, newValue)
                      }}
                      value={field.value}
                      senderThemeColor={props.senderThemeColor}
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
              <NodeSelectorWrapper 
                control={props.control} 
                field={props.field} 
                edgePosition={props.edgePosition} 
                error={fieldState.error?.message}
                editorMethods={props.editorMethods}
                displayToolbar={props.displayToolbar ?? true}
              >
                {field.value.content && field.value.content.pure.length > 0 ? (
                  <RichTextRenderer id={props.field.id} data={field.value} edgePosition={props.edgePosition} displayToolbar={props.displayToolbar} />
                ) : (
                  <EmptyRichTextRender data={field.value} edgePosition={props.edgePosition} />
                )}
              </NodeSelectorWrapper>
              <Controller
                control={props.control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <RichTextNodeEditor
                      onBlur={() => onChange(null)}
                      present={value?.field?.id === props.field.id && value.edit}
                      onChange={(newValue) => {
                         // TODO: sauvegarder le contenu avec editorRef.current?.debouncedSave()
                        field.onChange(newValue)
                        props.onNodeChange?.(props.field.id, props.field.type, newValue)
                      }}
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
