import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Poll } from '../../core/entities/Poll'
import PollsRepository from '../../data/PollsRepository'
import { PollDetailModalNavigatorScreenProps } from '../../navigation/pollDetailModal/PollDetailModalNavigatorScreenProps'
import i18n from '../../utils/i18n'
import { CloseButton } from '../shared/NavigationHeaderButton'
import { StatefulView } from '../shared/StatefulView'
import { useBackHandler } from '../shared/useBackHandler.hook'
import { ViewState } from '../shared/ViewState'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import PollDetailScreenLoaded from './PollDetailScreenLoaded'

type PollDetailScreenProps = PollDetailModalNavigatorScreenProps<'PollDetail'>

const PollDetailScreen = ({ navigation }: PollDetailScreenProps) => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [statefulState, setStatefulState] = useState<ViewState<Poll>>(ViewState.Loading())
  const [isModalVisible, setModalVisible] = useState(false)

  const askConfirmationBeforeLeaving = useCallback(() => {
    const title = i18n.t('polldetail.leave_alert.title')
    const message = i18n.t('polldetail.leave_alert.message')
    const confirmText = i18n.t('polldetail.leave_alert.action')
    const cancelText = i18n.t('polldetail.leave_alert.cancel')
  
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`)
      if (confirmed) {
        router.push('/questionnaires')
      }
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: confirmText,
            onPress: () => router.back(),
            style: 'destructive',
          },
          {
            text: cancelText,
            style: 'cancel',
          },
        ],
        { cancelable: false }
      )
    }
  }, [navigation])

  useBackHandler(askConfirmationBeforeLeaving)

  const fetchPoll = () => {
    setStatefulState(ViewState.Loading())
    PollsRepository.getInstance()
      .getPoll(id)
      .then((poll) => {
        setStatefulState(ViewState.Content(poll))
      })
      .catch((error) => {
        console.error(error)
        setStatefulState(ViewStateUtils.networkError(error, fetchPoll))
      })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchPoll, [id, navigation])
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: statefulState.state === 'content' ? statefulState.content.name : '',
          headerLeft: () => <CloseButton onPress={() => askConfirmationBeforeLeaving()} />,
        }}
      />
      <StatefulView state={statefulState} contentComponent={(poll) => <PollDetailScreenLoaded poll={poll} />} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default PollDetailScreen
