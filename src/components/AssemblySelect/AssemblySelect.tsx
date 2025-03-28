import { memo, useCallback, useMemo } from 'react'
import Select from '@/components/base/Select/SelectV3'
import { InputProps } from '../base/Input/Input'
import { assemblies } from './assemblies'

interface AssemblySelectProps {
  value?: string
  onChange?: (value?: string) => void
  onDetailChange?: (payload?: { value: string; label: string }) => void
  defaultValue?: string
  label?: string
  id: string
  error?: string
  onBlur?: () => void
  placeholder?: string
  color?: InputProps['color']
  size?: InputProps['size']
  resetable?: boolean
}
const options = [
  { value: 'all', label: 'Toutes' },
  ...assemblies.map(({ label, value }) => ({
    label: `${value} • ${label}`,
    value,
  })),
]

const optionMap = new Map(options.map((options) => [options.value, options]))

function AssemblySelect({ id, onChange, onDetailChange, value, defaultValue, ...props }: Readonly<AssemblySelectProps>) {
  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value)
    },
    [onChange],
  )

  const handleDetailChange = useCallback(
    (payload: { label: string; value: string }) => {
      onDetailChange?.(payload)
    },
    [onDetailChange],
  )

  const finalOptions = useMemo(() => {
    if (!defaultValue) return options
    const defaultOption = optionMap.get(defaultValue)
    if (defaultOption) {
      const [head, ...tail] = options.filter(({ value }) => value !== defaultOption.value)
      return [head, defaultOption, ...tail]
    }
    return options
  }, [defaultValue])

  return (
    <Select
      label={props.label ?? 'Assemblée'}
      key={id}
      searchable
      resetable={props.resetable}
      options={finalOptions}
      onChange={handleChange}
      onDetailChange={handleDetailChange}
      value={value ?? defaultValue ?? 'all'}
      {...props}
    />
  )
}

export default memo(AssemblySelect)
