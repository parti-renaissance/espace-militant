import { memo } from 'react'
import i18n from '@/utils/i18n'
import type { IconComponent } from '@/models/common.model'
import type { IconProps } from '@tamagui/helpers-icon'
import { getHours, isSameDay } from 'date-fns'
import { format } from 'date-fns-tz'
import { ZStack } from 'tamagui'

export const getFormatedVoxCardDate = (props: { start: Date; end?: Date; timeZone?: string; showTime?: boolean }) => {
  const { start, end, timeZone, showTime = true } = props
  const keySuffix = getHours(start) === getHours(end ?? start) ? '' : 'End'
  const keyPrefix = isSameDay(start, end ?? start) ? 'day' : 'days'
  const keyType = showTime ? 'DateTime' : 'Date'
  const key = `${keyPrefix}${keyType}${keySuffix}`
  const shouldFormatTimeZone = timeZone && timeZone !== 'Europe/Paris'
  return {
    date: i18n.t(`vox_card.${key}`, { start, end }),
    timezone: shouldFormatTimeZone ? `• UTC${format(start, 'XXX', { timeZone })}` : undefined,
  }
}

export const createDoubleIcon = (props: { icon: IconComponent; middleIconOffset?: number }) => {
  const DoubleIcon = (iconProps: any) => {
    const { size = 16, color = '$textPrimary', ...otherProps } = iconProps
    return (
      <ZStack height={size} width={size}>
        <props.icon {...otherProps} color={color} size={size} />
        <props.icon
          {...otherProps}
          color={color}
          transform={[{ translateY: props.middleIconOffset || 0 }]}
          strokeWidth={5}
          scale={0.375}
          overflow="visible"
          size={size}
        />
      </ZStack>
    )
  }
  DoubleIcon.displayName = `DoubleIcon`

  return memo<IconProps>(DoubleIcon)
}
