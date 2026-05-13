import React, { Children, isValidElement, ReactElement } from 'react'
import { XStack } from 'tamagui'

type EventItemActionsProps = {
  children: [ReactElement] | [ReactElement, ReactElement] | [ReactElement, ReactElement, ReactElement]
}

export const EventItemActions = ({ children }: EventItemActionsProps) => {
  //@ts-expect-error child type on string
  const elements = Children.map(children, (child) => isValidElement(child) && child?.type(child.props)).filter(Boolean)

  if (elements.length < 3) {
    return (
      <XStack justifyContent="space-between" gap={8}>
        {children}
      </XStack>
    )
  }

  const [first, second, last] = elements

  return (
    <XStack justifyContent="space-between" alignItems="center" gap={8}>
      <XStack>{[first]}</XStack>
      <XStack gap={8}>{[second, last]}</XStack>
    </XStack>
  )
}
