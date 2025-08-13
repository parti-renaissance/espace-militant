import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { useDebounceValue, YStack } from 'tamagui'
import Select from '@/components/base/Select/SelectV3'
import { GlobalSearchProps, SearchResult } from './types'
import { Search } from '@tamagui/lucide-icons'

function GlobalSearch({
  provider,
  onSelect,
  defaultValue,
  placeholder,
  error,
  maxWidth,
  minWidth,
  onBlur,
  onReset,
  disabled,
  size = 'md',
  scope,
  nullable = false,
  ...rest
}: Readonly<GlobalSearchProps>): JSX.Element {
  const [value, setValue] = useState<string>('default')
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const debouncedQuery = useDebounceValue(query, 500)

  const performSearch = useCallback(async (searchQuery: string) => {

    if (searchQuery.length < 2 || !provider.isSearchable(searchQuery)) {
      return
    }

    setIsFetching(true)
    try {
      const searchResults = await provider.search(searchQuery, scope)
      
      const sortedResults = searchResults
        .sort((a, b) => a.label.localeCompare(b.label))
        .slice(0, 20)

      setResults(sortedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsFetching(false)
    }
  }, [provider, scope])

  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  const onInput = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const onResultSelect = useCallback(async (id: string) => {
    if (id === 'default') {
      onReset?.()
      onBlur?.()
      return
    }

    if (id === '__null__') {
      onSelect(null)
      onBlur?.()
      return
    }

    setValue(id)
    const selectedResult = results.find(r => r.id === id)
    
    if (selectedResult) {
      const details = await provider.getDetails(id)
      
      if (details) {
        onSelect(details)
      } else {
        onSelect(selectedResult)
      }
    }

    onBlur?.()
  }, [results, provider, onSelect, onReset, onBlur])

  const providerIcon = useMemo(() => provider.getIcon(), [provider])

  const options = useMemo(() => [
    ...results.map((result) => ({
      value: result.id,
      label: result.label,
      subLabel: result.subLabel,
    })),
    ...(defaultValue ? [{ value: 'default', label: defaultValue }] : []),
    ...(nullable ? [{ value: '__null__', label: 'Remettre à zéro' }] : []),
  ], [results, defaultValue, nullable])

  const searchPlaceholder = useMemo(() => 
    placeholder || provider.getPlaceholder(), 
    [placeholder, provider]
  )

  return (
    <YStack minWidth={minWidth} maxWidth={maxWidth}>
      <Select
        placeholder={searchPlaceholder}
        value={value}
        onChange={onResultSelect}
        icon={providerIcon}
        searchable
        searchableOptions={{
          autocompleteCallback: onInput,
          isFetching,
          icon: Search,
          noResults: 'Aucun résultat trouvé',
        }}
        disabled={disabled}
        size={size}
        {...rest}
        options={options}
        error={error}
      />
    </YStack>
  )
}

export default memo(GlobalSearch) 