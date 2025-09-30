import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { XStack, YStack, styled, useMedia } from 'tamagui'
import { ClipboardCheck, MapPin, Flag, Calendar, Pen } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useFieldSurveysWithRefresh } from '@/services/field-surveys/hook'
import { FieldSurvey } from '@/services/field-surveys/schema'
import { getFormattedDate } from '@/utils/date'


const Container = styled(YStack, {
  flex: 1,
  backgroundColor: '$textSurface',
  paddingBottom: '$xxlarge',
})

const ContentWrapper = styled(YStack, {
  maxWidth: 780,
  width: '100%',
  alignSelf: 'center',
  paddingHorizontal: '$medium',
  marginTop: '-48px',
})

const GridRow = styled(XStack, {
  gap: '$medium',
  alignItems: 'flex-start',
})

const GridItem = styled(YStack, {
  flex: 1,
  flexBasis: 1,
  height: '100%',
})

const ColumnSeparator = styled(YStack, {
  width: 1,
  backgroundColor: '$textOutline',
  flexShrink: 0,
  alignSelf: 'stretch',
})

interface SurveyListItemProps {
  survey: FieldSurvey
  onPress: (survey: FieldSurvey) => void
  showBorder?: boolean
}

const SurveyListItem: React.FC<SurveyListItemProps> = ({ survey, onPress, showBorder = true }) => {
  const getSurveyTypeChip = () => {
    switch (survey.type) {
      case 'local':
        return (
          <VoxCard.Chip theme="green" icon={MapPin}>
            Local
          </VoxCard.Chip>
        )
      case 'national':
        return (
          <VoxCard.Chip theme="blue" icon={Flag}>
            National
          </VoxCard.Chip>
        )
      default:
        return (
          <VoxCard.Chip theme="gray" icon={ClipboardCheck}>
            Autre
          </VoxCard.Chip>
        )
    }
  }

  return (
    <YStack
      padding="$medium"
      borderBottomWidth={showBorder ? 1 : 0}
      borderBottomColor="$textOutline"
      flex={1}
      gap="$medium"
    >

      {getSurveyTypeChip()}
      <Text.LG semibold numberOfLines={5} flex={1} marginRight="$small">
        {survey.name}
      </Text.LG>


      {survey.city && (
        <XStack alignItems="center" gap="$xsmall" marginBottom="$xsmall">
          <Text.SM secondary>
            {survey.city}
          </Text.SM>
        </XStack>
      )}

      <XStack alignItems="center" gap="$medium">
        <Text.SM secondary numberOfLines={1} ellipsizeMode="tail">
          {survey.questions.length} question{survey.questions.length > 1 ? 's' : ''}
        </Text.SM>
         { (survey as any)?.created_at && (
           <XStack alignItems="center" gap="$xsmall">
             <Calendar size={12} color="$secondary" />
             <Text.SM secondary>
               Crée le : {getFormattedDate(new Date((survey as any).created_at))}
             </Text.SM>
           </XStack>
         )}
      </XStack>
      <VoxButton variant="outlined" onPress={() => onPress(survey)} iconLeft={Pen}>
      Commencer
      </VoxButton>
    </YStack>
  )
}

const EmptyState: React.FC = () => (
  <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$medium">
    <ClipboardCheck size={48} color="$gray8" />
    <Text.LG color="$gray10">Aucun questionnaire disponible</Text.LG>
    <Text.SM color="$gray8" textAlign="center">
      Il n'y a actuellement aucun questionnaire à remplir.
    </Text.SM>
  </YStack>
)

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$medium">
    <Text.LG color="$red10">Erreur de chargement</Text.LG>
    <Text.SM color="$gray10" textAlign="center">
      Impossible de charger les questionnaires. Vérifiez votre connexion internet.
    </Text.SM>
    <VoxButton onPress={onRetry}>
      Réessayer
    </VoxButton>
  </YStack>
)

const LoadingState: React.FC = () => (
  <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$medium">
    <Text.LG color="$gray10">Chargement...</Text.LG>
    <Text.SM color="$gray8">
      Récupération des questionnaires disponibles
    </Text.SM>
  </YStack>
)

const FieldSurveysListPage: React.FC = () => {
  const { data: surveys, isLoading, error, refresh, isRefetching } = useFieldSurveysWithRefresh()
  const media = useMedia()

  const handleSurveyPress = (survey: FieldSurvey) => {
    router.push({
      pathname: '/questionnaires/[id]',
      params: { id: survey.uuid }
    })
  }

  const handleRefresh = () => {
    refresh()
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState onRetry={handleRefresh} />
  }

  if (!surveys || surveys.length === 0) {
    return <EmptyState />
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
        />
      }
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Container>
        <ImageBackground source={require('../assets/bg-surveys.png')} style={{ height: 350, width: '100%' }} />
        <ContentWrapper>
          <VoxCard borderRadius="$medium">
            <VoxCard.Content>
              <YStack>
                <Text.LG semibold>Enquêtes de terrain</Text.LG>
                <Text.SM secondary>
                  {surveys.length} questionnaire{surveys.length > 1 ? 's' : ''} disponible{surveys.length > 1 ? 's' : ''}
                </Text.SM>
              </YStack>

              <YStack borderBottomWidth={1} borderBottomColor="$textOutline" />
                
              <YStack>
                {media.gtSm ? (
                  // Layout 2 columns
                  surveys.map((survey, index) => {
                    const isLastItem = index === surveys.length - 1
                    const isSecondLastItem = index === surveys.length - 2
                    const showBorder = !isLastItem && !isSecondLastItem
                    
                    if (index % 2 === 0) {
                      return (
                        <GridRow key={index}>
                          <GridItem>
                            <SurveyListItem
                              survey={survey}
                              onPress={handleSurveyPress}
                              showBorder={showBorder}
                            />
                          </GridItem>
                          <ColumnSeparator />
                          <GridItem>
                            {surveys[index + 1] ? (
                              <SurveyListItem
                                survey={surveys[index + 1]}
                                onPress={handleSurveyPress}
                                showBorder={showBorder}
                              />
                            ) : (
                              <YStack flex={1} />
                            )}
                          </GridItem>
                        </GridRow>
                      )
                    }
                    return null
                  })
                ) : (
                  surveys.map((survey, index) => {
                    const isLastItem = index === surveys.length - 1
                    const showBorder = !isLastItem
                    
                    return (
                      <SurveyListItem
                        key={survey.uuid}
                        survey={survey}
                        onPress={handleSurveyPress}
                        showBorder={showBorder}
                      />
                    )
                  })
                )}
              </YStack>
            </VoxCard.Content>
          </VoxCard>
        </ContentWrapper>
      </Container>
    </ScrollView>
  )
}


export default FieldSurveysListPage
