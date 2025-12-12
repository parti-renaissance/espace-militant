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
    <YStack flex={1}>
      <Text.LG semibold mb="$medium">{question.content}</Text.LG>
      <TextArea
        placeholder="Votre réponse"
        value={value}
        onChangeText={onChange}
        minHeight={100}
        flex={1}
        focusStyle={{
          outlineColor: '$blue4',
        }}
        borderWidth={0}
        backgroundColor="$gray1"
        borderRadius="$medium"
        padding="$medium"
        verticalAlign="top"
        style={{ textAlignVertical: 'top' }}
      />
    </YStack>
  )
}

type Question = {
  id: number;
  content?: string;
  type: "simple_field" | "unique_choice" | "multiple_choice";
  choices: {
    id: number | string;
    content: string;
  }[];
}

const UniqueChoiceQuestion: React.FC<{
  question: Question
  value: string | null
  onChange: (value: string | null) => void
}> = ({ question, value, onChange }) => {
  const handleChoicePress = (choice: string) => {
    // Si la réponse est déjà sélectionnée, on la désélectionne
    if (value === choice) {
      onChange(null)
    } else {
      onChange(choice)
    }
  }

  return (
    <YStack gap="$medium">
      <Text.LG semibold>{question.content}</Text.LG>
      <YStack gap="$small">
        {question.choices.map((choice) => (
          <ChoiceItem
            key={choice.id}
            selected={value === String(choice.id)}
            onPress={() => handleChoicePress(String(choice.id))}
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
  const handleChoiceToggle = (choice: string) => {
    const newValue = value.includes(choice)
      ? value.filter(v => v !== choice)
      : [...value, choice]
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
            selected={value.includes(String(choice.id))}
            onPress={() => handleChoiceToggle(String(choice.id))}
          >
            <Text.MD semibold textAlign="center" textWrap="balance">{choice.content}</Text.MD>
          </ChoiceItem>
        ))}
      </YStack>
    </YStack>
  )
}

export { SimpleFieldQuestion, UniqueChoiceQuestion, MultipleChoiceQuestion, ChoiceItem }