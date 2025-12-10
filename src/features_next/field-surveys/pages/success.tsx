import React from 'react'
import { ImageBackground } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { Circle, XStack, YStack, isWeb, styled, useMedia } from 'tamagui'
import { RotateCcw, ThumbsUp } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { VoxHeader } from '@/components/Header/Header'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

const Container = styled(YStack, {
  flex: 1,
})

const ContentWrapper = styled(YStack, {
  maxWidth: 892,
  width: '100%',
  alignSelf: 'center',
  paddingHorizontal: '$medium',
  transform: 'translateY(-128px)',
  gap: '$medium',
  $sm: {
    gap: 0,
    paddingHorizontal: 0,
    transform: 'translateY(0)'
  },
})

const FieldSurveySuccessPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const media = useMedia()
  const insets = useSafeAreaInsets()
  
  const handleRestart = () => {
    // Navigation vers le questionnaire avec réinitialisation
    router.replace({
      pathname: '/(app)/(militant)/questionnaires/[id]',
      params: { id }
    })
  }

  const handleBackToList = () => {
    if (isWeb) {
      router.push('/(app)/(militant)/questionnaires')
    } else if (router.canGoBack?.()) {
      router.back()
    } else {
      router.replace('/(app)/(militant)/questionnaires')
    }
  }

  const FixedButtons = () => (
    <XStack
      gap="$medium"
      justifyContent="space-between"
      pt="$medium"
      px={media.sm ? '$medium' : 0}
      pb={media.sm ? Math.max(16, Math.min(insets.bottom, 80)) : 0}
      backgroundColor="white"
      borderTopWidth={1}
      borderTopColor="$textOutline20"
      width="100%"
    >
      <VoxButton
        variant="soft"
        onPress={handleBackToList}
        flex={1}
        size="xl"
      >
        Terminer
      </VoxButton>

      <VoxButton
        variant="contained"
        theme="blue"
        iconLeft={RotateCcw}
        onPress={handleRestart}
        flex={1}
        size="xl"
      >
        Recommencer
      </VoxButton>
    </XStack>
  )

  return (
    <YStack flex={1} backgroundColor={media.sm ? 'white' : '$textSurface'}>
      {media.sm ? (
        <VoxHeader alignItems="center" justifyContent="center">
          <VoxHeader.Title>Questionnaire terminé</VoxHeader.Title>
        </VoxHeader>
      ) : null}
      <LayoutScrollView
        showsVerticalScrollIndicator={false}
        disablePadding
      >
        <Container flex={1}>
          {media.gtSm ? <ImageBackground source={require('../assets/bg-surveys.png')} style={{ height: media.sm ? 250 : 350, width: '100%' }} /> : null}
          <ContentWrapper flex={1}>
            <VoxCard inside={media.sm ? true : false} flex={media.sm ? 1 : undefined} borderWidth={media.sm ? 0 : 1} shadowColor={media.sm ? 'transparent' : undefined} elevation={media.sm ? 0 : undefined} bg={media.sm ? 'transparent' : 'white'}>
              <VoxCard.Content gap="$large" flex={1} alignItems="center" justifyContent="center" pt="$xxlarge">
                <Circle size={88} backgroundColor="$green1" >
                  <ThumbsUp size={40} color="$green6" />
                </Circle>
                <YStack alignItems="center" gap="$medium" pb="$xxlarge">
                  <Text.LG semibold textAlign="center">
                    Bravo
                  </Text.LG>
                  <YStack alignItems="center">
                    <Text.MD textAlign="center" color="$textSecondary" maxWidth={400}>
                      Un questionnaire de plus réalisé.
                    </Text.MD>
                    <Text.MD textAlign="center" color="$textSecondary" maxWidth={400}>
                      Merci de votre engagement !
                    </Text.MD>
                  </YStack>
                </YStack>

                {media.gtSm && (
                  <FixedButtons />
                )}
              </VoxCard.Content>
            </VoxCard>
          </ContentWrapper>
        </Container>
      </LayoutScrollView>

      {media.sm && (
        <FixedButtons />
      )}
    </YStack>
  )
}

export default FieldSurveySuccessPage
