import React, { forwardRef, useImperativeHandle, useState, useMemo, useCallback } from 'react'
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
import { getToolbarItems, CUSTOM_FONT_EDIT } from './constants'
import { VariablesModal } from './VariablesModal'
import { storageToEditor, editorToStorage } from './variableConverter'
import { useGetAvailableVariables } from '@/services/publications/hook'

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

const EMPTY_DOC = { type: 'doc', content: [] } as const

const parseJsonEditorContent = (x: string) => {
  try {
    return JSON.parse(x)
  } catch {
    return null
  }
}

/**
 * Minimal type for editor that supports injectJS
 * More robust than ReturnType<typeof useEditorBridge>
 */
type InjectJSEditor = {
  injectJS: (js: string) => void
}

/**
 * Helper function to insert text at cursor position using injectJS
 * Secured with multiple fallbacks for editor access
 */
function insertTextAtCursor(editor: InjectJSEditor, text: string): void {
  const escapedText = JSON.stringify(text)
  
  editor.injectJS(`
    (function() {
      try {
        // Find the ProseMirror editor element
        const editorElement = document.querySelector('.ProseMirror');
        let tiptapEditor = null;
        
        // Try multiple ways to access the TipTap editor instance
        if (editorElement && editorElement.__tiptapEditor) {
          tiptapEditor = editorElement.__tiptapEditor;
        } else if (window.__tiptapEditor) {
          tiptapEditor = window.__tiptapEditor;
        } else if (window.tiptapEditor) {
          tiptapEditor = window.tiptapEditor;
        } else if (editorElement && editorElement.editor) {
          tiptapEditor = editorElement.editor;
        } else if (window.editor) {
          tiptapEditor = window.editor;
        }
        
        if (tiptapEditor && tiptapEditor.view && tiptapEditor.state) {
          const { view, state } = tiptapEditor;
          const { selection } = state;
          
          // Insert text at the current selection position
          const tr = state.tr.insertText(${escapedText}, selection.from, selection.to);
          view.dispatch(tr);
          
          // Focus the editor after insertion
          view.focus();
        }
      } catch (error) {
        console.warn('Error inserting variable:', error);
      }
    })();
  `)
}

type VoxRichTextEditorProps = {
  value: RichTextContent
  placeholder?: string
  enableVariables?: boolean
}

export const VoxRichTextEditor = forwardRef<EditorRef, VoxRichTextEditorProps>(
  ({ value, placeholder = 'Décrivez votre contenu...', enableVariables = false }, ref) => {
    const [variablesModalOpen, setVariablesModalOpen] = useState(false)
    
    const { data: availableVariables = [] } = useGetAvailableVariables({
      enabled: enableVariables,
    })

    // Clean initial content: convert storage format to editor format
    // Initialize once at mount/change of value.json, no re-initialization to avoid overwriting user edits
    const cleanInitialContent = useMemo(() => {
      const parsed = parseJsonEditorContent(value.json)
      if (typeof parsed === 'object' && parsed !== null) {
        return storageToEditor(parsed) as object
      }
      // Fallback to empty doc if JSON is invalid or string
      return EMPTY_DOC
    }, [value.json])

    const editor = useEditorBridge({
      autofocus: false,
      avoidIosKeyboard: false,
      initialContent: cleanInitialContent,
      bridgeExtensions: [
        ...editorExtensions,
        CoreBridge.configureCSS(CUSTOM_FONT_EDIT),
        PlaceholderBridge.configureExtension({
          placeholder,
        }),
      ],
    })

    const handleVariablesPress = useCallback(() => {
      setVariablesModalOpen(true)
    }, [])

    const handleVariableSelect = (code: string) => {
      // code is already in format "{{Prénom}}" from VariablesModal
      insertTextAtCursor(editor, code)
      setVariablesModalOpen(false)
    }

    const toolbarItems = useMemo(
      () => getToolbarItems(enableVariables ? handleVariablesPress : undefined),
      [enableVariables, handleVariablesPress]
    )

    useImperativeHandle(ref, () => {
      return {
        getData: async () => {
          const rawJson = await editor.getJSON()
          
          // Convert editor format to storage format on export
          const finalJson = enableVariables
            ? (editorToStorage(rawJson, availableVariables) as object)
            : (rawJson as object)

          return {
            html: await editor.getHTML(),
            pure: await editor.getText(),
            json: finalJson,
          }
        },
        focus: () => {
          editor.focus?.()
        },
      }
    })

    return (
      <>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <YStack flex={1}>
            {isWeb ? (
              <XStack paddingVertical="$small" borderBottomColor="$textOutline" borderBottomWidth={1}>
                <Toolbar editor={editor} items={toolbarItems} />
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
                <Toolbar editor={editor} items={toolbarItems} />
              </YStack>
            )}
          </YStack>
        </KeyboardAvoidingView>
        {enableVariables && (
          <VariablesModal
            open={variablesModalOpen}
            onClose={() => setVariablesModalOpen(false)}
            onSelect={handleVariableSelect}
          />
        )}
      </>
    )
  }
)

VoxRichTextEditor.displayName = 'VoxRichTextEditor'
