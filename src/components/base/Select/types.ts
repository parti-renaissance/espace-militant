import { ComponentProps } from 'react'
import type Text from '@/components/base/Text'
import type { IconComponent } from '@/models/common.model'
import { ThemeName } from 'tamagui'
import { InputProps } from '../Input/Input'
import { SelectFrames } from './Frames'

export type ModalDropDownRef = {
  open: () => void
  close: () => void
}

export type SelectOption<A extends string> = {
  value: A
  label: string | React.ReactNode[] | Element
  subLabel?: string
  theme?: ThemeName
  icon?: IconComponent
}

export type SelectProps<A extends string> = {
  value?: A
  options: Readonly<Array<SelectOption<A>>>
  onChange?: (value: A | null) => void
  onDetailChange?: (value: { value: A; label: string | React.ReactNode[]; subLabel?: string }) => void
  onOpen?: () => void
  onBlur?: () => void
  disabled?: boolean
  noValuePlaceholder?: string
  error?: string
  label?: string
  placeholder?: string
  matchTextWithTheme?: boolean
  size?: InputProps['size']
  searchable?: boolean
  multiline?: boolean
  color?: InputProps['color']
  theme?: ThemeName
  icon?: IconComponent
  frameProps?: ComponentProps<typeof SelectFrames>
  customTextComponent?: (x: ComponentProps<typeof Text>) => React.ReactNode
  searchableOptions?: {
    placeholder?: string
    noResults?: string
    icon?: IconComponent
    autocompleteCallback?: (value: string) => void
    isFetching?: boolean
  }
  helpText?: string | React.ReactNode
  resetable?: boolean
  openAbove?: boolean
  nullableOption?: string
}
