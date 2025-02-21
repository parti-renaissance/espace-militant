import React, { ComponentProps, forwardRef, useCallback } from 'react'
import { Platform, Pressable, TextInput, TextInputProps } from 'react-native'
import Input from '@/components/base/Input/Input'
import { useForwardRef } from '@/hooks/useForwardRef'
import { Filter, Search, XCircle } from '@tamagui/lucide-icons'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  onFocus?: TextInputProps['onFocus']
  DefaultIcon?: typeof Filter | typeof Search
} & Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'onFocus'>

const SearchBox = forwardRef<TextInput, SearchBoxProps>(({ label, value, onChange, onFocus, DefaultIcon = Search, ...rest }, ref) => {
  const searchInputRef = useForwardRef(ref)

  const IconRight = useCallback((props: { isInputFill: boolean }) => {
    return props.isInputFill ? (
      <Pressable onPress={() => onChange('')}>
        <XCircle color="$blue9" />
      </Pressable>
    ) : (
      <DefaultIcon />
    )
  }, [])

  return (
    <Input
      placeholder={Platform.OS === 'android' ? 'Rech...' : 'Rechercher'}
      label={label}
      size="sm"
      ref={searchInputRef}
      color="white"
      placeholderTextColor={'$textSecondary'}
      value={value}
      onFocus={onFocus}
      iconRight={<IconRight isInputFill={value.length > 0} />}
      onChangeText={onChange}
      {...rest}
    />
  )
})

export default SearchBox
