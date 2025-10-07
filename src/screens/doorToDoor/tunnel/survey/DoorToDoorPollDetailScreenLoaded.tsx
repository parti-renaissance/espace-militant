import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BuildingSelectedParams } from '@/data/store/SendDoorToDoorPollAnswersJobQueue'
import { router } from 'expo-router'
import { Poll } from '../../../../core/entities/Poll'
import { PollExtraQuestionPage } from '../../../../core/entities/PollExtraQuestion'
import { SendDoorPollAnswersInteractor } from '../../../../core/interactor/SendDoorPollAnswersInteractor'
import { Colors, Spacing } from '../../../../styles'
import PollDetailNavigationButtons from '../../../pollDetail/PollDetailNavigationButtons'
import { PollDetailNavigationButtonsViewModelMapper } from '../../../pollDetail/PollDetailNavigationButtonsViewModelMapper'
import PollDetailProgressBar from '../../../pollDetail/PollDetailProgressBar'
import { PollDetailProgressBarViewModelMapper } from '../../../pollDetail/PollDetailProgressBarViewModelMapper'
import { CompoundPollDetailComponentProvider } from '../../../pollDetail/providers/CompoundPollDetailComponentProvider'
import { PollDetailComponentProvider } from '../../../pollDetail/providers/PollDetailComponentProvider'
import { PollDetailRemoteQuestionComponentProvider } from '../../../pollDetail/providers/PollDetailRemoteQuestionComponentProvider'
import { AlertUtils } from '../../../shared/AlertUtils'
import KeyboardOffsetView from '../../../shared/KeyboardOffsetView'
import LoadingOverlay from '../../../shared/LoadingOverlay'
import { DoorToDoorPollResult } from './DoorToDoorQuestionResult'
import { DoorToDoorQualificationComponentProvider } from './providers/DoorToDoorQualificationComponentProvider'

type Props = Readonly<{
  poll: Poll
  qualification: Array<PollExtraQuestionPage>
  interlocutorStatus: string
  campaignId: string
  buildingParams: BuildingSelectedParams
  visitStartDateISOString: string
}>

const DoorToDoorPollDetailScreenLoaded: FunctionComponent<Props> = ({
  qualification,
  poll,
  campaignId,
  interlocutorStatus,
  buildingParams,
  visitStartDateISOString,
}) => {
  const [currentStep, setStep] = useState<number>(0)
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const [provider] = useState<PollDetailComponentProvider<DoorToDoorPollResult>>(
    new CompoundPollDetailComponentProvider(
      new PollDetailRemoteQuestionComponentProvider(poll, forceUpdate),
      new DoorToDoorQualificationComponentProvider(qualification, forceUpdate),
    ),
  )

  const [isLoading, setIsLoading] = useState(false)

  const progressViewModel = PollDetailProgressBarViewModelMapper.map(currentStep, provider.getNumberOfSteps(), provider.getStepType(currentStep))
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
    new SendDoorPollAnswersInteractor()
      .execute({
        campaignId,
        doorStatus: interlocutorStatus,
        buildingParams,
        pollResult: result,
        visitStartDateISOString,
      })
      .then(() => {
        router.replace('/porte-a-porte/tunnel/success')
      })
      .catch((error) => {
        AlertUtils.showNetworkAlert(error, postAnswers)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <KeyboardAvoidingView 
      style={styles.content} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <PollDetailProgressBar style={styles.progress} viewModel={progressViewModel} />
        <View
          style={styles.questionContainer}
          onLayout={(event) => {
            setPageWidth(event.nativeEvent.layout.width)
          }}
        >
          <KeyboardOffsetView>
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
              keyboardShouldPersistTaps="handled"
            />
          </KeyboardOffsetView>
        </View>
        <PollDetailNavigationButtons
          viewModel={navigationViewModel}
          onPrevious={() => setStep(currentStep - 1)}
          onNext={() => setStep(currentStep + 1)}
          onSubmit={postAnswers}
        />
      </KeyboardAvoidingView>
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
})

export default DoorToDoorPollDetailScreenLoaded
