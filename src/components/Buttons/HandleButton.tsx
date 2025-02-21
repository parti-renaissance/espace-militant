import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { VoxButton } from '@/components/Button'
import { Sparkle } from '@tamagui/lucide-icons'
import { TamaguiElement } from 'tamagui'

const HandleButton = forwardRef<TamaguiElement, ComponentPropsWithoutRef<typeof VoxButton>>((props, ref) => {
  return (
    <VoxButton ref={ref} variant="outlined" theme="purple" iconLeft={Sparkle} {...props}>
      {props.children ?? 'Gérer'}
    </VoxButton>
  )
})

export default HandleButton
