import { isValidElement, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { type TextInput } from 'react-native'
import { SelectProps } from './types'

const reactTextNodeChildrenToString = (x: string | ReactNode | Element): string => {
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

const useSelectSearch = ({ options, searchableOptions }: Pick<SelectProps<string>, 'options' | 'searchableOptions'>) => {
  const [query, _setQuery] = useState('')
  const setQuery = useCallback(_setQuery, [])
  const queryInputRef = useRef<TextInput>(null)
  const items = useMemo(() => options.map((x) => ({ id: x.value, title: x.label, subtitle: x.subLabel })), [options])
  const filteredItems = useMemo(() => items.filter((x) => reactTextNodeChildrenToString(x.title).includes(query.toLowerCase())), [items, query])
  const searchableIcon = useMemo(() => (searchableOptions?.icon ? <searchableOptions.icon color="$textPrimary" /> : undefined), [searchableOptions])

  return {
    setQuery,
    queryInputRef,
    filteredItems,
    searchableIcon,
  }
}

export default useSelectSearch
