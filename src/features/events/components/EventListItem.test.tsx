import React from 'react'
import { payload } from '@/services/events/mock/feed-item'
import * as mockedEvnt from '@/services/events/mock/feed-item'
import TamaguiProvider from '@/tamagui/provider'
import type { IconComponent } from '@/models/common.model'
import { Calendar } from '@tamagui/lucide-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react-native'
import type { ReactTestInstance } from 'react-test-renderer'
import EventListItem from './EventListItem'

jest.mock('@/components/ModalOrPageBase/ModalOrPageBase', () => ({ default: jest.fn(({ children }) => {}) }))

const customRender: typeof render = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off
        retry: false,
      },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider>
        <>{ui}</>
      </TamaguiProvider>
    </QueryClientProvider>,
  )
}

const expectChip = (
  instance: ReactTestInstance,
  payload: {
    name: string
    icon: IconComponent
  },
) => {
  expect(instance).toBeTruthy()
  expect(instance).toHaveTextContent(payload.name)
  expect(instance).toHaveProp('icon', payload.icon)
}

describe('EventListItem', () => {
  it('should render category badge', () => {
    const { getByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          category: payload.category,
        }}
      />,
    )
    expectChip(getByTestId('event-category-chip'), {
      name: payload.category.name,
      icon: Calendar,
    })
  })

  it('should render category badge without category name', () => {
    const { getByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
        }}
      />,
    )

    expectChip(getByTestId('event-category-chip'), {
      name: 'Évenement',
      icon: Calendar,
    })
  })

  it('should render title', () => {
    const { getByText } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          name: payload.name,
        }}
      />,
    )

    const title = getByText(payload.name)
    expect(title).toBeTruthy()
  })

  it('should render date', () => {
    const { getByText } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          begin_at: '2030-08-09T10:59:52+02:00',
          finish_at: '2030-08-09T11:59:52+02:00',
          time_zone: 'Europe/Paris',
        }}
      />,
    )

    const date = getByText('vendredi 9 août 2030 à 10:59 / 11:59')
    expect(date).toBeTruthy()
  })

  it('should render date without end date', () => {
    const { getByText } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          begin_at: '2030-08-09T10:59:52+02:00',
          time_zone: 'Europe/Paris',
        }}
      />,
    )

    const date = getByText('vendredi 9 août 2030 à 10:59')
    expect(date).toBeTruthy()
  })

  it('should render date without timezone', () => {
    const { getByText } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          begin_at: '2030-08-09T10:59:52+02:00',
        }}
      />,
    )

    const date = getByText('vendredi 9 août 2030 à 10:59')
    expect(date).toBeTruthy()
  })

  it('should render Author', () => {
    const { getByText } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          organizer: payload.organizer,
        }}
      />,
    )
    expect(getByText('Assemblée départementale • Hauts-de-Seine')).toBeTruthy()
    expect(getByText('Victor Fortest, Président')).toBeTruthy()
  })

  it('should render status chip', () => {
    const { getByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          status: 'CANCELLED',
        }}
      />,
    )
    expect(getByTestId('status-event-chip')).toBeTruthy()
  })

  it('should render button "voir"', async () => {
    const { findByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
        }}
      />,
    )
    const button = await findByTestId('event-show-button')
    expect(button).toBeTruthy()
  })

  it('should render subscribe toggle button', async () => {
    const { findByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
        }}
      />,
    )
    const button = await findByTestId('event-item-toggle-subscribe-button')
    expect(button).toBeTruthy()
  })

  it('should render subscribe toggle button', async () => {
    const { findByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          ...mockedEvnt.editableEvent,
        }}
      />,
    )
    const button = await findByTestId('event-item-handle-button')
    expect(button).toBeTruthy()
  })

  it('should render PremiumChip', async () => {
    const { findByTestId } = customRender(
      <EventListItem
        userUuid="user-uuid"
        event={{
          uuid: '1',
          slug: 'test-event',
          visibility: 'adherent',
        }}
      />,
    )
    expect(await findByTestId('event-premium-chip')).toBeTruthy()
  })

  // it('should popup a dialog when event is private and user is not logged in', async () => {
  //   const { findByTestId } = customRender(
  //     <EventListItem
  //       event={{
  //         uuid: '1',
  //         visibility: 'private',
  //       }}
  //     />,
  //   )
  //   const button = await findByTestId('event-item-sign-in-dialog')
  //   expect(button).toBeTruthy()
  // })
})
