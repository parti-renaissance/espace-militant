import { useMedia, XStack, YStack } from 'tamagui'
import { ArrowRight, Check, ChevronDown } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import Chip from '@/components/Chip/Chip'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import Title from '@/components/Title/Title'
import ToiPresidentCard from '@/features_next/ideas/toiPresident/components/ToiPresidentCard'
import { useToiPresidentActions } from '@/features_next/ideas/toiPresident/hooks/useToiPresidentActions'

type SignupCongartsModalProps = {
  isOpen: boolean
  firstName?: string
  onClose: () => void
}

export default function SignupCongartsModal({ isOpen, firstName, onClose }: SignupCongartsModalProps) {
  const toiPresident = useToiPresidentActions()
  const media = useMedia()

  return (
    <ModalOrBottomSheet open={isOpen} onClose={onClose} allowDrag>
      <YStack p="$medium" gap="$large" width="100%" maxWidth={media.gtMd ? 440 : undefined}>
        <YStack gap="$medium" alignItems="flex-start">
          <Chip theme="blue" icon={Check}>
            Compte créé
          </Chip>
          <Title size="h1">
            <Title.Highlight>Bienvenue{firstName ? ` ${firstName}` : ''}</Title.Highlight>
            <Title.Text>👋</Title.Text>
          </Title>
        </YStack>

        <YStack gap="$medium">
          <XStack gap="$small">
            <Title size="h2">
              <Title.Text>Découvrir</Title.Text>
            </Title>
            <ChevronDown size={20} />
          </XStack>
          <ToiPresidentCard onPlay={toiPresident.play} onShare={toiPresident.share} />
        </YStack>
        <VoxButton theme="blue" size="xl" full onPress={onClose} iconRight={ArrowRight}>
          Suivant
        </VoxButton>
      </YStack>
    </ModalOrBottomSheet>
  )
}
