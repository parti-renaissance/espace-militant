import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
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

enum ToolbarContext {
  Main,
  Link,
  Heading,
}

const customFont = (primary?: boolean) => `
${PublicSans}
* {
    font-family: 'Public Sans', sans-serif;
    color: ${primary ? 'hsl(211,24%, 17%)' : 'hsl(208, 13%, 45%)'};
}

p, li {
  font-size: 12px;
  line-height: 20px;
  margin: 0;
}

ol, ul {
  padding-left: 24px;
}

a {
  color: #4b85be !important;
  text-decoration: underline;
}

h1, h1 * {
  font-size: 20px !important;
  font-weight: 600;
  margin: 0;
}

h1 strong, h1 b, h2 strong, h2 b, h3 strong, h3 b, h4 strong, h4 b, h5 strong, h5 b, h6 strong, h6 b {
  font-weight: bolder !important;
}

h2, h2 * {
  font-size: 18px !important;
  font-weight: 600;
  margin: 0;
}

h3, h3 * {
  font-size: 17px !important;
  font-weight: 600;
  margin: 0;
}

h4, h4 * {
  font-size: 16px !important;
  font-weight: 600;
  margin: 0;
}

h5, h5 * {
  font-size: 15px !important;
  font-weight: 600;
  margin: 0;
}

h6, h6 * {
  font-size: 14px !important;
  font-weight: 600;
  margin: 0;
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

a {
  color: #4b85be !important;
  text-decoration: underline;
}

h1 strong, h1 b, h2 strong, h2 b, h3 strong, h3 b, h4 strong, h4 b, h5 strong, h5 b, h6 strong, h6 b {
  font-weight: bolder !important;
}

h1, h1 * {
  font-size: 20px !important;
  font-weight: 600;
  margin: 0;
}

h2, h2 * {
  font-size: 18px !important;
  font-weight: 600;
  margin: 0;
}

h3, h3 * {
  font-size: 17px !important;
  font-weight: 600;
  margin: 0;
}

h4, h4 * {
  font-size: 16px !important;
  font-weight: 600;
  margin: 0;
}

h5, h5 * {
  font-size: 15px !important;
  font-weight: 600;
  margin: 0;
}

h6, h6 * {
  font-size: 14px !important;
  font-weight: 600;
  margin: 0;
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
          editor.redo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canRedo,
    image: () => Images.redo,
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
          editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => Images.bulletList,
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
      ({ setToolbarContext, editorState, editor }) =>
        () => {
          if (Platform.OS === 'android') {
            setTimeout(() => {
              editor.setSelection(
                editorState.selection.from,
                editorState.selection.to
              )
            })
          }
          setToolbarContext(ToolbarContext.Link)
        },
    active: ({ editorState }) => editorState.isLinkActive,
    disabled: ({ editorState }) => !editorState.isLinkActive && !editorState.canSetLink,
    image: () => Images.link,
  },
]

const parseJsonEditorContent = (x: string) => {
  try {
    return JSON.parse(x)
  } catch (e) {
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

export default function (props: { onChange: (x: Payloads) => void; onBlur: () => void; value: Payloads; label: string; error?: string }) {
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
              <MyRenderer key={props.value.json} value={props.value.json} primary />
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

export type Payloads = {
  html: string
  pure: string
  json: string
}

type Payloads2 = {
  pure: string
  json: object
}

export type EditorRef = {
  getData: () => Promise<{
    html: string
    pure: string
    json: object
  }>
}

export const MyEditor2 = forwardRef<EditorRef, { onChange?: () => void; value: Payloads2 }>((props, ref) => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: props.value.json,
    onChange: props.onChange,
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
      getData: async () => ({
        html: await editor.getHTML(),
        pure: await editor.getText(),
        json: await editor.getJSON(),
      }),
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
})

export const MyEditor = forwardRef<EditorRef, { onChange: (x: Payloads) => void; onBlur: () => void; value: Payloads; label: string; placeholder?: string }>(
  (props, ref) => {
    const editor = useEditorBridge({
      autofocus: true,
      avoidIosKeyboard: false,
      initialContent: parseJsonEditorContent(props.value.json),
      bridgeExtensions: [
        // It is important to spread StarterKit BEFORE our extended plugin,
        // as plugin duplicated will be ignored
        ...TenTapStartKit,
        CoreBridge.configureCSS(customFontEdit), // Custom font
        PlaceholderBridge.configureExtension({
          placeholder: props.placeholder ?? 'Décrivez votre événement...',
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
  },
)

function ModalEditor(props: { onChange: (x: Payloads) => void; onBlur: () => void; value: Payloads; label: string; open: boolean }) {
  const editorRef = useRef<EditorRef | null>(null)

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => editorRef.current!.getData(),
  })

  const handleOnChange = useDebouncedCallback(() => {
    mutateAsync().then((x) => {
      props.onChange({
        ...x,
        json: JSON.stringify(x.json),
      })
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
