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
  helpText,
  ...rest
}: Readonly<GlobalSearchProps>): JSX.Element {
  const [value, setValue] = useState<string>(() => {
    if (typeof defaultValue === 'string') return defaultValue
    if (defaultValue && typeof defaultValue === 'object') return defaultValue.value || ''
    return ''
  })
  const [selectedLabel, setSelectedLabel] = useState<string>(() => {
    if (typeof defaultValue === 'string') return defaultValue
    if (defaultValue && typeof defaultValue === 'object') return defaultValue.label || ''
    return ''
  })
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isFetching, setIsFetching] = useState(false)
  
  // Handle defaultValue which can be {value, label}, label string, or undefined
  const defaultOption = useMemo(() => {
    if (!defaultValue) return null
    
    if (typeof defaultValue === 'string') {
      return { value: '', label: defaultValue }
    }
    
    // defaultValue is an object with {value, label}
    const defaultObj = defaultValue as { value?: string; label: string }
    return {
      value: defaultObj.value || '',
      label: defaultObj.label
    }
  }, [defaultValue])

  const debouncedQuery = useDebounceValue(query, 500)

  const shouldShowNoResults = results?.length === 0 && debouncedQuery.length > 2 && !isFetching && debouncedQuery === query
  const debouncedShowNoResults = useDebounceValue(shouldShowNoResults, 100)

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
    if (id === '') {
      setValue('')
      setSelectedLabel('')
      onReset?.()
      onBlur?.()
      return
    }

    if (id === '__null__') {
      setValue('__null__')
      setSelectedLabel('Remettre à zéro')
      onSelect(null)
      onBlur?.()
      return
    }

    setValue(id)
    const selectedResult = results.find(r => r.id === id)
    
    if (selectedResult) {
      setSelectedLabel(selectedResult.label)
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

  const options = useMemo(() => {
    const allOptions = [
      ...results.map((result) => ({
        value: result.id,
        label: result.label,
        subLabel: result.subLabel,
      })),
      ...(defaultOption ? [defaultOption] : []),
      // Always include the currently selected value if it's not already in results
      ...(value && value !== '' && value !== '__null__' && !results.find(r => r.id === value) && selectedLabel ? [{
        value: value,
        label: selectedLabel,
      }] : []),
      ...(nullable ? [{ value: '__null__', label: 'Remettre à zéro' }] : []),
    ]

    // Remove duplicates by keeping only the first occurrence of each value
    const uniqueOptions = allOptions.reduce((acc, option) => {
      const existingIndex = acc.findIndex(existing => existing.value === option.value)
      if (existingIndex !== -1) {
        // Skip duplicate - keep the first occurrence (search results have priority)
        return acc
      } else {
        // Add new option
        acc.push(option)
      }
      return acc
    }, [] as typeof allOptions)

    return uniqueOptions
  }, [results, defaultOption, nullable, value, selectedLabel])

  const searchPlaceholder = useMemo(() => 
    placeholder || provider.getPlaceholder(), 
    [placeholder, provider]
  )

  const valueMemo = useMemo(() => {
    if (value) {
      return value
    }
    if (nullable) {
      return value === '__null__' ? undefined : value
    }
    if (defaultValue && typeof defaultValue === 'object' && 'value' in defaultValue) {
      return defaultValue.value || undefined
    }
    return undefined
  }, [value, nullable, defaultValue])

  return (
    <YStack minWidth={minWidth} maxWidth={maxWidth}>
      <Select
        placeholder={searchPlaceholder}
        value={valueMemo}
        onChange={onResultSelect}
        icon={providerIcon}
        searchable
        searchableOptions={{
          autocompleteCallback: onInput,
          isFetching,
          icon: Search,
          noResults: debouncedShowNoResults ? 'Aucun résultat trouvé' : undefined,
        }}
        helpText={helpText}
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