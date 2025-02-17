import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { Images } from '@/assets/editor-icons'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { CoreBridge, PlaceholderBridge, RichText, TenTapStartKit, Toolbar, ToolbarItem, useEditorBridge } from '@10play/tentap-editor'
import { Pen, Save } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { isWeb, XStack, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import { PublicSans } from './PublicSans'
import ModalOrPageBase from './ViewportModal'

export enum ToolbarContext {
  Main,
  Link,
  Heading,
}
const customFont = (primary?: boolean) => `
${PublicSans}
* {
    font-family: 'Public Sans', sans-serif;
    font-size: 12px;
    color: ${primary ? 'hsl(211,24%, 17%)' : 'hsl(208, 13%, 45%)'};
}

p, li {
  line-height: 20px;
  margin: 0;
}

ol, ul {
  padding-left: 24px;
}
`

const customFontEdit = `
${PublicSans}
* {
    font-family: 'Public Sans', sans-serif;
    font-size: 14px;
}

p, li {
  line-height: 22px;
  margin: 0;
}

ol, ul {
  padding-left: 28px;
}
`

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.undo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canUndo,
    image: () => Images.undo,
  },

  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBold(),
    active: ({ editorState }) => editorState.isBoldActive,
    disabled: ({ editorState }) => !editorState.canToggleBold,
    image: () => Images.bold,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleItalic(),
    active: ({ editorState }) => editorState.isItalicActive,
    disabled: ({ editorState }) => !editorState.canToggleItalic,
    image: () => Images.italic,
  },

  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleOrderedList(),
    active: ({ editorState }) => editorState.isOrderedListActive,
    disabled: ({ editorState }) => !editorState.canToggleOrderedList,
    image: () => Images.orderedList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => Images.bulletList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.redo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canRedo,
    image: () => Images.redo,
  },
]

const parseJsonEditorContent = (x: string) => {
  try {
    return JSON.parse(x)
  } catch (_) {
    return x
  }
}

export const MyRenderer = (props: { value: string; matchContent?: boolean; primary?: boolean }) => {
  const editor = useEditorBridge({
    editable: false,
    initialContent: parseJsonEditorContent(props.value),
    dynamicHeight: props.matchContent,
    bridgeExtensions: [
      // It is important to spread StarterKit BEFORE our extended plugin,
      // as plugin duplicated will be ignored
      ...TenTapStartKit,
      CoreBridge.configureCSS(
        customFont(props.primary) + ` #root div .ProseMirror {overflow: hidden; text-overflow: ellipsis;} #root div .ProseMirror p { text-overflow: ellipsis;}`,
      ), // Custom font
      PlaceholderBridge.configureExtension({
        placeholder: 'Décrivez votre événement...',
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

export default function (props: { onChange: () => void; onBlur: () => void; value: string; label: string; error?: string }) {
  const [open, setOpen] = useState(false)

  const handleOnClose = () => {
    setOpen(false)
    props.onBlur()
  }

  return (
    <>
      <SF.Props>
        <SF error={Boolean(props.error)} onPress={() => setOpen(true)} height="auto">
          <YStack flex={1} height={214} gap="$medium" paddingVertical="$medium" overflow="hidden">
            <XStack gap="$small">
              <XStack flexShrink={1} flex={1} {...props} alignItems="center" gap="$small">
                <SF.Label>{props.label}</SF.Label>
              </XStack>
              <XStack>
                <SF.Icon icon={Pen} />
              </XStack>
            </XStack>
            <YStack flexGrow={1} onPress={(e) => e.bubbles} cursor="pointer" borderRadius="$space.small">
              <MyRenderer key={props.value} value={props.value} primary />
            </YStack>
          </YStack>
          <YStack position="absolute" bottom={0} left={0} right={0} top={0} cursor="pointer" />
        </SF>
      </SF.Props>
      {props.error ? (
        <XStack paddingHorizontal="$medium" alignSelf="flex-start" pt="$xsmall">
          <Text.XSM textAlign="right" color="$orange5">
            {props.error}
          </Text.XSM>
        </XStack>
      ) : null}
      <ModalEditor {...props} onBlur={handleOnClose} open={open} />
    </>
  )
}

type EditorRef = {
  getJSON: () => Promise<object>
}

const MyEditor = forwardRef<EditorRef, { onChange: (x?: string) => void; onBlur: () => void; value: string; label: string }>((props, ref) => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: parseJsonEditorContent(props.value),
    bridgeExtensions: [
      // It is important to spread StarterKit BEFORE our extended plugin,
      // as plugin duplicated will be ignored
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFontEdit), // Custom font
      PlaceholderBridge.configureExtension({
        placeholder: 'Décrivez votre événement...',
      }),
    ],
  })

  useImperativeHandle(ref, () => {
    return {
      getJSON: editor.getJSON,
    }
  })

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <YStack flex={1}>
        {isWeb ? (
          <XStack paddingVertical="$small" borderBottomColor="$textOutline" borderBottomWidth={1}>
            <Toolbar editor={editor} items={TOOLBAR_ITEMS} />
          </XStack>
        ) : null}
        <YStack flex={1} padding="$medium">
          <RichText editor={editor} />
        </YStack>
        {isWeb ? null : (
          <YStack $platform-native={{ flex: 1 }}>
            <YStack height={46}>
              <Toolbar editor={editor} items={TOOLBAR_ITEMS} />
            </YStack>
          </YStack>
        )}
      </YStack>
    </KeyboardAvoidingView>
  )
})

function ModalEditor(props: { onChange: (x: string) => void; onBlur: () => void; value: string; label: string; open: boolean }) {
  const editorRef = useRef<EditorRef | null>(null)

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => editorRef.current?.getJSON() ?? Promise.resolve({}),
  })

  const handleOnChange = useDebouncedCallback(() => {
    mutateAsync().then((x) => {
      props.onChange(JSON.stringify(x))
      props.onBlur()
    })
  }, 200)

  return (
    <ModalOrPageBase
      open={props.open}
      onClose={props.onBlur}
      header={
        <VoxHeader>
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title>Description</VoxHeader.Title>
            </XStack>
            <XStack flex={1} justifyContent="flex-end">
              <VoxButton
                size="sm"
                iconLeft={Save}
                theme="blue"
                alignSelf="flex-end"
                variant="text"
                onPress={handleOnChange}
                loading={isPending}
                disabled={isPending}
              >
                Terminé
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader>
      }
    >
      {props.open ? <MyEditor ref={editorRef} {...props} /> : null}
    </ModalOrPageBase>
  )
}
