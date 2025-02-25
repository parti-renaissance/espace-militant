import { useContext } from 'react'
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

export const useThemeStyle = (node: S.Node) => {
  const theme = useContext(styleRendererContext)
  const nodeTheme = theme[node.type]
  if (!nodeTheme) return {}
  const containerStyle = nodeHasMarks(node) ? flatNodeStyle('container', node, nodeTheme) : (nodeTheme.global?.container ?? {})
  const baseStyle = nodeHasMarks(node) ? flatNodeStyle('base', node, nodeTheme) : (nodeTheme.global?.base ?? {})
  return { containerStyle, baseStyle }
}
