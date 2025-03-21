import React from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import VoxCard from '@/components/VoxCard/VoxCard'
import EventMDXRenderer from '@/features/events/components/EventMDXRenderer'
import { ScrollStack } from '@/features/events/pages/detail/EventComponents'
import { Icon, Title } from '@/screens/generalConventions/components/FormaCard'
import { RestGetGeneralConventionResponse } from '@/services/general-convention/schema'
import { ArrowLeft } from '@tamagui/lucide-icons'
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

export default function DetailsScreen({ data }: { data: RestGetGeneralConventionResponse }) {
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

  const combinedContent = contentFields.filter(Boolean).join('\n\n')

  return (
    <ScrollStack>
      <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
        <BackButton />
      </XStack>
      <YStack gap="$medium" alignSelf={'center'} maxWidth={600}>
        <VoxCard>
          <XStack>
            <PageLayout.MainSingleColumn height="100%">
              <VoxCard.Content pr={0} height="100%">
                <VoxCard.Content height="100%" p={0} pr="$medium">
                  <VoxCard.Image image={require('@/features/events/assets/images/event-fallback.png')} />
                  <XStack justifyContent="space-between" alignItems="center">
                    <Icon organizer={data.organizer} />

                    {data.department_zone && (
                      <Text.SM secondary medium>
                        {data.department_zone.name} ({data.department_zone.code})
                      </Text.SM>
                    )}
                  </XStack>
                  <Title payload={data} />

                  {combinedContent && <EventMDXRenderer>{combinedContent}</EventMDXRenderer>}
                </VoxCard.Content>
              </VoxCard.Content>
            </PageLayout.MainSingleColumn>
          </XStack>
        </VoxCard>
      </YStack>
    </ScrollStack>
  )
}
