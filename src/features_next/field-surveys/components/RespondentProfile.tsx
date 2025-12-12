import React from 'react'
import { YStack } from 'tamagui'
import { UniqueChoiceQuestion } from './FieldQuestion'
import { AgeRange } from '@/core/entities/UserProfile'

interface RespondentProfileData {
  gender: string | null
  ageRange: string | null
  profession: string | null
}

interface RespondentProfileProps {
  data: RespondentProfileData
  onChange: (data: RespondentProfileData) => void
}

const RespondentProfile: React.FC<RespondentProfileProps> = ({ data, onChange }) => {
  const handleGenderChange = (value: string | null) => {
    onChange({ ...data, gender: value })
  }

  const handleAgeRangeChange = (value: string | null) => {
    onChange({ ...data, ageRange: value })
  }

  const handleProfessionChange = (value: string | null) => {
    onChange({ ...data, profession: value })
  }

  const genderChoices = [
    { id: 'male', content: 'Masculin' },
    { id: 'female', content: 'Féminin' },
    { id: 'other', content: 'Autre' },
  ]

  const ageRangeChoices = [
    { id: 'less_than_20', content: '-20 ans' },
    { id: 'between_20_24', content: '20-24 ans' },
    { id: 'between_25_39', content: '25-39 ans' },
    { id: 'between_40_54', content: '40-54 ans' },
    { id: 'between_55_64', content: '55-64 ans' },
    { id: 'between_65_80', content: '65-80 ans' },
    { id: 'greater_than_80', content: '80+ ans' },
  ]

  const professionChoices = [
    { id: 'employees', content: 'Employé' },
    { id: 'workers', content: 'Ouvrier' },
    { id: 'managerial_staff', content: 'Cadre' },
    { id: 'intermediate_professions', content: 'Profession intermédiaire' },
    { id: 'self_contractor', content: 'Indépendant' },
    { id: 'retirees', content: 'Retraité' },
    { id: 'student', content: 'Étudiant' },
  ]

  return (
    <YStack gap="$large">
      <UniqueChoiceQuestion
        question={{
          id: 1001,
          type: 'unique_choice',
          content: 'Quelle est sa civilité ?',
          choices: genderChoices,
        }}
        value={data.gender}
        onChange={handleGenderChange}
      />

      <UniqueChoiceQuestion
        question={{
          id: 1002,
          type: 'unique_choice',
          content: 'Sa tranche d\'âge ?',
          choices: ageRangeChoices,
        }}
        value={data.ageRange}
        onChange={handleAgeRangeChange}
      />

      <UniqueChoiceQuestion
        question={{
          id: 1003,
          type: 'unique_choice',
          content: 'Sa profession ?',
          choices: professionChoices,
        }}
        value={data.profession}
        onChange={handleProfessionChange}
      />
    </YStack>
  )
}

export default RespondentProfile
export type { RespondentProfileData }
