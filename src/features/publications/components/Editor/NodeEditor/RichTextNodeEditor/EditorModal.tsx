import React from 'react'

import { RichTextContent, VoxRichTextModalEditor } from '@/components/VoxRichText'

type EditorModalProps = {
  value: RichTextContent
  onChange: (data: RichTextContent) => void
  onBlur: () => void
  present: boolean
  onClose: () => void
}

const EditorModal = ({ value, onChange, onBlur, present, onClose }: EditorModalProps) => {
  const handleChange = (data: RichTextContent) => {
    onChange(data)
    onBlur()
  }

  return (
    <VoxRichTextModalEditor
      open={present}
      value={value}
      onChange={handleChange}
      onClose={onClose}
      title={value.pure.length > 0 ? 'Modifier le texte' : 'Nouveau texte'}
      placeholder="Votre contenu..."
      maxWidth={520}
      enableVariables={true}
    />
  )
}

export default EditorModal
