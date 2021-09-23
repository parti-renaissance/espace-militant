import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Text,
  StyleSheet,
  ListRenderItemInfo,
  FlatList,
  View,
  Alert,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { PhoningSessionCallStatus } from '../../core/entities/PhoningSessionConfiguration'
import PhoningCampaignRepository from '../../data/PhoningCampaignRepository'
import { PhoneCallStatusPickerScreenProps, Screen } from '../../navigation'
import { Colors, Spacing, Styles, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { PhonePollDetailCallStatusViewModelMapper } from '../phonePollDetail/PhonePollDetailCallStatusViewModelMapper'
import QuestionChoiceRow from '../pollDetail/QuestionChoiceRow'
import { QuestionChoiceRowViewModel } from '../pollDetail/QuestionChoiceRowViewModel'
import { PrimaryButton } from '../shared/Buttons'
import { GenericErrorMapper } from '../shared/ErrorMapper'
import LoadingOverlay from '../shared/LoadingOverlay'
import { VerticalSpacer } from '../shared/Spacer'
import { StatefulView, ViewState } from '../shared/StatefulView'
import { usePreventGoingBack } from '../shared/usePreventGoingBack.hook'

const PhoneCallStatusPickerScreen: FunctionComponent<PhoneCallStatusPickerScreenProps> = ({
  navigation,
  route,
}) => {
  const [statefulState, setStatefulState] = useState<
    ViewState.Type<Array<PhoningSessionCallStatus>>
  >(new ViewState.Loading())

  const [selectedStatusCode, setSelectedStatusCode] = useState<string>()
  const [isLoading, setLoading] = useState(false)

  const fetchCallStatuses = useCallback(() => {
    const sessionId = route.params.data.sessionId
    PhoningCampaignRepository.getInstance()
      .getPhoningSessionConfiguration(sessionId)
      .then((configuration) => configuration.callStatus.finished)
      .then((callStatuses) =>
        setStatefulState(new ViewState.Content(callStatuses)),
      )
      .catch((error) => {
        setStatefulState(
          new ViewState.Error(GenericErrorMapper.mapErrorMessage(error), () => {
            fetchCallStatuses()
          }),
        )
      })
  }, [route.params.data.sessionId])

  useEffect(
    () => navigation.setOptions({ title: route.params.data.campaignTitle }),
    [navigation, route.params.data.campaignTitle],
  )

  useEffect(() => {
    fetchCallStatuses()
  }, [fetchCallStatuses])

  usePreventGoingBack()

  const renderItem = ({
    item,
  }: ListRenderItemInfo<QuestionChoiceRowViewModel>) => {
    return (
      <QuestionChoiceRow
        viewModel={item}
        onPress={() => setSelectedStatusCode(item.id)}
      />
    )
  }

  const displayError = (error: string, statusCode: string) => {
    Alert.alert(
      i18n.t('common.error_title'),
      error,
      [
        {
          text: i18n.t('common.error_retry'),
          onPress: () => sendStatusCodeAndLeave(statusCode),
        },
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }

  const sendStatusCodeAndLeave = (statusCode: string) => {
    setLoading(true)
    PhoningCampaignRepository.getInstance()
      .updatePhoningSessionStatus(route.params.data.sessionId, statusCode)
      .then(() => {
        navigation.replace(Screen.phoneCallFailure, {
          data: route.params.data,
        })
      })
      .catch((error) => {
        displayError(GenericErrorMapper.mapErrorMessage(error), statusCode)
      })
      .finally(() => setLoading(true))
  }

  const onAction = (statusCode: string) => {
    if (statusCode === 'answered') {
      navigation.replace(Screen.phonePollDetail, {
        data: route.params.data,
      })
    } else {
      sendStatusCodeAndLeave(statusCode)
    }
  }

  const Content = (callStatuses: Array<PhoningSessionCallStatus>) => {
    const viewModel = PhonePollDetailCallStatusViewModelMapper.map(
      callStatuses,
      selectedStatusCode,
    )

    return (
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          bounces={false}
          data={viewModel.choices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => {
            return (
              <>
                <Text style={styles.title}>
                  {route.params.data.adherent.info}
                </Text>
                <VerticalSpacer spacing={Spacing.margin} />
                <Text style={styles.title}>
                  {i18n.t('phoningsession.status_picker.title')}
                </Text>
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
