import React, { useMemo } from 'react'
import { View, styled, ScrollView, useMedia, XStack, YStack, Image } from 'tamagui'
import { RefreshControl } from 'react-native'
import Layout from '@/components/Navigation/Layout'
import useLayoutPadding from '@/components/Navigation/hook/useLayoutPadding'
import { ErrorState, LoadingState, SurveyList, EmptyState } from '@/features/field-surveys/pages/list'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { useFieldSurveysWithRefresh } from '@/services/field-surveys/hook'
import Text from '@/components/base/Text'

const CenterContainer = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})

const RouteName = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$textPrimary',
})

export default function QuestionnairesPage() {
  return (
    <Layout.Container>
      <QuestionnairesContent />
    </Layout.Container>
  )
}

function QuestionnairesContent() {
  const media = useMedia()
  const padding = useLayoutPadding({ safeArea: true })
  const { data: surveys, isLoading, error, refresh, isRefetching } = useFieldSurveysWithRefresh()
  const surveysCount = useMemo(() => surveys?.length || 0, [surveys])

  const handleRefresh = () => {
    refresh()
  }

  return (
    <Layout.Main maxWidth={992}>
      <ScrollView
        contentContainerStyle={{ ...padding }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
          />
        }
      >
        <YStack gap="$medium" >
          <VoxCard borderRadius="$medium" bg="white" mx={media.sm ? '$medium' : 0}>
            <VoxCard.Content p={media.sm ? 12 : '$medium'}>
              <VoxCard bg="$blue1" inside>
                <VoxCard.Content p={media.sm ? 12 : '$medium'}>
                  <XStack gap="$large">
                    <YStack gap="$medium" flexShrink={1}>
                      <YStack gap="$small">
                        <Text semibold fontSize={media.sm ? 14 : 16}>Questionnaires de terrain</Text>
                        <VoxCard.Chip theme="blue" backgroundColor="white">
                          {`${surveysCount} questionnaire${surveysCount > 1 ? 's' : ''} disponible${surveysCount > 1 ? 's' : ''}`}
                        </VoxCard.Chip>
                      </YStack>
                      <Text fontSize={media.sm ? 12 : 14} color="$textSecondary">
                        Les questionnaires de terrains sont faits pour aller à la rencontre de nos électeurs, sur les marchés, dans la rue ou en porte à porte.
                      </Text>
                    </YStack>
                    <Image source={require('@/features/field-surveys/assets/notepad-survey.png')} objectFit="contain" display={media.sm ? 'none' : 'block'} width={129} height={126} mr="$medium" />
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
            </VoxCard.Content>
          </VoxCard>

          {isLoading && <LoadingState />}
          {error && <ErrorState onRetry={handleRefresh} />}
          {!surveys || surveys.length === 0 && <EmptyState />}
          {surveys && surveys.length > 0 && !error && !isLoading && <SurveyList surveys={surveys} />}
        </YStack>
      </ScrollView>
    </Layout.Main>
  )
}