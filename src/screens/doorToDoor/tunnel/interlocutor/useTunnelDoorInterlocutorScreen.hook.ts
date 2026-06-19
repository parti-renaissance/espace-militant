import { useEffect, useState } from 'react'
import { useDtdTunnelStore } from '@/data/store/door-to-door'
import { useNavigation } from "expo-router/react-navigation"
import { router } from 'expo-router'
import { DoorToDoorPollConfigResponseStatus } from '../../../../core/entities/DoorToDoorPollConfig'
import { INTERLOCUTOR_ACCEPT_TO_ANSWER_CODE, SendDoorPollAnswersInteractor } from '../../../../core/interactor/SendDoorPollAnswersInteractor'
import DoorToDoorRepository from '../../../../data/DoorToDoorRepository'
import { DoorToDoorTunnelModalNavigatorScreenProps } from '../../../../navigation/doorToDoorTunnelModal/DoorToDoorTunnelModalNavigatorScreenProps'
import { AlertUtils } from '../../../shared/AlertUtils'
import { ViewState } from '../../../shared/ViewState'
import { ViewStateUtils } from '../../../shared/ViewStateUtils'
import { useDoorToDoorTunnelNavigationOptions } from '../useDoorToDoorTunnelNavigationOptions.hook'
import { TunnelDoorInterlocutorChoiceCardViewModel } from './TunnelDoorInterlocutorChoiceCardViewModel'
import { TunnelDoorInterlocutorChoiceCardViewModelMapper } from './TunnelDoorInterlocutorChoiceCardViewModelMapper'

export const useTunnelDoorInterlocutorScreen = (
  visitStartDateISOString: string,
): {
  statefulState: ViewState<TunnelDoorInterlocutorChoiceCardViewModel[]>
  isSendingChoice: boolean
  onChoice: (statusId: string) => void
} => {
  const navigation = useNavigation<DoorToDoorTunnelModalNavigatorScreenProps<'TunnelDoorInterlocutor'>['navigation']>()

  const { tunnel, setTunnel } = useDtdTunnelStore()

  const [statefulState, setStatefulState] = useState<ViewState<Array<DoorToDoorPollConfigResponseStatus>>>(ViewState.Loading())
  const [isSendingChoice, setIsSendingChoice] = useState(false)

  useDoorToDoorTunnelNavigationOptions()

  useEffect(() => {
    const fetchData = () => {
      DoorToDoorRepository.getInstance()
        .getDoorToDoorPollConfig(tunnel.campaignId)
        .then((result) => {
          setStatefulState(ViewState.Content(result.before.responseStatus))
        })
        .catch((error) => setStatefulState(ViewStateUtils.networkError(error, fetchData)))
    }
    fetchData()
  }, [tunnel.campaignId])

  const navigateToPoll = (code: string) => {
    router.push({
      pathname: '/porte-a-porte/tunnel/poll',
      params: {
        interlocutorStatus: code,
        visitStartDateISOString,
      },
    })
  }

  const sendStatus = (code: string) => {
    setIsSendingChoice(true)
    new SendDoorPollAnswersInteractor()
      .execute({
        campaignId: tunnel.campaignId,
        doorStatus: code,
        buildingParams: tunnel.buildingParams,
        visitStartDateISOString,
      })
      .then(() => {
        switch (tunnel.buildingParams.type) {
          case 'house': {
            navigation.getParent()?.goBack()
            break
          }
          case 'building': {
            setTunnel({
              ...tunnel,
              buildingParams: {
                ...tunnel.buildingParams,
                door: tunnel.buildingParams.door + 1,
              },
              canCloseFloor: true,
            })
            router.push('/porte-a-porte/tunnel/selection')
            break
          }
        }
      })
      .catch((error) =>
        AlertUtils.showNetworkAlert(error, () => {
          onChoice(code)
        }),
      )
      .finally(() => setIsSendingChoice(false))
  }

  const onChoice = (statusId: string) => {
    const status = (ViewState.unwrap(statefulState) ?? []).find((s) => s.code === statusId)
    if (status === undefined) {
      return
    }
    if (status.code === INTERLOCUTOR_ACCEPT_TO_ANSWER_CODE) {
      navigateToPoll(status.code)
    } else {
      sendStatus(status.code)
    }
  }

  return {
    statefulState: ViewState.map(statefulState, (statuses) => {
      return statuses.map(TunnelDoorInterlocutorChoiceCardViewModelMapper.map)
    }),
    isSendingChoice,
    onChoice,
  }
}
