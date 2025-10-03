import React from 'react'
import { YStack } from 'tamagui'
import { UniqueChoiceQuestion } from './FieldQuestion'
import Text from '@/components/base/Text'
import VoxInput from '@/components/base/Input/Input'
import { Link } from 'expo-router'

interface ContactPreferencesData {
  wantsToStayInformed: string | null
  firstName: string
  lastName: string
  emailAddress: string
  postalCode: string
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

  const handlePostalCodeChange = (value: string) => {
    onChange({ ...data, postalCode: value })
  }

  const wantsToStayInformedChoices = [
    { id: 1, content: 'Oui' },
    { id: 2, content: 'Non' },
  ]

  return (
    <YStack gap="$large">
      <YStack gap="$medium">
        <YStack gap="$small">
          <Text.LG semibold>Souhaite-t-il être tenu au courant des résultats de ce questionnaire par e-mail ?</Text.LG>
          <Text.MD color="$gray6">
            En cochant OUI, vous consentez à ce que vos données personnelles soient traitées par Renaissance dans le cadre de cette consultation et conformément à la politique de protection des données que vous pouvez consulter.
          </Text.MD>
          <Text.MD color="$blue4" textDecorationLine="underline">
            <Link href="https://app.parti-renaissance.fr/politique-de-protection-des-donnees" target="_blank" style={{ textDecorationLine: 'underline', color: '#4D85BE' }}>La politique de données de Renaissance.</Link>
          </Text.MD>
        </YStack>

        <UniqueChoiceQuestion
          question={{
            id: 2001,
            type: 'unique_choice',
            // content: 'Souhaite-t-il être tenu au courant des résultats de ce questionnaire par e-mail ?',
            choices: wantsToStayInformedChoices,
          }}
          value={data.wantsToStayInformed}
          onChange={handleWantsToStayInformedChange}
        />
      </YStack>

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

          <VoxInput
            placeholder="Code postal"
            value={data.postalCode}
            onChangeText={handlePostalCodeChange}
            keyboardType="numeric"
            color="gray"
          />
        </YStack>
      )}
    </YStack>
  )
}

export default ContactPreferences
export type { ContactPreferencesData }
