import { NavigationProp, ParamListBase } from '@react-navigation/native'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { Poll } from '../../../../core/entities/Poll'
import { PollExtraQuestionPage } from '../../../../core/entities/PollExtraQuestion'
import DoorToDoorRepository from '../../../../data/DoorToDoorRepository'
import { TunnelDoorPollScreenRouteProp } from '../../../../navigation'
import { Colors, Spacing } from '../../../../styles'
import PollDetailNavigationButtons from '../../../pollDetail/PollDetailNavigationButtons'
import { PollDetailNavigationButtonsViewModelMapper } from '../../../pollDetail/PollDetailNavigationButtonsViewModelMapper'
import PollDetailProgressBar from '../../../pollDetail/PollDetailProgressBar'
import { PollDetailProgressBarViewModelMapper } from '../../../pollDetail/PollDetailProgressBarViewModelMapper'
import { CompoundPollDetailComponentProvider } from '../../../pollDetail/providers/CompoundPollDetailComponentProvider'
import { PollDetailComponentProvider } from '../../../pollDetail/providers/PollDetailComponentProvider'
import { PollDetailRemoteQuestionComponentProvider } from '../../../pollDetail/providers/PollDetailRemoteQuestionComponentProvider'
import LoadingOverlay from '../../../shared/LoadingOverlay'
import { DoorToDoorPollResult } from './DoorToDoorQuestionResult'
import { DoorToDoorQualificationComponentProvider } from './providers/DoorToDoorQualificationComponentProvider'

type Props = Readonly<{
  poll: Poll
  qualification: Array<PollExtraQuestionPage>
  route: TunnelDoorPollScreenRouteProp
  navigation: NavigationProp<ParamListBase>
}>

const DoorToDoorPollDetailScreenLoaded: FunctionComponent<Props> = ({
  qualification,
  poll,
  navigation,
  route,
}) => {
  const [currentStep, setStep] = useState<number>(0)
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const [provider] = useState<
    PollDetailComponentProvider<DoorToDoorPollResult>
  >(
    new CompoundPollDetailComponentProvider(
      new PollDetailRemoteQuestionComponentProvider(poll, forceUpdate),
      new DoorToDoorQualificationComponentProvider(qualification, forceUpdate),
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
    const result = provider.getResult()
    DoorToDoorRepository.getInstance()
      .sendDoorToDoorPoll(
        {
          campaignId: route.params.campaignId,
          buildingId: route.params.buildingParams.id,
          interlocutorStatus: route.params.interlocutorStatus,
          block: route.params.buildingParams.block,
          floor: route.params.buildingParams.floor,
          door: route.params.buildingParams.door,
        },
        result,
      )
      .then(() => {
        navigation.dangerouslyGetParent()?.goBack()
      })
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
            style={styles.questionList}
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
  questionList: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
  },
})

export default DoorToDoorPollDetailScreenLoaded
