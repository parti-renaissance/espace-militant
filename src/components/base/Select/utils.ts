import { isValidElement, ReactNode } from 'react'

export const reactTextNodeChildrenToString = (x: string | ReactNode | Element): string => {
  if (typeof x === 'string') return x
  if (isValidElement(x)) {
    const children = x.props.children
    if (Array.isArray(children)) {
      return children.map(reactTextNodeChildrenToString).join()
    }
    return children
  }

  if (Array.isArray(x)) {
    return x.map(reactTextNodeChildrenToString).join()
  }

  return ''
}
