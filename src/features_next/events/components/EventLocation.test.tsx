import { RestFullEvent } from '@/services/events/schema'
import TamaguiProvider from '@/tamagui/provider'
import { render as _render } from '@testing-library/react-native'
import { EventLocation } from './EventLocation'

const render: typeof _render = (ui) => {
  return _render(<TamaguiProvider>{ui}</TamaguiProvider>)
}

describe('EventLocation', () => {
  it('should render Visio', () => {
    const { getByTestId } = render(
      <EventLocation
        event={{
          uuid: '1',
          mode: 'online',
        }}
      />,
    )
    expect(getByTestId('event-location-visio')).toBeTruthy()
  })

  it('should render Location', () => {
    const { getByTestId } = render(
      <EventLocation
        event={
          {
            uuid: '1',
            object_state: 'full',
            post_address: {
              city_name: 'Paris',
              postal_code: '75011',
              address: '1 rue de la gare',
            },
          } as RestFullEvent
        }
      />,
    )
    expect(getByTestId('event-location-location')).toBeTruthy()
  })

  it('should not render if no address', () => {
    const { root } = render(
      <EventLocation
        event={{
          uuid: '1',
        }}
      />,
    )
    expect(root).toBeUndefined()
  })
})
