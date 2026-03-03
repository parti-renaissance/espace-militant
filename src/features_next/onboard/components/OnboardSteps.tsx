import { useMemo } from 'react'
import { useMedia } from 'tamagui'

import Text from '@/components/base/Text'

import { useGetExecutiveScopes } from '@/services/profile/hook'

import type { FooterAction } from '../types'
import OnboardStepLayout from './OnboardStepLayout'

type OnboardStepProps = {
  stepIndex: number
  totalSteps: number
  onFooterAction: (action: FooterAction) => void
}

// Assets - mobile
const ILLU_1 = require('../assets/illu-onboard-step-1.png')
const ILLU_2 = require('../assets/illu-onboard-step-2.png')
const ILLU_3 = require('../assets/illu-onboard-step-3.png')
const ILLU_4 = require('../assets/illu-onboard-step-4.png')
const ILLU_5 = require('../assets/illu-onboard-step-5.png')
const ILLU_6 = require('../assets/illu-onboard-step-6.png')
const ILLU_6_1 = require('../assets/illu-onboard-step-6-1.png')
const BG_1 = require('../assets/bg-onboard-step-1.png')
const BG_3 = require('../assets/bg-onboard-step-3.png')
const BG_4 = require('../assets/bg-onboard-step-4.png')

// Assets - desktop
const ILLU_D_1 = require('../assets/illu-onboard-desktop-step-1.png')
const ILLU_D_2 = require('../assets/illu-onboard-desktop-step-2.png')
const ILLU_D_3 = require('../assets/illu-onboard-desktop-step-3.png')
const ILLU_D_4 = require('../assets/illu-onboard-desktop-step-4.png')
const ILLU_D_5 = require('../assets/illu-onboard-desktop-step-5.png')
const ILLU_D_6 = require('../assets/illu-onboard-desktop-step-6.png')
const ILLU_D_7 = require('../assets/illu-onboard-desktop-step-7.png')
const BG_D_1 = require('../assets/bg-onboard-desktop-step-1.png')
const BG_D_3 = require('../assets/bg-onboard-desktop-step-3.png')
const BG_D_4 = require('../assets/bg-onboard-desktop-step-4.png')

export function OnboardStep1({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_1 : ILLU_1), [media.gtSm])
  const backgroundImage = useMemo(() => (media.gtSm ? BG_D_1 : BG_1), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Intégrez les instances locales du parti"
      illustration={illustration}
      backgroundImage={backgroundImage}
      footer={{ left: 'passer', right: 'next' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
    />
  )
}

export function OnboardStep2({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_2 : ILLU_2), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Suivez l’actualité du parti sur l’application"
      illustration={illustration}
      footer={{ left: 'prev', right: 'next' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
    />
  )
}

export function OnboardStep3({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_3 : ILLU_3), [media.gtSm])
  const backgroundImage = useMemo(() => (media.gtSm ? BG_D_3 : BG_3), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Des événements autour de vous et partout en France"
      illustration={illustration}
      backgroundImage={backgroundImage}
      footer={{ left: 'prev', right: 'next' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
    />
  )
}

export function OnboardStep4({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_4 : ILLU_4), [media.gtSm])
  const backgroundImage = useMemo(() => (media.gtSm ? BG_D_4 : BG_4), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Défendez nos idées à travers des actions de terrain"
      illustration={illustration}
      backgroundImage={backgroundImage}
      footer={{ left: 'prev', right: 'next' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
    />
  )
}

export function OnboardStep5NonAdherent({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_5 : ILLU_5), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Adhérez pour débloquer tous les contenus et fonctionnalités"
      illustration={illustration}
      footer={{ left: 'continuer-sans-adherer', right: 'adherer' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      buttonDirection={media.gtSm ? 'row' : 'column'}
      onFooterAction={onFooterAction}
    />
  )
}

export function OnboardStep6Cadre({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_6 : ILLU_6), [media.gtSm])

  return (
    <OnboardStepLayout
      title="Vous êtes Cadre"
      illustration={illustration}
      footer={{ left: 'prev', right: 'next' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
      theme="purple"
      Description={
        <Text medium textAlign="center" fontSize={media.gtSm ? 14 : 16} lineHeight={media.gtSm ? 22 : 24}>
          Vous avez donc accès à une navigation supplémentaire et à des <Text bold>fonctionnalités Cadre</Text> qui sont indiquées <Text bold>en violet</Text>{' '}
          dans l’application.
        </Text>
      }
    />
  )
}

export function OnboardStep7Cadre({ stepIndex, totalSteps, onFooterAction }: OnboardStepProps) {
  const media = useMedia()
  const illustration = useMemo(() => (media.gtSm ? ILLU_D_7 : ILLU_6_1), [media.gtSm])
  const { data: scopes } = useGetExecutiveScopes()

  return (
    <OnboardStepLayout
      title={`Vous avez ${scopes?.list?.length ?? 1} rôle${(scopes?.list?.length ?? 1 > 1) ? 's' : ''} Cadre`}
      illustration={illustration}
      footer={{ left: 'prev', right: 'cest-note' }}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onFooterAction={onFooterAction}
      theme="purple"
      Description={
        <Text medium textAlign="center" fontSize={media.gtSm ? 14 : 16} lineHeight={media.gtSm ? 22 : 24}>
          <Text bold>Dans l’espace Cadre,</Text> changez de rôle pour accéder aux fonctionnalités associées. <Text bold>Lors de la création de contenu,</Text>{' '}
          choisissez sous quel rôle publier.
        </Text>
      }
    />
  )
}
