import { useCallback, useMemo, useRef, useState } from 'react'
import { type TextInput } from 'react-native'
import { SelectProps } from './types'
import { reactTextNodeChildrenToString } from './utils'

const useSelectSearch = ({ options, searchableOptions }: Pick<SelectProps<string>, 'options' | 'searchableOptions'>) => {
  const [query, _setQuery] = useState('')

  const isAutoComplete = Boolean(searchableOptions?.autocompleteCallback)
  const setQuery = useCallback((x: string) => {
    _setQuery(x)
    searchableOptions?.autocompleteCallback?.(x)
  }, [])
  const queryInputRef = useRef<TextInput>(null)
  const items = useMemo(() => options.map((x) => ({ id: x.value, title: x.label, subtitle: x.subLabel })), [options])
  const filteredItems = useMemo(
    () => (isAutoComplete ? items : items.filter((x) => reactTextNodeChildrenToString(x.title).includes(query.toLowerCase()))),
    [items, query, isAutoComplete],
  )
  const searchableIcon = useMemo(() => (searchableOptions?.icon ? <searchableOptions.icon color="$textPrimary" /> : undefined), [searchableOptions])

  return {
    setQuery,
    queryInputRef,
    filteredItems,
    searchableIcon,
  }
}

export default useSelectSearch
