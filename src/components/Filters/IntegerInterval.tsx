import React from 'react'
import { XStack, YStack } from 'tamagui'

import Input from '@/components/base/Input/Input'

import type { FilterOptionIntegerInterval } from '@/services/filters-collection/schema'

export interface IntegerIntervalValue {
  start: number | null
  end: number | null
}

interface IntegerIntervalProps {
  labelFrom?: string | null
  labelTo?: string | null
  value: IntegerIntervalValue
  onChange: (value: IntegerIntervalValue) => void
  options: FilterOptionIntegerInterval
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'gray' | 'purple'
}

function parseNum(s: string): number | null {
  if (s === '' || s == null) return null
  const n = Number(s)
  return Number.isNaN(n) ? null : n
}

export default function IntegerInterval({ labelFrom, labelTo, value, onChange, options, size = 'md', color = 'gray' }: IntegerIntervalProps) {
  const suffix = options?.suffix ? ` ${options.suffix}` : ''
  const fromLabel = (labelFrom ?? options?.first?.label ?? 'Min') + suffix
  const toLabel = (labelTo ?? options?.second?.label ?? 'Max') + suffix
  const minFirst = options?.first?.min ?? 0
  const maxFirst = options?.first?.max ?? 999
  const minSecond = options?.second?.min ?? 0
  const maxSecond = options?.second?.max ?? 999

  const handleStartChange = (text: string) => {
    const n = parseNum(text)
    onChange({ ...value, start: n })
  }
  const handleEndChange = (text: string) => {
    const n = parseNum(text)
    onChange({ ...value, end: n })
  }

  return (
    <XStack borderRadius="$medium" gap="$xsmall">
      <YStack flexShrink={1}>
        <Input
          value={value.start != null ? String(value.start) : ''}
          onChangeText={handleStartChange}
          placeholder={fromLabel}
          size={size}
          color={color}
          keyboardType="number-pad"
        />
      </YStack>
      <YStack flexShrink={1}>
        <Input
          value={value.end != null ? String(value.end) : ''}
          onChangeText={handleEndChange}
          placeholder={toLabel}
          size={size}
          color={color}
          keyboardType="number-pad"
        />
      </YStack>
    </XStack>
  )
}
