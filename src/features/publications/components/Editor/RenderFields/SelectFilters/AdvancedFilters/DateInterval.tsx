import React from 'react'
import { YStack } from 'tamagui'

import DateInput from '@/components/base/DateInput'

export interface DateIntervalValue {
  start: string | null
  end: string | null
}

interface DateIntervalProps {
  labelFrom?: string
  labelTo?: string
  value: DateIntervalValue
  onChange: (value: DateIntervalValue) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'gray' | 'blue' | 'green' | 'red'
  resetable?: boolean
}

const defaultLabels = { from: 'Depuis', to: 'Jusqu‘au' }

export default function DateInterval({
  labelFrom = defaultLabels.from,
  labelTo = defaultLabels.to,
  value,
  onChange,
  placeholder,
  size = 'md',
  color = 'gray',
  resetable = true,
}: DateIntervalProps) {
  const handleStartChange = (v: string | null) => {
    onChange({ ...value, start: v })
  }
  const handleEndChange = (v: string | null) => {
    onChange({ ...value, end: v })
  }

  return (
    <YStack theme="gray" bg="$color1" borderRadius="$medium" py="$small">
      <DateInput
        label={labelFrom}
        value={value.start}
        onChange={handleStartChange}
        placeholder={placeholder ?? 'Sélectionner une date'}
        size={size}
        color={color}
        resetable={resetable}
      />
      <DateInput
        label={labelTo}
        value={value.end}
        onChange={handleEndChange}
        placeholder={placeholder ?? 'Sélectionner une date'}
        size={size}
        color={color}
        resetable={resetable}
      />
    </YStack>
  )
}
