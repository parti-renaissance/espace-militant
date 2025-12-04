import type { IconProps } from '@tamagui/helpers-icon'

export interface LabelValueModel<T = string> {
  label: string
  value: T
}

export type IconComponent = React.ComponentType<IconProps>
