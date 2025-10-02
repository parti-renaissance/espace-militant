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
  transition: 'width 0.3s ease',
})

const QuestionProgressBar: React.FC<{
  questions: FieldSurveyQuestion[]
  currentIndex: number
  totalSteps?: number
}> = ({ questions, currentIndex, totalSteps }) => {
  const total = totalSteps || questions.length
  const progressPercentage = ((currentIndex + 1) / total) * 100

  return (
    <YStack gap="$small">
      <Text.MD>
        Étape {currentIndex + 1}/{total}
      </Text.MD>
      <ProgressBar>
        <ProgressFill width={`${progressPercentage}%`} />
      </ProgressBar>
    </YStack>
  )
}

export default QuestionProgressBar