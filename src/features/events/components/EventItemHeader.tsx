import React, { ReactElement } from 'react'
import { XStack } from 'tamagui'

type EventItemHeader = {
  children: ReactElement[]
}

export const EventItemHeader = ({ children }: EventItemHeader) => {
  return (
    <XStack justifyContent="space-between" alignItems="flex-start" gap={8}>
      {children}
    </XStack>
  )
}
