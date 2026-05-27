import { ScrollView, XStack, YStack } from 'tamagui'
import { CalendarDays, MapPin, Users } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

import CallToActionCard from './CallToActionCard'

export default {
  title: 'CallToActionCard',
}

export function ListeMobileFirst() {
  return (
    <ScrollView>
      <YStack width={420} maxWidth="100%" gap="$medium" p="$medium" backgroundColor="$gray50">
        <CallToActionCard
          icon={CalendarDays}
          title="Participez au prochain événement"
          description="Retrouvez les rendez-vous militants près de chez vous."
          theme="blue"
        >
          <XStack gap={12}>
            <VoxButton theme="blue" variant="soft">
              Voir les événements
            </VoxButton>
            <VoxButton theme="gray" variant="outlined">
              Plus tard
            </VoxButton>
          </XStack>
        </CallToActionCard>

        <CallToActionCard
          icon={Users}
          title="Invitez votre équipe locale"
          description="Mobilisez de nouveaux bénévoles autour de vos actions terrain."
          theme="green"
        >
          <VoxButton theme="green" variant="soft">
            Inviter
          </VoxButton>
        </CallToActionCard>

        <CallToActionCard
          title="Sans icône"
          description="La pastille d’icône peut être omise lorsque le titre suffit."
        >
          <VoxButton theme="gray" variant="soft">
            Découvrir
          </VoxButton>
        </CallToActionCard>

        <CallToActionCard
          icon={MapPin}
          title="Configurez votre zone d’action"
          description="Ajustez votre secteur pour recevoir les missions pertinentes."
          theme="pink"
        >
          <XStack gap={12}>
            <VoxButton theme="pink" variant="soft">
              Configurer
            </VoxButton>
            <VoxButton theme="gray" variant="outlined">
              En savoir plus
            </VoxButton>
          </XStack>
        </CallToActionCard>
      </YStack>
    </ScrollView>
  )
}
