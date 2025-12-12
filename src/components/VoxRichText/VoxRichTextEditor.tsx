import React, { forwardRef, useImperativeHandle } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
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
  Toolbar,
  useEditorBridge 
} from '@10play/tentap-editor'
import { isWeb, YStack, XStack } from 'tamagui'
import Text from '@/components/base/Text'
import { RichTextContent, EditorRef } from './types'
import { TOOLBAR_ITEMS, CUSTOM_FONT_EDIT } from './constants'

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
  } catch {
    return x
  }
}

type VoxRichTextEditorProps = {
  value: RichTextContent
  placeholder?: string
}

export const VoxRichTextEditor = forwardRef<EditorRef, VoxRichTextEditorProps>(
  ({ value, placeholder = 'Décrivez votre contenu...' }, ref) => {
    const editor = useEditorBridge({
      autofocus: false,
      avoidIosKeyboard: false,
      initialContent: parseJsonEditorContent(value.json),
      bridgeExtensions: [
        ...editorExtensions,
        CoreBridge.configureCSS(CUSTOM_FONT_EDIT),
        PlaceholderBridge.configureExtension({
          placeholder,
        }),
      ],
    })

    useImperativeHandle(ref, () => {
      return {
        getData: async () => ({
          html: await editor.getHTML(),
          pure: await editor.getText(),
          json: await editor.getJSON(),
        }),
        focus: () => {
          editor.focus?.()
        },
      }
    })

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <YStack flex={1}>
          {isWeb ? (
            <XStack paddingVertical="$small" borderBottomColor="$textOutline" borderBottomWidth={1}>
              <Toolbar editor={editor} items={TOOLBAR_ITEMS} />
            </XStack>
          ) : null}
          {Platform.OS === 'android' ? (
            <YStack padding="$medium" bg="$textSurface">
              <Text.SM semibold>Un bug peut affecter la sélection de texte sur Android empêchant le déplacement du curseur. </Text.SM>
              <Text.SM>Nous travaillons à la correction de ce problème. En attendant, si vous l'avez, vous pouvez reprendre l'écriture de votre publication sur navigateur.</Text.SM>
            </YStack>
          ) : null}
          <YStack flex={1} padding="$medium">
            <RichText editor={editor} />
          </YStack>
          {isWeb ? null : (
            <YStack height={46}>
              <Toolbar editor={editor} items={TOOLBAR_ITEMS} />
            </YStack>
          )}
        </YStack>
      </KeyboardAvoidingView>
    )
  }
)

VoxRichTextEditor.displayName = 'VoxRichTextEditor'

