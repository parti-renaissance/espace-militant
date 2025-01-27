import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import { getFormattedDate, getHumanFormattedTime, getIntlDate } from '@/utils/date'
import { format, getHours, getMinutes, parseISO, setHours, setMinutes } from 'date-fns'
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

const getDateInputValue = (d: Date, type: 'date' | 'time') => (type === 'date' ? (isWeb ? getIntlDate(d) : format(d, 'dd-MM-yyyy')) : format(d, 'HH:mm'))

const DatePickerField = forwardRef<Input, DatePickerFieldProps>(({ value, onChange, error, label, disabled, color, type = 'date', onBlur }, ref) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const readableDate = value && typeof value === 'object' ? getDateInputValue(value, type) : ''
  const [inputValue, setInputValue] = useState(readableDate ?? '')
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
    setInputValue(type === 'date' ? getFormattedDate(input) : getHumanFormattedTime(input))
    setIsDatePickerVisible(false)
    onBlur?.()
  }

  // In case of web component
  const handleChange = (input: string) => {
    setInputValue(input)

    if (input != '' && input.length === 10) {
      try {
        const time = value ? [getHours(value), getMinutes(value)] : undefined
        const date = isWeb ? new Date(input) : parseISO(input)
        const dateWHour = time && time[0] ? setHours(date, time[0]) : date
        const fulldate = time && time[1] ? setMinutes(dateWHour, time[1]) : date
        onChange?.(fulldate)
      } catch (e) {
        console.log(e)
      }
    } else if (type === 'time') {
      if (input.includes(':')) {
        let candidate = value ?? new Date()
        const inputParts = input.split(':')
        if (inputParts.length === 2) {
          candidate = setHours(candidate, Number(inputParts[0]))
          candidate = setMinutes(candidate, Number(inputParts[1]))
          onChange?.(candidate)
          return
        }
      }

      onChange?.(undefined)
    } else {
      onChange?.(undefined)
    }
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

  return Platform.OS === 'web' ? (
    <FormFrame.Input error={Boolean(error)} ref={inputRef} value={inputValue} onChangeText={handleChange} onBlur={() => onBlur?.()} />
  ) : (
    <>
      <FormFrame.Button onPress={onShow} error={Boolean(error)}>
        <Text.MD color={error ? '$orange5' : '$textPrimary'}>{type === 'date' ? 'JJ/MM/AAAA' : 'HH:MM'}</Text.MD>
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
