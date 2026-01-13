import { Images } from '@/assets/editor-icons'
import { ToolbarItem } from '@10play/tentap-editor'
import { Platform } from 'react-native'
import { PublicSans } from './PublicSans'

export enum ToolbarContext {
  Main,
  Link,
  Heading,
}

export const getToolbarItems = (onVariablesPress?: () => void): ToolbarItem[] => {
  const baseItems: ToolbarItem[] = [
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

  if (onVariablesPress) {
    baseItems.push({
      onPress: () => onVariablesPress,
      active: () => false,
      disabled: () => false,
      image: () => Images.variables,
    })
  }

  return baseItems
}

export const TOOLBAR_ITEMS: ToolbarItem[] = getToolbarItems()

const customFontBase = (primary?: boolean) => `
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

export const CUSTOM_FONT_VIEW = (primary?: boolean) => customFontBase(primary) + `
#root div .ProseMirror {
  overflow: hidden;
  text-overflow: ellipsis;
}
#root div .ProseMirror p {
  text-overflow: ellipsis;
}
`

export const CUSTOM_FONT_EDIT = `
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
