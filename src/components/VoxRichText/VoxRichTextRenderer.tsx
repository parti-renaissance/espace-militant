import React from 'react'
import { 
  BoldBridge,
  CodeBridge,
  ItalicBridge,
  HistoryBridge,
  StrikeBridge,
  OrderedListBridge,
  HeadingBridge,
  ListItemBridge,
  BulletListBridge,
  BlockquoteBridge,
  UnderlineBridge,
  TaskListBridge,
  LinkBridge,
  ColorBridge,
  HighlightBridge,
  CoreBridge,
  PlaceholderBridge,
  HardBreakBridge,
  RichText,
  useEditorBridge 
} from '@10play/tentap-editor'
import { CUSTOM_FONT_VIEW } from './constants'

const editorExtensions = [
  BoldBridge,
  HistoryBridge,
  CodeBridge,
  ItalicBridge,
  StrikeBridge,
  UnderlineBridge,
  OrderedListBridge,
  HeadingBridge,
  BulletListBridge,
  BlockquoteBridge,
  TaskListBridge,
  LinkBridge,
  ColorBridge,
  HighlightBridge,
  ListItemBridge,
  HardBreakBridge,
]

const parseJsonEditorContent = (x: string) => {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

type VoxRichTextRendererProps = {
  value: string
  matchContent?: boolean
  primary?: boolean
  placeholder?: string
}

export const VoxRichTextRenderer: React.FC<VoxRichTextRendererProps> = ({ 
  value, 
  matchContent = false, 
  primary = false,
  placeholder = 'Décrivez votre contenu...'
}) => {
  const editor = useEditorBridge({
    editable: false,
    initialContent: parseJsonEditorContent(value),
    dynamicHeight: matchContent,
    bridgeExtensions: [
      ...editorExtensions,
      CoreBridge.configureCSS(CUSTOM_FONT_VIEW(primary)),
      PlaceholderBridge.configureExtension({
        placeholder,
      }),
    ],
  })

  return (
    <RichText
      style={{
        backgroundColor: 'transparent',
      }}
      editor={editor}
    />
  )
}

