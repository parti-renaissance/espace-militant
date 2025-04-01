import { ReactNode } from 'react'
import EmptyStateIllustration from '@/assets/illustrations/EmptyStateIllustration'
import { RNTamaguiViewNonStyleProps } from '@tamagui/core/src'
import { View } from 'tamagui'

export default function EmptyState({ children, ...otherProps }: { children: ReactNode } & RNTamaguiViewNonStyleProps) {
  return (
    <View alignSelf="center" alignContent="center" gap="$medium" {...otherProps}>
      <EmptyStateIllustration />
      {children}
    </View>
  )
}
