import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { DoorToDoorCompletePoll, GetDoorToDoorCompletePollInteractor } from '@/core/interactor/GetDoorToDoorCompletePollInteractor'
import { useDtdTunnelStore } from '@/data/store/door-to-door'
import DoorToDoorPollDetailScreenLoaded from '@/screens/doorToDoor/tunnel/survey/DoorToDoorPollDetailScreenLoaded'
import { useDoorToDoorTunnelNavigationOptions } from '@/screens/doorToDoor/tunnel/useDoorToDoorTunnelNavigationOptions.hook'
import { StatefulView } from '@/screens/shared/StatefulView'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import { Colors } from '@/styles'
import { useLocalSearchParams } from 'expo-router'

const TunnelDoorPollScreen = () => {
  const [statefulState, setStatefulState] = useState<ViewState<DoorToDoorCompletePoll>>(ViewState.Loading())

  const params = useLocalSearchParams<{
    visitStartDateISOString: string
    interlocutorStatus: string
  }>()

  const { tunnel } = useDtdTunnelStore()

  useDoorToDoorTunnelNavigationOptions()

  useEffect(() => {
    const fetchData = () => {
      new GetDoorToDoorCompletePollInteractor()
        .execute(tunnel.campaignId)
        .then((result) => {
          setStatefulState(ViewState.Content(result))
        })
        .catch((error) => setStatefulState(ViewStateUtils.networkError(error, fetchData)))
    }
    fetchData()
  }, [tunnel.campaignId])

  return (
    <View style={styles.container}>
      <StatefulView
        state={statefulState}
        contentComponent={(completePoll) => (
          <DoorToDoorPollDetailScreenLoaded
            poll={completePoll.poll}
            qualification={completePoll.config.after}
            buildingParams={tunnel.buildingParams}
            campaignId={tunnel.campaignId}
            interlocutorStatus={params.interlocutorStatus}
            visitStartDateISOString={params.visitStartDateISOString}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
})

export default TunnelDoorPollScreen
