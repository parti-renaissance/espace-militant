import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { useDebounceValue, YStack } from 'tamagui'
import Select from '@/components/base/Select/SelectV3'
import { GlobalSearchProps, SearchResult, SearchProvider } from './types'
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
  ...rest
}: Readonly<GlobalSearchProps>): JSX.Element {
  const [value, setValue] = useState<string>('default')
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const debouncedQuery = useDebounceValue(query, 500)

  // Recherche avec le provider unique
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    if (!provider.isSearchable(searchQuery)) {
      setResults([])
      return
    }

    setIsFetching(true)
    try {
      const searchResults = await provider.search(searchQuery)
      
      // Trier et limiter les résultats
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
  }, [provider])

  // Effectuer la recherche quand la query change
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

    setValue(id)
    const selectedResult = results.find(r => r.id === id)
    
    if (selectedResult) {
      // Récupérer les détails complets si nécessaire
      const details = await provider.getDetails(id)
      
      if (details) {
        // Il y avait des détails supplémentaires
        onSelect(details)
      } else {
        // Pas de détails, on utilise le résultat de search()
        onSelect(selectedResult)
      }
    }

    onBlur?.()
  }, [results, provider, onSelect, onReset, onBlur])

  // Icône du provider
  const getProviderIcon = useCallback(() => {
    return provider.getIcon()
  }, [provider])

  const options = useMemo(() => [
    ...results.map((result) => ({
      value: result.id,
      label: result.label,
      subLabel: result.subLabel,
    })),
    ...(defaultValue ? [{ value: 'default', label: defaultValue }] : []),
  ], [results, defaultValue])

  return (
    <YStack minWidth={minWidth} maxWidth={maxWidth}>
      <Select
        placeholder={placeholder || provider.getPlaceholder()}
        value={value}
        onChange={onResultSelect}
        icon={getProviderIcon()}
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