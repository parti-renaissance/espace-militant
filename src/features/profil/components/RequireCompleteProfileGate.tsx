import { type ReactNode } from 'react'
import { Href } from 'expo-router'

import { useProfileCompletion } from '@/services/profile/hook'

import AccesRestreintProfil from './AccesRestreintProfil'

type RequireCompleteProfileGateProps = {
  redirectTo: Href
  children: ReactNode
}

/** Bloque le contenu si le profil est incomplet (`AccesRestreintProfil` ouvre le modal à l’affichage). */
export default function RequireCompleteProfileGate({ redirectTo, children }: RequireCompleteProfileGateProps) {
  const { isComplete, isLoading } = useProfileCompletion()

  if (isLoading) {
    return null
  }

  if (!isComplete) {
    return <AccesRestreintProfil redirectTo={redirectTo} />
  }

  return children
}
