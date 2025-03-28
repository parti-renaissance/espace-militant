import React from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import EventMDXRenderer from '@/features/events/components/EventMDXRenderer'
import { ScrollStack } from '@/features/events/pages/detail/EventComponents'
import { Icon, Title } from '@/screens/generalConventions/components/FormaCard'
import { RestGetGeneralConventionResponse } from '@/services/general-convention/schema'
import { ArrowLeft, Calendar } from '@tamagui/lucide-icons'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Link, useNavigation } from 'expo-router'
import { isWeb, XStack, YStack } from 'tamagui'

const BackButton = (props: { children?: React.ReactNode }) => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : '/etats-generaux'} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        {props.children ?? 'Retour'}
      </VoxButton>
    </Link>
  )
}

export const generalConventionContent = (data) => {
  const contentFields = [
    data.party_definition_summary,
    data.unique_party_summary,
    data.progress_since2016,
    data.party_objectives,
    data.governance,
    data.communication,
    data.militant_training,
    data.member_journey,
    data.mobilization,
    data.talent_detection,
    data.election_preparation,
    data.relationship_with_supporters,
    data.work_with_partners,
    data.additional_comments,
  ]

  return contentFields.filter(Boolean).join('\n\n')
}
export default function DetailsScreen({ data }: { data: RestGetGeneralConventionResponse }) {
  const combinedContent = generalConventionContent(data)
  return (
    <ScrollStack marginBottom={50}>
      <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
        <BackButton />
      </XStack>
      <YStack gap="$medium" alignSelf={'center'} maxWidth={600}>
        <VoxCard>
          <XStack>
            <PageLayout.MainSingleColumn height="100%">
              <VoxCard.Content pr={0} height="100%">
                <VoxCard.Content height="100%" p={0} pr="$medium">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Icon organizer={data.organizer} />

                    <XStack gap={8} alignItems="center">
                      <Calendar size={12} color="$textSecondary" />
                      <Text.SM secondary>{data.reported_at ? format(data.reported_at, 'dd MMMM yyyy', { locale: fr }) : ''}</Text.SM>
                    </XStack>
                  </XStack>
                  <Title payload={data} />

                  {combinedContent && <EventMDXRenderer children={combinedContent} />}
                </VoxCard.Content>
              </VoxCard.Content>
            </PageLayout.MainSingleColumn>
          </XStack>
        </VoxCard>
      </YStack>
    </ScrollStack>
  )
}
