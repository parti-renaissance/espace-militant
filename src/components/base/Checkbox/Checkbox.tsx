import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Stack } from 'tamagui'
import { Check, Minus } from '@tamagui/lucide-icons'

type CheckboxProps = ComponentPropsWithoutRef<typeof Stack> & {
  color?: 'blue' | 'gray'
  indeterminate?: boolean
  checked?: boolean
}

export default forwardRef<any, CheckboxProps>(function Checkbox(
  { color = 'blue', indeterminate = false, checked = false, disabled = false, onPress, ...props },
  ref,
) {
  const hintColor = color === 'gray' ? '$gray7' : '$blue9'
  const isActive = !!checked || indeterminate

  return (
    <Stack
      ref={ref}
      tag="button"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      height={34}
      width={34}
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      hoverStyle={!disabled ? { backgroundColor: '$blue2' } : undefined}
      pressStyle={!disabled ? { backgroundColor: '$blue2' } : undefined}
      {...props}
    >
      <Stack
        height={18}
        width={18}
        borderRadius={2}
        borderWidth={1}
        borderColor={isActive ? hintColor : '$textSecondary'}
        backgroundColor={isActive ? hintColor : 'transparent'}
        alignItems="center"
        justifyContent="center"
      >
        {isActive ? indeterminate && !checked ? <Minus size={14} color="$white2" /> : <Check size={14} color="$white2" /> : null}
      </Stack>
    </Stack>
  )
})

type PureCheckboxProps = {
  color?: 'blue' | 'gray'
  indeterminate?: boolean
  checked?: boolean
  disabled?: boolean
  onPress?: () => void
}

export const nativeCheckbox = forwardRef<any, PureCheckboxProps>(function PureCheckbox(
  { color = 'blue', indeterminate = false, checked = false, disabled = false, onPress },
  ref,
) {
  // Valeurs hexadécimales dures pour simuler tes variables Tamagui ($blue9, $gray7, etc.)
  const activeColor = color === 'gray' ? '#8E8E93' : '#005ecc'
  const isActive = checked || indeterminate

  return (
    <Pressable
      ref={ref}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      // Pressable permet de changer le style quand on appuie dessus, remplaçant "pressStyle" de Tamagui
      style={({ pressed }) => [styles.container, disabled && styles.disabled, pressed && !disabled && styles.pressed]}
    >
      <View style={[styles.box, isActive ? { backgroundColor: activeColor, borderColor: activeColor } : styles.boxInactive]}>
        {isActive ? indeterminate && !checked ? <Minus size={14} color="#FFFFFF" /> : <Check size={14} color="#FFFFFF" /> : null}
      </View>
    </Pressable>
  )
})

// StyleSheet.create est le moyen le plus performant de styliser en React Native :
// l'objet est calculé une seule fois au chargement du fichier, pas à chaque re-rendu.
const styles = StyleSheet.create({
  container: {
    height: 34,
    width: 34,
    borderRadius: 17, // La moitié de 34 pour un cercle parfait
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)', // Simule ton $blue2 au clic
  },
  box: {
    height: 18,
    width: 18,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxInactive: {
    borderColor: '#8E8E93', // Simule ton $textSecondary
    backgroundColor: 'transparent',
  },
})
