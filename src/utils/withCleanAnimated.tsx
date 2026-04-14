import React, { ComponentPropsWithRef, ComponentPropsWithoutRef, forwardRef } from 'react'
import Animated from 'react-native-reanimated'

/**
 * HOC qui nettoie la prop "forwardedRef" injectée par Reanimated
 * avant qu'elle n'atteigne le composant Tamagui/React de base.
 */
export function withCleanAnimated<T extends React.ElementType>(WrappedComponent: T) {
  type CleanProps = Omit<ComponentPropsWithoutRef<T>, 'forwardedRef'> & { forwardedRef?: unknown }
  type WrappedPropsWithRef = ComponentPropsWithRef<T>

  const CleanComponent = forwardRef<unknown, CleanProps>((props, ref) => {
    const rest = { ...(props as CleanProps) }
    delete rest.forwardedRef

    // TS ne peut pas toujours inférer correctement les props d'un composant générique.
    const componentProps = { ...(rest as ComponentPropsWithoutRef<T>), ref } as WrappedPropsWithRef

    return React.createElement(WrappedComponent, componentProps)
  })

  const wrappedName = typeof WrappedComponent === 'string' ? WrappedComponent : (WrappedComponent.displayName ?? 'Component')
  CleanComponent.displayName = `withCleanAnimated(${wrappedName})`

  return Animated.createAnimatedComponent(CleanComponent)
}
