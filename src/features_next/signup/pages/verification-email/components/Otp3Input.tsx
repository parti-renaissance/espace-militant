import { useCallback, useEffect, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native'
import { Input, styled, XStack } from 'tamagui'

const OtpBox = styled(Input, {
  width: 52,
  height: 64,
  borderWidth: 0,
  borderColor: 'transparent',
  borderRadius: 16,
  fontSize: 24,
  textAlign: 'center',
  backgroundColor: '$white1',
  paddingVertical: 0,
  paddingHorizontal: 0,
  focusStyle: {
    borderColor: 'transparent',
    outlineWidth: 0,
  },
})

type Otp3InputProps = {
  onComplete: (code: string) => void
  disabled?: boolean
  hasError?: boolean
  onStartEditing?: () => void
  autoFocus?: boolean
}

export default function Otp3Input({ onComplete, disabled, hasError = false, onStartEditing, autoFocus = false }: Otp3InputProps) {
  const [digits, setDigits] = useState(['', '', ''])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputsRef = useRef<Array<TextInput | null>>([])
  const lastSubmittedCodeRef = useRef<string | null>(null)

  useEffect(() => {
    if (!autoFocus) return
    inputsRef.current[0]?.focus()
  }, [autoFocus])

  const submitIfComplete = useCallback(
    (next: string[]) => {
      if (!next.every((d) => d.length === 1)) {
        lastSubmittedCodeRef.current = null
        return
      }
      const code = next.join('')
      if (lastSubmittedCodeRef.current === code) return
      lastSubmittedCodeRef.current = code
      onComplete(code)
    },
    [onComplete],
  )

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const baseDigits = digits

    if (cleaned.length > 1) {
      const next = [...baseDigits]
      const chars = cleaned.split('')
      let lastFilled = index
      for (let i = 0; i < chars.length && index + i < next.length; i++) {
        next[index + i] = chars[i]
        lastFilled = index + i
      }
      setDigits(next)

      const focusIndex = Math.min(lastFilled + 1, next.length - 1)
      inputsRef.current[focusIndex]?.focus()
      submitIfComplete(next)
      return
    }

    const digit = cleaned.slice(-1)
    const next = [...baseDigits]
    next[index] = digit
    setDigits(next)

    if (digit && index < 2) {
      inputsRef.current[index + 1]?.focus()
    }
    submitIfComplete(next)
  }

  const handleKeyPress = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    if (hasError) {
      // 1. Cut error state from parent as soon as editing starts.
      onStartEditing?.()

      // 2. Reset OTP boxes to avoid stale code resubmission.
      setDigits(['', '', ''])
      lastSubmittedCodeRef.current = null

      // 3. If user tapped 2nd/3rd box, force focus back to first box.
      if (index > 0) {
        inputsRef.current[0]?.focus()
        return
      }
    }

    // Normal behavior outside error flow.
    setFocusedIndex(index)
  }

  const handleBlur = (index: number) => {
    if (focusedIndex === index) {
      setFocusedIndex(null)
    }
  }

  return (
    <XStack gap="$small" justifyContent="center" accessibilityRole="none">
      {digits.map((digit, index) => (
        <OtpBox
          key={index}
          ref={(ref) => {
            inputsRef.current[index] = ref
          }}
          borderColor="transparent"
          outlineStyle="solid"
          outlineWidth={hasError || focusedIndex === index || Boolean(digit) ? 2 : 0}
          outlineColor={hasError ? '$red600' : focusedIndex === index || Boolean(digit) ? '$blue600' : 'transparent'}
          focusStyle={{
            outlineColor: hasError ? '$red600' : '$blue600',
            outlineWidth: 2,
          }}
          value={digit}
          onChangeText={(v) => handleChange(index, v)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={() => handleBlur(index)}
          keyboardType="number-pad"
          maxLength={index === focusedIndex ? 3 : 1}
          editable={!disabled}
          selectTextOnFocus
          accessibilityLabel={`Chiffre ${index + 1} du code de vérification`}
          accessibilityHint="Saisissez un chiffre du code reçu par email"
        />
      ))}
    </XStack>
  )
}
