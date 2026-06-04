import type { ReactNode } from 'react'
import { Text, YStack } from 'tamagui'

import Title from './Title'

export default {
  title: 'Title',
}

function StoryWrapper({ label, children }: { label: string; children: ReactNode }) {
  return (
    <YStack gap="$small" alignItems="flex-start">
      <Text fontSize={12} color="$textSecondary">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

export function TousLesAgencements() {
  return (
    <YStack padding="$medium" gap="$xlarge" alignItems="flex-start">
      <StoryWrapper label="H1 · Texte · Highlight · Texte">
        <Title size="h1" aria-label="Rejoignez l'événement près de chez vous">
          <Title.Text>Rejoignez </Title.Text>
          <Title.Highlight>l’événement</Title.Highlight>
          <Title.Text> près de chez vous</Title.Text>
        </Title>
      </StoryWrapper>

      <StoryWrapper label="H2 · Texte · Highlight · Texte">
        <Title size="h2" aria-label="Rejoignez l'événement près de chez vous">
          <Title.Text>Rejoignez </Title.Text>
          <Title.Highlight>l’événement</Title.Highlight>
          <Title.Text> près de chez vous</Title.Text>
        </Title>
      </StoryWrapper>

      <StoryWrapper label="H1 · Highlight · Texte">
        <Title size="h1" aria-label="Ensemble pour la France">
          <Title.Highlight>Ensemble</Title.Highlight>
          <Title.Text> pour la France</Title.Text>
        </Title>
      </StoryWrapper>

      <StoryWrapper label="H1 · Texte · Highlight">
        <Title size="h1" aria-label="Mobilisez-vous maintenant">
          <Title.Text>Mobilisez-vous </Title.Text>
          <Title.Highlight>maintenant</Title.Highlight>
        </Title>
      </StoryWrapper>

      <StoryWrapper label="H1 · Ligne 1 : texte + highlight · Ligne 2 : highlight seul">
        <Title size="h1" aria-label="Trouvez l'événement. Qui vous convient">
          <Title.Text>Trouvez </Title.Text>
          <Title.Highlight>l’événement</Title.Highlight>
          <Title.Break />
          <Title.Highlight>Qui vous convient</Title.Highlight>
        </Title>
      </StoryWrapper>

      <StoryWrapper label="H2 · Highlight · Texte · Highlight">
        <Title size="h2" aria-label="Agissez localement aujourd'hui">
          <Title.Highlight>Agissez</Title.Highlight>
          <Title.Text> localement </Title.Text>
          <Title.Highlight>aujourd’hui</Title.Highlight>
        </Title>
      </StoryWrapper>
    </YStack>
  )
}
