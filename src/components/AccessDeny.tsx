import { Link } from 'expo-router'
import { Image, YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import visuCadnasImg from '@/assets/illustrations/VisuCadnas.png'

import Text from './base/Text'
import { VoxButton } from './Button'
import VoxCard from './VoxCard/VoxCard'

interface AccessDenyProps {
  message?: string
  Button?: React.ReactNode
}

export const AccessDeny = ({ message, Button }: AccessDenyProps) => {
  const defaultMessage = "Vous n'avez pas les droits d'accès à cette page."

  return (
    <VoxCard.Content>
      <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
        <Image source={visuCadnasImg} />
        <Text.LG>{message || defaultMessage}</Text.LG>
        <YStack>
          {Button ? (
            Button
          ) : (
            <Link href="/" asChild>
              <VoxButton iconLeft={ArrowLeft}>Retour à l'accueil</VoxButton>
            </Link>
          )}
        </YStack>
      </YStack>
    </VoxCard.Content>
  )
}
