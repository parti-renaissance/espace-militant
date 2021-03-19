import React, { forwardRef } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextInput,
} from 'react-native'
import { Colors, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import LabelInputContainer from './LabelInputContainer'

type Props = Readonly<{
  style?: StyleProp<ViewStyle>
  label: string
  nextInput?: React.RefObject<TextInput>
  isLastInput?: boolean
  textInputProps?: TextInputProps
  defaultValue?: string
  onValueChange: (newValue: string) => void
  errorMessage?: string
  disabled?: boolean
}>

const LabelTextInput = forwardRef<TextInput, Props>((props, ref) => {
  const returnKeyType = props.isLastInput === true ? 'done' : 'next'
  const submitEditing = () => {
    if (props.nextInput !== undefined) {
      props.nextInput?.current?.focus()
    }
  }
  const textInputStyle = props.disabled
    ? styles.textInputDisabled
    : styles.textInputEnabled
  return (
    <LabelInputContainer
      label={props.label}
      errorMessage={props.errorMessage}
      disabled={props.disabled}
    >
      <TextInput
        ref={ref}
        style={[styles.textInput, textInputStyle]}
        placeholder={i18n.t('personalinformation.placeholder')}
        placeholderTextColor={Colors.lightText}
        returnKeyType={returnKeyType}
        onSubmitEditing={submitEditing}
        defaultValue={props.defaultValue}
        {...props.textInputProps}
        onChangeText={props.onValueChange}
        editable={!props.disabled}
      />
    </LabelInputContainer>
  )
})

const styles = StyleSheet.create({
  textInput: {
    ...Typography.body,
    flexGrow: 1,
    textAlign: 'right',
    paddingVertical: 0,
  },
  textInputEnabled: {
    color: Colors.darkText,
  },
  textInputDisabled: {
    color: Colors.lightText,
  },
})

export default LabelTextInput
