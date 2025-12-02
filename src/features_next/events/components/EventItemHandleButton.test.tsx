import React from 'react'
import * as mockedEvnt from '@/services/events/mock/feed-item'
import TamaguiProvider from '@/tamagui/provider'
import { render } from '@testing-library/react-native'
import { EventItemHandleButton } from './EventItemHandleButton'

const customRender: typeof render = (ui) => {
  return render(<TamaguiProvider>{ui}</TamaguiProvider>)
}

describe('EventItemHandleButton', () => {
  it('should not display "Gérer" button when event is not editable ', async () => {
    const { root } = customRender(
      <EventItemHandleButton
        event={{
          uuid: 'id',
          object_state: 'full',
        }}
      />,
    )
    expect(root).toBeUndefined()
  })

  it('should display "Gérer" button when event editable ', async () => {
    const { getByTestId } = customRender(
      <EventItemHandleButton
        event={{
          uuid: 'id',
          ...mockedEvnt.editableEvent,
        }}
      />,
    )
    const button = getByTestId('event-item-handle-button')
    expect(button).toBeTruthy()
  })

  it('should display "Gérer" button when event editable ', async () => {
    const { getByTestId } = customRender(
      <EventItemHandleButton
        event={{
          uuid: 'id',
          ...mockedEvnt.editableEvent,
        }}
      />,
    )
    const button = getByTestId('event-item-handle-button')
    expect(button).toBeTruthy()
  })
})
