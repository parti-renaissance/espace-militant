import { useContext } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { styleRendererContext } from '../context/styleRenderContext'
import * as S from '../schemas/messageBuilderSchema'

export const nodeHasMarks = <T extends S.Node>(node: T): node is T & { marks: S.HasMarks<T>[] } => {
  return 'marks' in node && Array.isArray(node.marks)
}

const flatNodeStyle = <T extends S.NodeType, M extends 'container' | 'base'>(mode: M, node: Extract<S.Node, { type: T }>, styles: S.NodeStyle<T>) => {
  return nodeHasMarks(node)
    ? node.marks.reduce<NonNullable<S.NodeStyle<T>['global']>[M]>((acc, mark) => {
        const markStyle = styles[mark]?.[mode]
        if (markStyle) acc = { ...acc, ...markStyle }
        return acc
      }, styles.global?.[mode] ?? {})
    : styles.global?.[mode]
}

export function useThemeStyle(): ViewStyle
export function useThemeStyle(
  node: S.Node,
  edgePosition?: 'leading' | 'trailing' | 'alone',
): { containerStyle: ViewStyle; baseStyle: ViewStyle | TextStyle; wrapperStyle: ViewStyle }
export function useThemeStyle(node?: S.Node, edgePosition?: 'leading' | 'trailing' | 'alone') {
  const theme = useContext(styleRendererContext)
  if (!node) return theme.global.container
  const wrapperStyle = [theme.global.item?.wrapper, theme.global.item?.[edgePosition ?? 'middle']].reduce((acc, style) => {
    if (style) acc = { ...acc, ...style }
    return acc
  }, {} as ViewStyle)
  const nodeTheme = theme[node.type]
  if (!nodeTheme) return { container: {}, base: {}, wrapperStyle } as const
  const containerStyle = nodeHasMarks(node) ? flatNodeStyle('container', node, nodeTheme) : (nodeTheme.global?.container ?? {})
  const baseStyle = nodeHasMarks(node) ? flatNodeStyle('base', node, nodeTheme) : (nodeTheme.global?.base ?? {})
  return { containerStyle, baseStyle, wrapperStyle }
}
