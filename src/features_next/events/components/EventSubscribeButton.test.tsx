import React from 'react'
import { useSubscribeEvent } from '@/services/events/hook'
import TamaguiProvider from '@/tamagui/provider'
import { fireEvent, render } from '@testing-library/react-native'
import { EventSubscribeButton } from './EventSubscribeButton'

const mockedUnSubMutate = jest.fn()
const mockedSubMutate = jest.fn()
jest.mock('@/components/ModalOrPageBase/ModalOrPageBase', () => ({ default: jest.fn(() => <></>) }))
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

describe('EventSubscribeButton', () => {
  it('should call susbcribe hook', async () => {
    const { getByTestId } = customRender(<EventSubscribeButton uuid="subscribe-id" slug="coucou" userUuid="user-uuid" />)
    const button = getByTestId('event-subscribe-button')
    expect(button).toHaveTextContent("M'inscrire")
    expect(useSubscribeEvent).toHaveBeenCalledWith({ id: 'subscribe-id' })
    fireEvent.press(button)
    expect(mockedSubMutate).toHaveBeenCalled()
  })
})
