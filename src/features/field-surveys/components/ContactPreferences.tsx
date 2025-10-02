import React from 'react'
import { YStack } from 'tamagui'
import { UniqueChoiceQuestion } from './FieldQuestion'
import Text from '@/components/base/Text'
import VoxInput from '@/components/base/Input/Input'

interface ContactPreferencesData {
  wantsToStayInformed: string | null
  firstName: string
  lastName: string
  emailAddress: string
}

interface ContactPreferencesProps {
  data: ContactPreferencesData
  onChange: (data: ContactPreferencesData) => void
}

const ContactPreferences: React.FC<ContactPreferencesProps> = ({ data, onChange }) => {
  const handleWantsToStayInformedChange = (value: string | null) => {
    onChange({ ...data, wantsToStayInformed: value })
  }

  const handleFirstNameChange = (value: string) => {
    onChange({ ...data, firstName: value })
  }

  const handleLastNameChange = (value: string) => {
    onChange({ ...data, lastName: value })
  }

  const handleEmailChange = (value: string) => {
    onChange({ ...data, emailAddress: value })
  }

  const wantsToStayInformedChoices = [
    { id: 1, content: 'Oui' },
    { id: 2, content: 'Non' },
  ]

  return (
    <YStack gap="$large">
      <UniqueChoiceQuestion
        question={{
          id: 2001,
          type: 'unique_choice',
          content: 'Souhaite-t-il être tenu au courant des résultats de ce questionnaire par e-mail ?',
          choices: wantsToStayInformedChoices,
        }}
        value={data.wantsToStayInformed}
        onChange={handleWantsToStayInformedChange}
      />

      {data.wantsToStayInformed === "1" && (
        <YStack gap="$medium">
          <Text.LG semibold>Informations personnelles</Text.LG>
          
          <VoxInput
            placeholder="Prénom"
            value={data.firstName}
            onChangeText={handleFirstNameChange}
            color="gray"
          />

          <VoxInput
            placeholder="Nom"
            value={data.lastName}
            onChangeText={handleLastNameChange}
            color="gray"
          />

          <VoxInput
            placeholder="Adresse email"
            value={data.emailAddress}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            color="gray"
          />
        </YStack>
      )}
    </YStack>
  )
}

export default ContactPreferences
export type { ContactPreferencesData }
