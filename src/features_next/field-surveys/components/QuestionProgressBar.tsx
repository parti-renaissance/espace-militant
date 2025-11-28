import Text from "@/components/base/Text"
import { FieldSurveyQuestion } from "@/services/field-surveys/schema"
import { styled, YStack } from "tamagui"

const ProgressBar = styled(YStack, {
  height: 8,
  backgroundColor: '$blue1',
  borderRadius: '$small',
  overflow: 'hidden',
})

const ProgressFill = styled(YStack, {
  height: '100%',
  backgroundColor: '$blue4',
  borderRadius: '$small',
  transition: 'width 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
})

const QuestionProgressBar: React.FC<{
  questions: FieldSurveyQuestion[]
  currentIndex: number
  totalSteps?: number
}> = ({ questions, currentIndex, totalSteps }) => {
  const total = totalSteps || questions.length
  const progressPercentage = ((currentIndex + 1) / total) * 100
  
  const stepTitle = 
    currentIndex === total - 1 ? ' : Données personnelles' :
    currentIndex === total - 2 ? ' : Profil du répondant' : ''

  return (
    <YStack gap="$small">
      <Text.MD>
        Étape {currentIndex + 1}/{total}{stepTitle}
      </Text.MD>
      <ProgressBar>
        <ProgressFill width={`${progressPercentage}%`} />
      </ProgressBar>
    </YStack>
  )
}

export default QuestionProgressBar