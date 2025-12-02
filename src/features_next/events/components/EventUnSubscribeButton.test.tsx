import React from 'react'
import { useUnsubscribeEvent } from '@/services/events/hook'
import TamaguiProvider from '@/tamagui/provider'
import { fireEvent, render } from '@testing-library/react-native'
import { EventUnSubscribeButton } from './EventUnSubscribeButton'

const mockedUnSubMutate = jest.fn()
const mockedSubMutate = jest.fn()
// mock src/services/events/api.ts
jest.mock('@/services/events/hook', () => {
  return {
    __esModule: true,
    useUnsubscribeEvent: jest.fn(() => ({
      mutate: mockedUnSubMutate,
      isPending: false,
    })),
    useSubscribeEvent: jest.fn(() => ({
      mutate: mockedSubMutate,
      isPending: false,
    })),
  }
})

jest.mock('@/services/profile/hook', () => {
  return {
    __esModule: true,
    useGetProfil: jest.fn(() => ({
      data: {
        uuid: 'lol',
      },
    })),
  }
})

jest.mock('@/ctx/SessionProvider', () => {
  return {
    __esModule: true,
    useSession: jest.fn(() => ({
      isAuth: true,
    })),
  }
})

const customRender: typeof render = (ui) => {
  return render(<TamaguiProvider>{ui}</TamaguiProvider>)
}

describe('EventUnSubscribeButton', () => {
  it('should call unsusbcribe hook', async () => {
    const { getByTestId } = customRender(<EventUnSubscribeButton uuid="unsubscribe-id" slug="wekjfhwe" userUuid="user-uuid" />)
    const button = getByTestId('event-unsubscribe-button')
    expect(button).toHaveTextContent('Me désinscrire')
    expect(useUnsubscribeEvent).toHaveBeenCalledWith({ id: 'unsubscribe-id' })
    fireEvent.press(button)
    expect(mockedUnSubMutate).toHaveBeenCalled()
  })
})
