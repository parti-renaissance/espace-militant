import { useContext } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { styleRendererContext } from '../context/styleRenderContext'

export const nodeHasMarks = <T extends S.Node>(node: T): node is T & { marks: S.HasMarks<T>[] } => {
  return 'marks' in node && Array.isArray(node.marks)
}

const flatNodeStyle = <T extends S.NodeType, M extends 'container' | 'base' | 'wrapper'>(
  mode: M,
  node: Extract<S.Node, { type: T }>,
  styles: S.NodeStyle<T>,
) => {
  return nodeHasMarks(node)
    ? node.marks.reduce<NonNullable<S.NodeStyle<T>['global']>[M]>((acc, mark) => {
        const markStyle = styles[mark]?.[mode]
        if (markStyle) acc = { ...acc, ...markStyle }
        return acc
      }, styles.global?.[mode] ?? {})
    : styles.global?.[mode]
}

export function getThemeStyle(theme: S.MessageStyle): { containerStyle: ViewStyle; wrapperStyle: ViewStyle }
export function getThemeStyle(
  theme: S.MessageStyle,
  node: S.Node,
  edgePosition?: 'leading' | 'trailing' | 'alone',
): { containerStyle: ViewStyle; baseStyle: ViewStyle | TextStyle; wrapperStyle: ViewStyle }
export function getThemeStyle(theme: S.MessageStyle, _node?: S.Node, edgePosition?: 'leading' | 'trailing' | 'alone') {
  if (!_node)
    return {
      containerStyle: theme.global?.container,
      wrapperStyle: theme.global?.wrapper,
    }
  const node = { ..._node, marks: [...(_node.marks ?? []), edgePosition ?? 'middle'] } as S.Node
  const wrapperStyle = [theme.global.item?.wrapper, theme.global.item?.[edgePosition ?? 'middle']].reduce((acc, style) => {
    if (style) acc = { ...acc, ...style }
    return acc
  }, {} as ViewStyle)
  const nodeTheme = theme[node.type]
  if (!nodeTheme) return { containerStyle: {}, baseStyle: {}, wrapperStyle } as const
  const containerStyle = nodeHasMarks(node) ? flatNodeStyle('container', node, nodeTheme) : (nodeTheme.global?.container ?? {})
  const baseStyle = nodeHasMarks(node) ? flatNodeStyle('base', node, nodeTheme) : (nodeTheme.global?.base ?? {})
  const nodeWrapperStyle = { ...wrapperStyle, ...(nodeHasMarks(node) ? flatNodeStyle('wrapper', node, nodeTheme) : (nodeTheme.global?.wrapper ?? {})) }
  if (node.type === 'button' && node.content?.color) {
    const customColor = node.content.color
    const defaultColor = '#4291E1'
    
    if ((containerStyle as ViewStyle)?.backgroundColor === defaultColor) {
      (containerStyle as ViewStyle).backgroundColor = customColor
    }
    if ((containerStyle as ViewStyle)?.borderColor === defaultColor) {
      (containerStyle as ViewStyle).borderColor = customColor
    }
    if ((baseStyle as TextStyle)?.color === defaultColor) {
      (baseStyle as TextStyle).color = customColor
    }
  }
  
  return { containerStyle, baseStyle, wrapperStyle: nodeWrapperStyle }
}

export function useThemeStyle(): { containerStyle: ViewStyle; wrapperStyle: ViewStyle }
export function useThemeStyle(
  node: S.Node,
  edgePosition?: 'leading' | 'trailing' | 'alone',
): { containerStyle: ViewStyle; baseStyle: ViewStyle | TextStyle; wrapperStyle: ViewStyle }
export function useThemeStyle(node?: S.Node, edgePosition?: 'leading' | 'trailing' | 'alone') {
  const theme = useContext(styleRendererContext)
  return node ? getThemeStyle(theme, node, edgePosition) : getThemeStyle(theme)
}
