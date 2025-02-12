import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import { getFormattedDate, getFormattedTime } from '@/utils/date'
import { Input, isWeb } from 'tamagui'

interface DatePickerFieldProps {
  onChange?: (date: Date | undefined) => void
  onBlur?: (fieldOrEvent?: React.FocusEvent) => void
  value?: Date
  error?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  type?: 'date' | 'time'
}

const DatePickerField = forwardRef<Input, DatePickerFieldProps>(({ value, onChange, error, type = 'date', onBlur }, ref) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current && type && isWeb) {
      // @ts-expect-error wrong type on input
      inputRef.current.type = type
    }
  }, [type])

  // In case of mobile component
  const handleConfirm = (input: Date) => {
    onChange?.(input)
    setIsDatePickerVisible(false)
    onBlur?.()
  }

  const handleDateChange = (input: string) => {
    const newDate = new Date(input)
    const time = value ?? new Date()
    newDate.setHours(time.getHours())
    newDate.setMinutes(time.getMinutes())
    onChange?.(newDate)
  }

  const handleTimeChange = (input: string) => {
    const [hours, minutes] = input.split(':')
    const newDate = value ?? new Date()
    newDate.setHours(parseInt(hours))
    newDate.setMinutes(parseInt(minutes))
    newDate.setSeconds(0)
    onChange?.(newDate)
  }

  const formattedDate = value ? value.toISOString().split('T')[0] : ''
  const formattedTime = value ? `${value?.getHours().toString().padStart(2, '0')}:${value?.getMinutes().toString().padStart(2, '0')}` : ''

  const webInputValue = type === 'date' ? formattedDate : formattedTime

  // In case of web component
  const handleChange = (input: string) => {
    type === 'date' ? handleDateChange(input) : handleTimeChange(input)
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
  const placeholder = type === 'date' ? 'JJ/MM/AAAA' : 'HH:MM'

  const formatedValue = (type: 'date' | 'time', value: Date) => (type === 'date' ? getFormattedDate(value) : getFormattedTime(value))
  return Platform.OS === 'web' ? (
    <FormFrame.Input error={Boolean(error)} ref={inputRef} value={webInputValue} onChangeText={handleChange} onBlur={() => onBlur?.()} />
  ) : (
    <>
      <FormFrame.Button onPress={onShow} error={Boolean(error)}>
        <Text.MD color={error ? '$orange5' : '$textPrimary'}>{value ? formatedValue(type, value) : placeholder}</Text.MD>
      </FormFrame.Button>
      <DateTimePickerModal
        locale="fr"
        date={value}
        confirmTextIOS="Valider"
        cancelTextIOS="Annuler"
        isVisible={isDatePickerVisible}
        accentColor="blue"
        mode={type}
        onConfirm={handleConfirm}
        onCancel={onHide}
      />
    </>
  )
})

export default DatePickerField
