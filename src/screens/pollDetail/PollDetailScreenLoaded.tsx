import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Poll } from '../../core/entities/Poll'
import { PollResult } from '../../core/entities/PollResult'
import PollsRepository from '../../data/PollsRepository'
import { PollDetailModalNavigatorScreenProps } from '../../navigation/pollDetailModal/PollDetailModalNavigatorScreenProps'
import { Colors, Spacing } from '../../styles'
import { LocationManager } from '../../utils/LocationManager'
import { AlertUtils } from '../shared/AlertUtils'
import LoadingOverlay from '../shared/LoadingOverlay'
import PollDetailNavigationButtons from './PollDetailNavigationButtons'
import { PollDetailNavigationButtonsViewModelMapper } from './PollDetailNavigationButtonsViewModelMapper'
import PollDetailProgressBar from './PollDetailProgressBar'
import { PollDetailProgressBarViewModelMapper } from './PollDetailProgressBarViewModelMapper'
import { CompoundPollDetailComponentProvider } from './providers/CompoundPollDetailComponentProvider'
import { PollDetailComponentProvider } from './providers/PollDetailComponentProvider'
import { PollDetailRemoteQuestionComponentProvider } from './providers/PollDetailRemoteQuestionComponentProvider'
import { PollDetailUserInformationsComponentProvider } from './providers/PollDetailUserInformationsComponentProvider'
import { router } from 'expo-router'

type Props = Readonly<{
  poll: Poll
}>

const PollDetailScreenLoaded: FunctionComponent<Props> = ({ poll }) => {
  const navigation =
    useNavigation<
      PollDetailModalNavigatorScreenProps<'PollDetail'>['navigation']
    >()
  const [currentStep, setStep] = useState<number>(0)
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const [provider] = useState<PollDetailComponentProvider<PollResult>>(
    new CompoundPollDetailComponentProvider(
      new PollDetailRemoteQuestionComponentProvider(poll, forceUpdate),
      new PollDetailUserInformationsComponentProvider(forceUpdate),
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

  const postAnswers = async () => {
    setIsLoading(true)

    const location = await LocationManager.getLatestLocation()
    PollsRepository.getInstance()
      .sendPollAnswers(poll, provider.getResult(), location)
      .then(() => {
        router.replace({ pathname: '/questionnaires/[id]/success', params: { id: poll.uuid, title: poll.name } })

      })
      .catch((error) => {
        AlertUtils.showNetworkAlert(error, postAnswers)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={styles.content}>
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
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <PollDetailNavigationButtons
            viewModel={navigationViewModel}
            onPrevious={() => setStep(currentStep - 1)}
            onNext={() => setStep(currentStep + 1)}
            onSubmit={postAnswers}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
    paddingTop: 16,
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
    width: '100%',
    maxWidth: 520,
    marginHorizontal: 'auto',
  },
})

export default PollDetailScreenLoaded
