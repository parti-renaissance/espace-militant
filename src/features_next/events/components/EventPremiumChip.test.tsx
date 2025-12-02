import React from 'react'
import TamaguiProvider from '@/tamagui/provider'
import { render } from '@testing-library/react-native'
import { EventPremiumChip } from './EventPremiumChip'

const customRender: typeof render = (ui) => {
  return render(<TamaguiProvider>{ui}</TamaguiProvider>)
}

describe('EventPremiumChip', () => {
  it('should display "Réservé aux adhérents" when event reserved to adherant ', async () => {
    const { root } = customRender(
      <EventPremiumChip
        event={{
          uuid: 'id',
          object_state: 'full',
          visibility: 'adherent',
        }}
      />,
    )
    expect(root).toHaveTextContent('Réservé aux adhérents')
  })

  it('should display "Réservé aux adhérents" when event reserved to adherant dues ', async () => {
    const { root } = customRender(
      <EventPremiumChip
        event={{
          uuid: 'id',
          object_state: 'full',
          visibility: 'adherent_dues',
        }}
      />,
    )
    expect(root).toHaveTextContent('Réservé aux adhérents à jour')
  })

  it('should display "Réservé aux militants" when event reserved to account owner (Non public) ', async () => {
    const { root } = customRender(
      <EventPremiumChip
        event={{
          uuid: 'id',
          visibility: 'private',
        }}
      />,
    )
    expect(root).toHaveTextContent('Réservé aux militants')
  })
})
