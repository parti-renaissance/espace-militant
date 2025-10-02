import React, { useState, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { ImageBackground } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { XStack, YStack, styled, useMedia, TextArea } from 'tamagui'
import { ArrowLeft, Check, ArrowRight } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useFieldSurvey, useSubmitFieldSurveyAnswers } from '@/services/field-surveys/hook'
import { FieldSurveyQuestion } from '@/services/field-surveys/schema'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { VoxHeader } from '@/components/Header/Header'
import { MultipleChoiceQuestion, SimpleFieldQuestion, UniqueChoiceQuestion } from '../components/FieldQuestion'
import QuestionProgressBar from '../components/QuestionProgressBar'

// Types pour les réponses
interface Answer {
  surveyQuestion: number
  textField?: string
  selectedChoices?: string[]
}

interface QuestionAnswer {
  questionId: number
  answer: Answer
}


const Container = styled(YStack, {
  flex: 1,
  paddingBottom: '$xxlarge',
})

const ContentWrapper = styled(YStack, {
  maxWidth: 780,
  width: '100%',
  alignSelf: 'center',
  paddingHorizontal: '$medium',
  transform: 'translateY(-128px)',
  gap: '$medium',
  $sm: {
    gap: 0,
    paddingHorizontal: 0,
    marginTop: '0px',
    transform: 'translateY(-48px)'
  },
})

const FieldSurveyDetailsPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])

  const { data: survey, isLoading, error } = useFieldSurvey(id || '')
  const submitAnswers = useSubmitFieldSurveyAnswers()

  const currentQuestion = useMemo(() => {
    if (!survey) return null
    return survey.questions[currentQuestionIndex]
  }, [survey, currentQuestionIndex])

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return null
    return answers.find(a => a.questionId === currentQuestion.id)
  }, [answers, currentQuestion])

  const isLastQuestion = useMemo(() => {
    if (!survey) return false
    return currentQuestionIndex === survey.questions.length - 1
  }, [survey, currentQuestionIndex])

  const isFirstQuestion = currentQuestionIndex === 0

  const handleAnswerChange = (questionId: number, answer: Answer) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId)
      if (existingIndex >= 0) {
        const newAnswers = [...prev]
        newAnswers[existingIndex] = { questionId, answer }
        return newAnswers
      }
      return [...prev, { questionId, answer }]
    })
  }

  const handleNext = () => {
    if (!survey) return

    if (isLastQuestion) {
      // Soumettre les réponses
      handleSubmit()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!survey) return

    const formattedAnswers = answers.map(a => a.answer).filter(answer =>
      answer.textField !== undefined || (answer.selectedChoices && answer.selectedChoices.length > 0)
    ).map(answer => {
      if (answer.textField !== undefined) {
        return { surveyQuestion: answer.surveyQuestion, textField: answer.textField }
      } else {
        return { surveyQuestion: answer.surveyQuestion, selectedChoices: answer.selectedChoices! }
      }
    })

    try {
      await submitAnswers.mutateAsync({
        survey: survey.id,
        type: survey.type,
        agreedToStayInContact: true,
        agreedToTreatPersonalData: true,
        answers: formattedAnswers,
      })

      // Navigation vers la page de succès
      router.push({
        pathname: '/questionnaires/[id]/success',
        params: { id: survey.uuid }
      })
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'simple_field':
        return (
          <SimpleFieldQuestion
            question={currentQuestion}
            value={currentAnswer?.answer.textField || ''}
            onChange={(value) => handleAnswerChange(currentQuestion.id, {
              surveyQuestion: currentQuestion.id,
              textField: value
            })}
          />
        )

      case 'unique_choice':
        return (
          <UniqueChoiceQuestion
            question={currentQuestion}
            value={currentAnswer?.answer.selectedChoices?.[0] || null}
            onChange={(value) => {
              if (value === null) {
                // Supprimer la réponse si elle est désélectionnée
                setAnswers(prev => prev.filter(a => a.questionId !== currentQuestion.id))
              } else {
                handleAnswerChange(currentQuestion.id, {
                  surveyQuestion: currentQuestion.id,
                  selectedChoices: [value]
                })
              }
            }}
          />
        )

      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            value={currentAnswer?.answer.selectedChoices || []}
            onChange={(value) => handleAnswerChange(currentQuestion.id, {
              surveyQuestion: currentQuestion.id,
              selectedChoices: value
            })}
          />
        )

      default:
        return null
    }
  }

  const LoadingState = () => (
    <VoxCard>
      <VoxCard.Content>
        <YStack gap="$medium">
          <SkeCard.Line width={200} />
          <SkeCard.Separator />
          <SkeCard.Title />
          <SkeCard.Title />
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )

  const ErrorState = () => (
    <VoxCard>
      <VoxCard.Content>
        <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$medium">
          <Text.LG color="$red10">Erreur de chargement</Text.LG>
          <Text.SM color="$gray10" textAlign="center">
            Impossible de charger le questionnaire. Vérifiez votre connexion internet.
          </Text.SM>
          <YStack>
            <VoxButton variant="outlined" iconLeft={ArrowLeft} onPress={() => router.back()}>
              Retour
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )

  const NavigationButtons = () => (
    <XStack 
      gap="$medium" 
      justifyContent="space-between" 
      pt="$medium" 
      px={media.sm ? '$medium' : 0}
      pb={media.sm ? Math.max(16, Math.min(insets.bottom, 80)) : 0}
      backgroundColor="white" 
      borderTopWidth={1} 
      borderTopColor="$textOutline20"
    >
      <VoxButton
        variant="soft"
        iconLeft={ArrowLeft}
        onPress={handlePrevious}
        display={isFirstQuestion ? 'none' : 'flex'}
        flex={media.sm ? undefined : 1}
        shrink={media.sm}
        size="xl"
      >
        Précédent
      </VoxButton>

      <VoxButton
        variant="contained"
        theme="blue"
        iconRight={isLastQuestion ? Check : ArrowRight}
        onPress={handleNext}
        flex={1}
        size="xl"
      >
        {isLastQuestion ? 'Terminer' : 'Suivant'}
      </VoxButton>
    </XStack>
  )

  return (
    <YStack flex={1} backgroundColor={media.sm ? 'white' : '$textSurface'}>
      { media.sm ? (
        <VoxHeader alignItems="center" justifyContent="center">
          <VoxHeader.Title>Questionnaire</VoxHeader.Title>
        </VoxHeader>
      ) : null }
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: media.sm ? 80 : 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {media.gtSm ? <ImageBackground source={require('../assets/bg-surveys.png')} style={{ height: media.sm ? 250 : 350, width: '100%' }} /> : null}
          <ContentWrapper>
            {isLoading && <LoadingState />}
            {error && <ErrorState />}
            {!survey && !isLoading && !error && <ErrorState />}
            {survey && !error && !isLoading && (
              <VoxCard inside={media.sm ? true : false} borderWidth={media.sm ? 0 : 1} shadowColor={media.sm ? 'transparent' : undefined} elevation={media.sm ? 0 : undefined} bg={media.sm ? 'transparent' : 'white'}>
                <VoxCard.Content gap="$large">
                  <Text.MD secondary mb="$small">{survey.name}</Text.MD>
                  <QuestionProgressBar
                    questions={survey.questions}
                    currentIndex={currentQuestionIndex}
                  />
                  {renderQuestion()}
                  {media.gtSm && (
                    <NavigationButtons />
                  )}
                </VoxCard.Content>
              </VoxCard>
            )}
          </ContentWrapper>
        </Container>
      </ScrollView>
      
      {media.sm && survey && !error && !isLoading && (
        <NavigationButtons />
      )}
    </YStack>
  )
}

export default FieldSurveyDetailsPage
