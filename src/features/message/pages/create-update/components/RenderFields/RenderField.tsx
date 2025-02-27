import React, { memo } from 'react'
import { ButtonRenderer } from '@/features/message/components/NodeRenderer/ButtonRenderer'
import { ImageRenderer } from '@/features/message/components/NodeRenderer/ImageRenderer'
import { RichTextRenderer } from '@/features/message/components/NodeRenderer/RichTextRenderer'
import { NodeSelectorWrapper } from '@/features/message/pages/create-update/components/NodeSelectorWrapper'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'

export const RenderField = memo((props: { field: S.FieldsArray[number]; control: Control<S.GlobalForm> }) => {
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
