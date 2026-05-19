import React, { forwardRef, useId, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import { dateTimeFormat, getFormattedDate, getFormattedTime } from '@/utils/date'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Input, isWeb } from 'tamagui'

interface DatePickerFieldProps {
  onChange?: (date: Date | undefined) => void
  onBlur?: (fieldOrEvent?: React.FocusEvent) => void
  value?: Date
  error?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  type?: 'date' | 'time' | 'datetime'
}

const toDatetimeLocalValue = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const DatePickerField = forwardRef<Input, DatePickerFieldProps>(({ value, disabled, onChange, error, type = 'date', onBlur }, ref) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const id = useId()
  

  // In case of mobile component
  const handleConfirm = (input: Date) => {
    onChange?.(input)
    setIsDatePickerVisible(false)
    onBlur?.()
  }

  const handleDateChange = (input: string) => {
    const newDate = new Date(input)
    const time = value && isValid(value) ? value : new Date()
    newDate.setHours(time.getHours())
    newDate.setMinutes(time.getMinutes())
    onChange?.(newDate)
  }

  const handleTimeChange = (input: string) => {
    const [hours, minutes] = input.split(':')
    const newDate = value && isValid(value) ? value : new Date()
    newDate.setHours(parseInt(hours))
    newDate.setMinutes(parseInt(minutes))
    newDate.setSeconds(0)
    onChange?.(newDate)
  }

  const handleDatetimeChange = (input: string) => {
    const newDate = new Date(input)
    if (!isNaN(newDate.getTime())) {
      onChange?.(newDate)
    }
  }

  const formattedDate = value && isValid(value) ? value.toISOString().split('T')[0] : ''
  const formattedTime = value && isValid(value) ? `${value?.getHours().toString().padStart(2, '0')}:${value?.getMinutes().toString().padStart(2, '0')}` : ''
  const formattedDatetime = value && isValid(value) ? toDatetimeLocalValue(value) : ''

  const webInputValue = type === 'date' ? formattedDate : type === 'time' ? formattedTime : formattedDatetime
  const webInputType = type === 'datetime' ? 'datetime-local' : type

  // In case of web component
  const handleChange = (input: string) => {
    if (type === 'date') handleDateChange(input)
    else if (type === 'time') handleTimeChange(input)
    else handleDatetimeChange(input)
  }

  const onHide = () => {
    if (!isWeb) {
      Keyboard.dismiss()
      setIsDatePickerVisible(false)
      onBlur?.()
    }
  }

  const onShow = () => {
    if (!isWeb) {
      setIsDatePickerVisible(true)
    }
  }
  const placeholder = type === 'date' ? 'JJ/MM/AAAA' : type === 'time' ? 'HH:MM' : 'JJ/MM/AAAA HH:MM'

  const formatedValue = (pickerType: 'date' | 'time' | 'datetime', dateValue: Date) => {
    if (pickerType === 'date') return getFormattedDate(dateValue)
    if (pickerType === 'time') return getFormattedTime(dateValue)
    return format(dateValue, dateTimeFormat, { locale: fr })
  }

  const pickerMode = type === 'datetime' ? 'datetime' : type

  return Platform.OS === 'web' ? (
    <input
      type={webInputType}
      value={webInputValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={() => onBlur?.()}
      disabled={disabled}
      placeholder={placeholder}
      name={`datepicker-${type}`}
      id={`datepicker-${type}-${id.replace(/:/g, '-')}`}
      style={{
        fontFamily: 'Public Sans, sans-serif',
        fontSize: 14,
        fontWeight: 400,
        height: 36,
        padding: '4px 8px',
        borderRadius: 8,
        backgroundColor: error ? '#fff3f0' : '#e8ebed',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        color: error ? '#d26b4b' : '#212b36',
        boxSizing: 'border-box',
      }}
    />
  ) : (
    <>
      <FormFrame.Button onPress={onShow} error={Boolean(error)}>
        <Text.MD color={error ? '$orange5' : '$textPrimary'}>{value ? formatedValue(type, value) : placeholder}</Text.MD>
      </FormFrame.Button>
      <DateTimePickerModal
        disabled={disabled}
        locale="fr"
        date={value ? value : new Date()}
        confirmTextIOS="Valider"
        cancelTextIOS="Annuler"
        isVisible={isDatePickerVisible}
        accentColor="blue"
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={onHide}
      />
    </>
  )
})

export default DatePickerField
