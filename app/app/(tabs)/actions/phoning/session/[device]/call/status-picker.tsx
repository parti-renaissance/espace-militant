import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PhoningSessionCallStatus } from '@/core/entities/PhoningSessionConfiguration'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { useCampaignStore, useSessionStore } from '@/data/store/phoning'
import { PhonePollDetailCallStatusViewModelMapper } from '@/screens/phonePollDetail/PhonePollDetailCallStatusViewModelMapper'
import QuestionChoiceRow from '@/screens/pollDetail/QuestionChoiceRow'
import { QuestionChoiceRowViewModel } from '@/screens/pollDetail/QuestionChoiceRowViewModel'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import { PrimaryButton } from '@/screens/shared/Buttons'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { VerticalSpacer } from '@/screens/shared/Spacer'
import { StatefulView } from '@/screens/shared/StatefulView'
import { usePreventGoingBack } from '@/screens/shared/usePreventGoingBack.hook'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import { Colors, Spacing, Styles, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { router, Stack, useLocalSearchParams } from 'expo-router'

const PhoneCallStatusPickerScreen = () => {
  const [statefulState, setStatefulState] = useState<ViewState<Array<PhoningSessionCallStatus>>>(ViewState.Loading())

  const [selectedStatusCode, setSelectedStatusCode] = useState<string>()
  const [isLoading, setLoading] = useState(false)
  const { session } = useSessionStore()
  const { campaign } = useCampaignStore()
  const { device } = useLocalSearchParams<{ device: 'current' | 'external' }>()

  const fetchCallStatuses = useCallback(() => {
    PhoningCampaignRepository.getInstance()
      .getPhoningSessionConfiguration(session.id)
      .then((configuration) => configuration.callStatus.finished)
      .then((callStatuses) => setStatefulState(ViewState.Content(callStatuses)))
      .catch((error) => {
        setStatefulState(ViewStateUtils.networkError(error, fetchCallStatuses))
      })
  }, [session.id])

  useEffect(() => {
    fetchCallStatuses()
  }, [fetchCallStatuses])

  usePreventGoingBack()

  const renderItem = ({ item }: ListRenderItemInfo<QuestionChoiceRowViewModel>) => {
    return <QuestionChoiceRow viewModel={item} onPress={() => setSelectedStatusCode(item.id)} />
  }

  const sendStatusCodeAndLeave = (statusCode: string) => {
    setLoading(true)
    PhoningCampaignRepository.getInstance()
      .updatePhoningSessionStatus(session.id, statusCode)
      .then(() => {
        router.replace({
          pathname: '/(tabs)/actions/phoning/session/[device]/call/failure',
          params: { device },
        })
      })
      .catch((error) => {
        AlertUtils.showNetworkAlert(error, () => sendStatusCodeAndLeave(statusCode))
      })
      .finally(() => setLoading(true))
  }

  const onAction = (statusCode: string) => {
    if (statusCode === 'answered') {
      router.replace({
        pathname: '/(tabs)/actions/phoning/session/[device]/poll/detail',
        params: { device },
      })
    } else {
      sendStatusCodeAndLeave(statusCode)
    }
  }

  const Content = (callStatuses: Array<PhoningSessionCallStatus>) => {
    const viewModel = PhonePollDetailCallStatusViewModelMapper.map(callStatuses, selectedStatusCode)

    return (
      <View style={styles.content}>
        <Stack.Screen options={{ title: campaign.title }} />
        <FlatList
          contentContainerStyle={styles.listContainer}
          bounces={false}
          data={viewModel.choices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => {
            return (
              <>
                <Text style={styles.title}>{session.adherent.info}</Text>
                <VerticalSpacer spacing={Spacing.margin} />
              </>
            )
          }}
        />
        <View style={styles.bottomContainer}>
          <PrimaryButton
            disabled={!viewModel.isActionEnabled}
            onPress={() => selectedStatusCode && onAction(selectedStatusCode)}
            title={i18n.t('phoningsession.status_picker.action')}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <StatefulView state={statefulState} contentComponent={Content} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    ...Styles.elevatedContainerStyle,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.margin,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    overflow: 'hidden', // hide the shadow on the bottom
  },
  listContainer: {
    paddingHorizontal: Spacing.margin,
  },
  title: {
    ...Typography.title,
  },
})

export default PhoneCallStatusPickerScreen
