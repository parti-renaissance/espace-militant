import type { ComponentType, ReactNode } from 'react'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'
import { SignupEngagementCard } from '@/features_next/signup/components/SignupDesktopLayout'
import { PronoSignupCard } from '@/features_next/prono/components/PronoSignupCard'

import { ToiPresidentEngagementCard } from './components/ToiPresidentEngagementCard'

export type InscriptionConfigItem = {
  TitleComponent: ReactNode
  SubtitleComponent: ReactNode
  EngagementComponent: ComponentType | null
}

const INSCRIPTION_TITLE = (
  <Title>
    <Title.Text>On fait </Title.Text>
    <Title.Highlight>connaissance</Title.Highlight>
    <Title.Text>?</Title.Text>
  </Title>
)

const PRONO_TITLE = (
  <Title>
    <Title.Text>LE DÉFI </Title.Text>
    <Title.Highlight>EST LANCÉ</Title.Highlight>
    <Title.Text> ⚽</Title.Text>
  </Title>
)

export const INSCRIPTION_CONFIG: Record<string, InscriptionConfigItem> = {
  default: {
    TitleComponent: INSCRIPTION_TITLE,
    SubtitleComponent: (
      <Text.LG regular>
        Quelques infos pour <Text.LG semibold>personnaliser votre app.</Text.LG>
      </Text.LG>
    ),
    EngagementComponent: SignupEngagementCard,
  },
  generic: {
    TitleComponent: INSCRIPTION_TITLE,
    SubtitleComponent: <Text.LG regular>Pour accéder à cette fonctionnalité, il vous faudra d’abord créer un compte. Cela ne prendra qu’un instant.</Text.LG>,
    EngagementComponent: null,
  },
  '/idees/toi-president': {
    TitleComponent: INSCRIPTION_TITLE,
    SubtitleComponent: <Text.LG regular>Pour accéder à Toi Président, il vous faudra d’abord créer un compte. Cela ne prendra qu’un instant.</Text.LG>,
    EngagementComponent: ToiPresidentEngagementCard,
  },
  '/prono/jouer': {
    TitleComponent: PRONO_TITLE,
    SubtitleComponent: <Text.LG regular>Inscrivez-vous vite pour découvrir si votre pronostic fera la différence face à Gabriel Attal.</Text.LG>,
    EngagementComponent: PronoSignupCard,
  },
}

export function getInscriptionContent(redirectUri: string | null): InscriptionConfigItem {
  if (!redirectUri) {
    return INSCRIPTION_CONFIG.default
  }

  const pathname = redirectUri.split('?')[0]

  return INSCRIPTION_CONFIG[pathname] ?? INSCRIPTION_CONFIG.generic
}
