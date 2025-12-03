import React, { useMemo } from 'react'
import { RefreshControl } from 'react-native'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { Circle, Image, XStack, YStack, styled, useMedia, ScrollView } from 'tamagui'
import { ClipboardCheck, MapPin, Flag, Calendar, Pen, RotateCw, FileQuestion, ArrowLeft } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useFieldSurveysWithRefresh } from '@/services/field-surveys/hook'
import { FieldSurvey } from '@/services/field-surveys/schema'
import { getFormattedDate } from '@/utils/date'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'


const Container = styled(YStack, {
  flex: 1,
  paddingBottom: '$xxlarge',
})

const ContentWrapper = styled(YStack, {
  maxWidth: 780,
  width: '100%',
  alignSelf: 'center',
  paddingHorizontal: '$medium',
  transform: 'translateY(-128px)',
  gap: '$medium',
  $sm: {
    gap: 0,
    paddingHorizontal: 0,
    marginTop: '0px',
    transform: 'translateY(-48px)'
  },
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
        {(survey as any)?.created_at && (
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

export const SurveyList: React.FC<{ surveys: FieldSurvey[] }> = ({ surveys }) => {
  const media = useMedia()

  const handleSurveyPress = (survey: FieldSurvey) => {
    router.push({
      pathname: '/dev/(app-new)/(militant)/questionnaires/[id]',
      params: { id: survey.uuid }
    })
  }

  return (
    <VoxCard borderWidth={media.sm ? 0 : 1} shadowColor={media.sm ? 'transparent' : undefined} elevation={media.sm ? 0 : undefined} inside={media.sm ? true : false}>
      <VoxCard.Content p={media.sm ? '$medium' : '$large'}>
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
  )

}

export const EmptyState: React.FC = () => {
  const media = useMedia()
  return (
    <VoxCard borderWidth={media.sm ? 0 : 1} shadowColor={media.sm ? 'transparent' : undefined} elevation={media.sm ? 0 : undefined} inside={media.sm ? true : false}>
      <VoxCard.Content>
        <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$xlarge">
          <Circle size={88} backgroundColor="$blue1" >
            <FileQuestion size={40} color="$blue4" />
          </Circle>
          <Text.LG semibold primary textWrap="balance" maxWidth={480} textAlign="center">Il n'y a actuellement aucun questionnaire en cours sur votre zone.</Text.LG>
          <YStack marginTop="$large">
            <VoxButton variant="outlined" iconLeft={ArrowLeft} onPress={() => { router.canGoBack() ? router.back() : router.navigate('/') }}>
              Retour
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const media = useMedia()
  return (
    <VoxCard borderWidth = { media.sm ? 0 : 1 } shadowColor = { media.sm ? 'transparent' : undefined } elevation = { media.sm ? 0 : undefined } inside = { media.sm ? true : false } >
      <VoxCard.Content>
        <YStack alignItems="center" justifyContent="center" padding="$xxlarge" gap="$medium">
          <Text.LG color="$red10">Erreur de chargement</Text.LG>
          <Text.SM color="$gray10" textAlign="center">
            Impossible de charger les questionnaires. Vérifiez votre connexion internet.
          </Text.SM>
          <YStack>
            <VoxButton variant="outlined" iconLeft={RotateCw} onPress={onRetry}>
              Réessayer
            </VoxButton>
          </YStack>
        </YStack>
      </VoxCard.Content>
  </VoxCard >
  )
}

export const LoadingState: React.FC = () => {
  const media = useMedia()
  return (
  <VoxCard borderWidth={media.sm ? 0 : 1} shadowColor={media.sm ? 'transparent' : undefined} elevation={media.sm ? 0 : undefined} inside={media.sm ? true : false}>
    <VoxCard.Content>
      <YStack>
        <YStack gap="$xsmall">
          <SkeCard.Line width={200} />
          <SkeCard.Line width={220} />
        </YStack>
        <SkeCard.Separator my="$medium" />
        <SkeCard.Image />
      </YStack>
      </VoxCard.Content>
  </VoxCard>
  )
}

const FieldSurveysListPage: React.FC = () => {
  const { data: surveys, isLoading, error, refresh, isRefetching } = useFieldSurveysWithRefresh()
  const media = useMedia()

  const handleRefresh = () => {
    refresh()
  }

  const surveysCount = useMemo(() => surveys?.length || 0, [surveys])

  return (
    <LayoutScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
        />
      }
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, backgroundColor: media.sm ? 'white' : '$textSurface' }}
      showsVerticalScrollIndicator={false}
      disablePadding
    >
      <Container>
        <ImageBackground source={require('../assets/bg-surveys.png')} style={{ height: media.sm ? 250 : 350, width: '100%' }} />
        <ContentWrapper>
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
                    <Image source={require('../assets/notepad-survey.png')} objectFit="contain" display={media.sm ? 'none' : 'block'} width={129} height={126} mr="$medium" />
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
            </VoxCard.Content>
          </VoxCard>

          {isLoading && <LoadingState />}
          {error && <ErrorState onRetry={handleRefresh} />}
          {!surveys || surveys.length === 0 && <EmptyState />}
          {surveys && surveys.length > 0 && !error && !isLoading && <SurveyList surveys={surveys} />}
        </ContentWrapper>
      </Container>
    </LayoutScrollView>
  )
}


export default FieldSurveysListPage
