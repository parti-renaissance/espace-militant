import React from 'react'
import { XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import DatePickerField from '@/components/DatePickerV2'
import { FormFrame } from '@/components/base/FormFrames'

interface DateInputProps {
  label: string
  value?: string | Date | null
  onChange: (value: string | null) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'gray' | 'blue' | 'green' | 'red'
  disabled?: boolean
  error?: string
}

export default function DateInput({
  label,
  value,
  onChange,
  placeholder = "Sélectionner une date",
  size = 'sm',
  color = 'gray',
  disabled = false,
  error
}: DateInputProps) {
  
  // Convertir la value en Date pour le DatePickerField
  const getDateValue = (): Date | undefined => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (typeof value === 'string') {
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    }
    return undefined
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      onChange(date.toISOString())
    } else {
      onChange(null)
    }
  }

  return (
    <FormFrame 
      height="auto" 
      flexDirection="row"
      pl="$medium" 
      pr="$medium"
      pt="$xsmall" 
      pb="$xsmall"
      overflow="hidden" 
      theme={color}
      alignItems="center"
      justifyContent="space-between"
    >
      <FormFrame.Label>{label}</FormFrame.Label>
      
      <DatePickerField
        disabled={disabled}
        type="date"
        value={getDateValue()}
        onChange={handleDateChange}
        placeholder={placeholder}
      />
      
      {error && (
        <Text.XSM color="$orange5" textAlign="left">
          {error}
        </Text.XSM>
      )}
    </FormFrame>
  )
} 