import { useCallback, useEffect, useRef, useState } from 'react'
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData } from 'react-native'
import { XStack } from 'tamagui'

type Otp3InputProps = {
  onComplete: (code: string) => void
  disabled?: boolean
  error?: string | null
}

export default function Otp3Input({ onComplete, disabled, error }: Otp3InputProps) {
  const [digits, setDigits] = useState(['', '', ''])
  const inputsRef = useRef<Array<TextInput | null>>([])
  const lastSubmittedCodeRef = useRef<string | null>(null)

  useEffect(() => {
    if (!error) return
    lastSubmittedCodeRef.current = null
    setDigits(['', '', ''])
    inputsRef.current[0]?.focus()
  }, [error])

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
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
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

  return (
    <XStack gap="$small" justifyContent="center" accessibilityRole="none">
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputsRef.current[index] = ref
          }}
          style={styles.input}
          value={digit}
          onChangeText={(v) => handleChange(index, v)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          selectTextOnFocus
          accessibilityLabel={`Chiffre ${index + 1} du code de vérification`}
          accessibilityHint="Saisissez un chiffre du code reçu par email"
        />
      ))}
    </XStack>
  )
}

const styles = StyleSheet.create({
  input: {
    width: 52,
    height: 64,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
})
