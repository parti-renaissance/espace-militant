import { styled, TextArea, YStack } from "tamagui"
import Text from "@/components/base/Text"
import { FieldSurveyQuestion } from "@/services/field-surveys/schema"

const ChoiceItem = styled(YStack, {
  width: '100%',
  padding: '$medium',
  borderRadius: '$medium',
  backgroundColor: '$gray1',
  borderWidth: 3,
  borderColor: '$gray1',
  variants: {
    selected: {
      true: {
        backgroundColor: '$blue1',
        borderColor: '$blue4',
        hoverStyle: {
          backgroundColor: '$blue2',
        },
        pressStyle: {
          backgroundColor: '$blue2',
        },
      },
      false: {
        hoverStyle: {
          backgroundColor: '$gray2',
          borderColor: '$gray2',
        },
        pressStyle: {
          backgroundColor: '$gray2',
          borderColor: '$gray2',
        },
      }
    }
  },
})

const SimpleFieldQuestion: React.FC<{
  question: FieldSurveyQuestion
  value: string
  onChange: (value: string) => void
}> = ({ question, value, onChange }) => {
  return (
    <YStack gap="$medium">
      <Text.LG semibold>{question.content}</Text.LG>
      <TextArea
        placeholder="Votre réponse..."
        value={value}
        onChangeText={onChange}
        minHeight={100}
        backgroundColor="$gray2"
        borderColor="$gray6"
        borderRadius="$medium"
        padding="$medium"
      />
    </YStack>
  )
}

// Composant pour les questions à choix unique
const UniqueChoiceQuestion: React.FC<{
  question: FieldSurveyQuestion
  value: string | null
  onChange: (value: string | null) => void
}> = ({ question, value, onChange }) => {
  const handleChoicePress = (choiceContent: string) => {
    // Si la réponse est déjà sélectionnée, on la désélectionne
    if (value === choiceContent) {
      onChange(null)
    } else {
      onChange(choiceContent)
    }
  }

  return (
    <YStack gap="$medium">
      <Text.LG semibold>{question.content}</Text.LG>
      <YStack gap="$small">
        {question.choices.map((choice) => (
          <ChoiceItem
            key={choice.id}
            selected={value === choice.content}
            onPress={() => handleChoicePress(choice.content)}
          >
            <Text.MD semibold textAlign="center" textWrap="balance">{choice.content}</Text.MD>
          </ChoiceItem>
        ))}
      </YStack>
    </YStack>
  )
}

// Composant pour les questions à choix multiples
const MultipleChoiceQuestion: React.FC<{
  question: FieldSurveyQuestion
  value: string[]
  onChange: (value: string[]) => void
}> = ({ question, value, onChange }) => {
  const handleChoiceToggle = (choiceContent: string) => {
    const newValue = value.includes(choiceContent)
      ? value.filter(v => v !== choiceContent)
      : [...value, choiceContent]
    onChange(newValue)
  }

  return (
    <YStack gap="$medium">
      <Text.LG semibold>{question.content}</Text.LG>
      <Text.SM secondary>Vous pouvez sélectionner plusieurs réponses</Text.SM>
      <YStack gap="$small">
        {question.choices.map((choice) => (
          <ChoiceItem
            key={choice.id}
            selected={value.includes(choice.content)}
            onPress={() => handleChoiceToggle(choice.content)}
          >
            <Text.MD semibold textAlign="center" textWrap="balance">{choice.content}</Text.MD>
          </ChoiceItem>
        ))}
      </YStack>
    </YStack>
  )
}

export { SimpleFieldQuestion, UniqueChoiceQuestion, MultipleChoiceQuestion, ChoiceItem }