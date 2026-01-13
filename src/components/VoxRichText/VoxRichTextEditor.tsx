import React, { forwardRef, useImperativeHandle, useState, useEffect, useMemo, useCallback } from 'react'
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
import { convertStorageToEditor, convertEditorToStorage, removeVariableMarks } from './variableConverter'
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
  enableVariables?: boolean
}

export const VoxRichTextEditor = forwardRef<EditorRef, VoxRichTextEditorProps>(
  ({ value, placeholder = 'Décrivez votre contenu...', enableVariables = false }, ref) => {
    const [variablesModalOpen, setVariablesModalOpen] = useState(false)
    
    const { data: availableVariables = [] } = useGetAvailableVariables({
      enabled: enableVariables,
    })

    // Clean initial content to remove any variable marks that TipTap doesn't recognize
    const cleanInitialContent = useMemo(() => {
      const parsed = parseJsonEditorContent(value.json)
      if (typeof parsed === 'object' && parsed !== null) {
        return removeVariableMarks(parsed)
      }
      return parsed
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

    // Track if editor has been initialized to prevent overwriting user edits
    const hasInitializedRef = React.useRef<boolean>(false)
    const lastValueJsonRef = React.useRef<string>(value.json)

    // Reset initialization flag when value.json changes (e.g., modal reopened)
    useEffect(() => {
      if (lastValueJsonRef.current !== value.json) {
        hasInitializedRef.current = false
        lastValueJsonRef.current = value.json
      }
    }, [value.json])

    // Initialize editor content once with proper conversion
    // This prevents overwriting user edits during typing
    useEffect(() => {
      if (!value.json || hasInitializedRef.current) {
        return
      }

      // Only initialize if:
      // 1. We haven't initialized yet, AND
      // 2. Either variables are not needed, OR variables are loaded
      const shouldInitialize = 
        !enableVariables || 
        (enableVariables && availableVariables.length > 0)

      if (!shouldInitialize) {
        return
      }

      const initializeContent = async () => {
        try {
          const parsed = parseJsonEditorContent(value.json)
          
          // Valider que parsed est un objet avant de continuer
          if (typeof parsed !== 'object' || parsed === null) {
            console.warn('Invalid JSON content, using empty content')
            editor.setContent({ type: 'doc', content: [] })
            hasInitializedRef.current = true
            return
          }
          
          let contentToSet: Record<string, unknown>
          
          if (enableVariables && availableVariables.length > 0) {
            const converted = convertStorageToEditor(parsed, availableVariables)
            if (typeof converted === 'object' && converted !== null) {
              contentToSet = converted as Record<string, unknown>
            } else {
              // Fallback: remove variable marks if conversion fails
              contentToSet = removeVariableMarks(parsed) as Record<string, unknown>
            }
          } else {
            // Remove variable marks when variables are not enabled or not loaded
            contentToSet = removeVariableMarks(parsed) as Record<string, unknown>
          }
          
          editor.setContent(contentToSet)
          hasInitializedRef.current = true
        } catch (error) {
          console.warn('Error initializing editor content:', error)
        }
      }
      
      initializeContent()
    }, [value.json, enableVariables, availableVariables, editor])

    const handleVariablesPress = () => {
      setVariablesModalOpen(true)
    }

    const handleVariableSelect = (code: string) => {
      // Insert the variable token at cursor position using ProseMirror API
      // Escape the code string for JavaScript injection (handle quotes, backslashes, etc.)
      const escapedCode = JSON.stringify(code)
      
      // Use injectJS to insert text at cursor position via ProseMirror
      // TipTap/ProseMirror editor is typically accessible via the DOM element
      editor.injectJS(`
        (function() {
          try {
            // Find the ProseMirror editor element
            const editorElement = document.querySelector('.ProseMirror');
            if (editorElement && editorElement.__tiptapEditor) {
              const editor = editorElement.__tiptapEditor;
              const { view, state } = editor;
              const { selection } = state;
              
              // Insert text at the current selection position
              const tr = state.tr.insertText(${escapedCode}, selection.from, selection.to);
              view.dispatch(tr);
              
              // Focus the editor after insertion
              view.focus();
            } else if (editorElement) {
              // Fallback: try to access via window or other methods
              // Some TipTap setups expose editor differently
              const editor = window.editor || editorElement.editor;
              if (editor && editor.view && editor.state) {
                const { state, view } = editor;
                const { selection } = state;
                const tr = state.tr.insertText(${escapedCode}, selection.from, selection.to);
                view.dispatch(tr);
                view.focus();
              }
            }
          } catch (error) {
            console.warn('Error inserting variable:', error);
          }
        })();
      `)
      
      setVariablesModalOpen(false)
    }

    const toolbarItems = useMemo(
      () => getToolbarItems(enableVariables ? handleVariablesPress : undefined),
      [enableVariables]
    )

    useImperativeHandle(ref, () => {
      return {
        getData: async () => {
          const rawJson = await editor.getJSON()
          
          // Convert editor format to storage format on export
          let finalJson = rawJson
          if (enableVariables && availableVariables.length > 0) {
            try {
              finalJson = convertEditorToStorage(rawJson, availableVariables) as object
            } catch (error) {
              console.warn('Error converting variables on export:', error)
              finalJson = rawJson
            }
          }

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

