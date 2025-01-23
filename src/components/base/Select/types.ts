import { ComponentProps, NamedExoticComponent } from 'react'
import type Text from '@/components/base/Text'
import { IconProps } from '@tamagui/helpers-icon'
import { ThemeName } from 'tamagui'
import { InputProps } from '../Input/Input'

export type ModalDropDownRef = {
  open: () => void
  close: () => void
}

export type SelectOption<A extends string> = {
  value: A
  label: string | React.ReactNode[] | Element
  subLabel?: string
  theme?: ThemeName
  icon?: NamedExoticComponent<IconProps>
}

export type SelectProps<A extends string> = {
  value?: A
  options: Readonly<Array<SelectOption<A>>>
  onChange?: (value: A) => void
  onDetailChange?: (value: { value: A; label: string | React.ReactNode[]; subLabel?: string }) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  label?: string
  placeholder?: string
  matchTextWithTheme?: boolean
  size?: InputProps['size']
  searchable?: boolean
  multiline?: boolean
  color?: InputProps['color']
  theme?: ThemeName
  customTextComponent?: (x: ComponentProps<typeof Text>) => React.ReactNode
  searchableOptions?: {
    placeholder?: string
    noResults?: string
    icon?: NamedExoticComponent<IconProps>
  }
  resetable?: boolean
}
