import { Image, YStack } from "tamagui"
import Text from "./base/Text"
import VoxCard from "./VoxCard/VoxCard"
import { VoxButton } from "./Button"
import { Link } from "expo-router"
import { ArrowLeft } from "@tamagui/lucide-icons"

interface AccessDenyProps {
  message?: string
}

export const AccessDeny = ({ message }: AccessDenyProps) => {
    const defaultMessage = "Vous n'avez pas les droits d'accès à cette page."
    
    return (
      <VoxCard.Content>
        <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
          <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
          <Text.LG>{message || defaultMessage}</Text.LG>
          <YStack>
            <Link href="/" asChild>
              <VoxButton iconLeft={ArrowLeft}>
                Retour à l'accueil
              </VoxButton>
            </Link>
          </YStack>
        </YStack>
      </VoxCard.Content>
    )
  }