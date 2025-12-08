import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { PhonePollResult } from '../../core/entities/PhonePollResult'
import { PhoningSatisfactionQuestion } from '../../core/entities/PhoningSessionConfiguration'
import { Poll } from '../../core/entities/Poll'
import { SendPhonePollAnswersInteractor } from '../../core/interactor/SendPhonePollAnswersInteractor'
import { Colors, Spacing } from '../../styles'
import PollDetailNavigationButtons from '../pollDetail/PollDetailNavigationButtons'
import { PollDetailNavigationButtonsViewModelMapper } from '../pollDetail/PollDetailNavigationButtonsViewModelMapper'
import PollDetailProgressBar from '../pollDetail/PollDetailProgressBar'
import { PollDetailProgressBarViewModelMapper } from '../pollDetail/PollDetailProgressBarViewModelMapper'
import { CompoundPollDetailComponentProvider } from '../pollDetail/providers/CompoundPollDetailComponentProvider'
import { PollDetailComponentProvider } from '../pollDetail/providers/PollDetailComponentProvider'
import { PollDetailRemoteQuestionComponentProvider } from '../pollDetail/providers/PollDetailRemoteQuestionComponentProvider'
import { AlertUtils } from '../shared/AlertUtils'
import LoadingOverlay from '../shared/LoadingOverlay'
import { PhonePollDetailSatisfactionComponentProvider } from './providers/PhonePollDetailSatisfactionComponentProvider'
import { useCampaignStore, useSessionStore } from '@/data/store/phoning'
import { router, useLocalSearchParams } from 'expo-router'

type Props = Readonly<{
  poll: Poll
  satisfactionQuestions: Array<PhoningSatisfactionQuestion>
}>

const PhonePollDetailScreenLoaded: FunctionComponent<Props> = ({
  poll,
  satisfactionQuestions,
}) => {
  const navigation = useNavigation()
  const { campaign } = useCampaignStore()
  const { device } = useLocalSearchParams<{ device: 'current' | 'external' }>()
  const { session } = useSessionStore()
  const [currentStep, setStep] = useState<number>(0)
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const [provider] = useState<PollDetailComponentProvider<PhonePollResult>>(
    new CompoundPollDetailComponentProvider(
      new PollDetailRemoteQuestionComponentProvider(poll, forceUpdate),
      new PhonePollDetailSatisfactionComponentProvider(
        satisfactionQuestions,
        forceUpdate,
      ),
    ),
  )

  const [isLoading, setIsLoading] = useState(false)

  const progressViewModel = PollDetailProgressBarViewModelMapper.map(
    currentStep,
    provider.getNumberOfSteps(),
    provider.getStepType(currentStep),
  )
  const isNextStepAvailable = () => {
    return currentStep < provider.getNumberOfSteps() - 1
  }
  const isPreviousStepAvailable = () => {
    return currentStep > 0
  }
  const navigationViewModel = PollDetailNavigationButtonsViewModelMapper.map(
    isPreviousStepAvailable(),
    isNextStepAvailable(),
    provider.isDataComplete(currentStep),
  )

  const [pageWidth, setPageWidth] = useState<number>(0)
  const flatListViewRef = useRef<FlatList>(null)

  useEffect(() => {
    flatListViewRef.current?.scrollToIndex({
      animated: true,
      index: currentStep,
    })
  }, [currentStep])

  const postAnswers = () => {
    setIsLoading(true)
    new SendPhonePollAnswersInteractor()
      .execute(poll, session.id, provider.getResult())
      .then(() => {
        router.replace({
          pathname: '/old/actions/phoning/session/[device]/poll/success',
          params: { device }
        })
      })
      .catch((error) => {
        AlertUtils.showNetworkAlert(error, postAnswers)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <View style={styles.content}>
        <PollDetailProgressBar
          style={styles.progress}
          viewModel={progressViewModel}
        />
        <View
          style={styles.questionContainer}
          onLayout={(event) => {
            setPageWidth(event.nativeEvent.layout.width)
          }}
        >
          <FlatList
            ref={flatListViewRef}
            scrollEnabled={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[...Array(provider.getNumberOfSteps()).keys()]}
            renderItem={({ item }) => {
              return (
                <View key={item} style={{ width: pageWidth }}>
                  {provider.getStepComponent(item)}
                </View>
              )
            }}
            extraData={provider}
            getItemLayout={(_data, index) => {
              return { length: pageWidth, offset: pageWidth * index, index }
            }}
            snapToInterval={pageWidth}
            keyExtractor={(item) => item.toString()}
            windowSize={5}
          />
        </View>
        <PollDetailNavigationButtons
          viewModel={navigationViewModel}
          onPrevious={() => setStep(currentStep - 1)}
          onNext={() => setStep(currentStep + 1)}
          onSubmit={postAnswers}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    overflow: 'hidden', // hide the shadow on the bottom
  },
  progress: {
    paddingHorizontal: Spacing.margin,
  },
  questionContainer: {
    flexGrow: 1,
  },
})

export default PhonePollDetailScreenLoaded
