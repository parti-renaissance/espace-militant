import type { ImageSourcePropType } from 'react-native'

export type OnboardStepId =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'

export type FooterAction =
  | 'next'
  | 'prev'
  | 'passer'
  | 'adherer'
  | 'continuer-sans-adherer'
  | 'cest-note'

export interface OnboardStepConfig {
  id: OnboardStepId
  title: string | ((vars: Record<string, string>) => string)
  illustration: ImageSourcePropType
  backgroundImage?: ImageSourcePropType
  footer: { left?: FooterAction; right: FooterAction }
}
