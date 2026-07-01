import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { YStack } from 'tamagui'

import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'

import { useSession } from '@/ctx/SessionProvider'
import { getMembershipStatus } from '@/utils/membershipStatus'

import type { FooterAction } from '../types'
import { OnboardStep1, OnboardStep2, OnboardStep3, OnboardStep4, OnboardStep5NonAdherent, OnboardStep6Cadre, OnboardStep7Cadre } from './OnboardSteps'

type StepComponent = React.ComponentType<{
  stepIndex: number
  totalSteps: number
  onFooterAction: (action: FooterAction) => void
  titleVars?: Record<string, string>
}>

type ProfileOverride = {
  first_name?: string
  tags?: Array<{ code: string; label?: string; type?: string }>
  cadre_access?: boolean
}

type OnboardModalProps = {
  open: boolean
  onClose: () => void
  /** Override pour Storybook lorsque SessionProvider n'est pas disponible */
  profileOverride?: ProfileOverride
}

export default function OnboardModal({ open, onClose, profileOverride }: OnboardModalProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const { user } = useSession()

  const profile = profileOverride ?? user?.data
  const isAdherent = useMemo(
    () =>
      getMembershipStatus((profile?.tags ?? []).map((t) => (typeof t === 'object' && 'code' in t ? { ...t, label: t.label ?? '', type: t.type ?? '' } : t))) !==
      'join',
    [profile?.tags],
  )
  const isCadre = profile?.cadre_access === true

  const steps = useMemo<StepComponent[]>(() => {
    const common = [OnboardStep1, OnboardStep2, OnboardStep3, OnboardStep4]
    const nonAdherent = !isAdherent ? [OnboardStep5NonAdherent] : []
    const cadre = isCadre ? [OnboardStep6Cadre, OnboardStep7Cadre] : []
    return [...common, ...nonAdherent, ...cadre]
  }, [isAdherent, isCadre])

  const CurrentStep = steps[stepIndex]
  const totalSteps = steps.length

  const handleFooterAction = (action: FooterAction) => {
    switch (action) {
      case 'passer':
        onClose()
        break
      case 'next':
        if (stepIndex < totalSteps - 1) {
          setStepIndex((i) => i + 1)
        } else {
          onClose()
        }
        break
      case 'prev':
        if (stepIndex > 0) {
          setStepIndex((i) => i - 1)
        }
        break
      case 'adherer':
        onClose()
        router.push('/profil/cotisations-et-dons' as const)
        break
      case 'continuer-sans-adherer':
        if (stepIndex < totalSteps - 1) {
          setStepIndex((i) => i + 1)
        } else {
          onClose()
        }
        break
      case 'cest-note':
        onClose()
        break
    }
  }

  if (steps.length === 0) return null

  return (
    <ModalOrPageBase open={open} modalBreakpoint="gtSm">
      {steps.map((StepComponent, i) => (
        <YStack key={i} display={i === stepIndex ? 'flex' : 'none'} flex={1} minHeight={0}>
          <StepComponent stepIndex={i} totalSteps={totalSteps} onFooterAction={handleFooterAction} />
        </YStack>
      ))}
    </ModalOrPageBase>
  )
}
