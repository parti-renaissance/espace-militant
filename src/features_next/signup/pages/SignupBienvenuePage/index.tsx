import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, router, useFocusEffect } from 'expo-router'
import { Circle, isWeb, ScrollView, Spinner, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'
import VideoPlayer from '@/features_next/video/components/VideoPlayer'

import { useVideo } from '@/services/video/hook'

/** UUID vidéo de bienvenue — à remplacer par la config produit. */
export const SIGNUP_BIENVENUE_VIDEO_UUID = '550e8400-e29b-41d4-a716-446655440001'

export default function SignupBienvenuePage() {
  const insets = useSafeAreaInsets()
  const { data, isLoading, isError } = useVideo(SIGNUP_BIENVENUE_VIDEO_UUID)
  const [isScreenFocused, setIsScreenFocused] = useState(true)

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true)
      return () => setIsScreenFocused(false)
    }, []),
  )

  const handleContinue = () => {
    setIsScreenFocused(false)
    router.replace('/(signup)/inscription' as Href)
  }

  const viewportMinHeight = isWeb ? '100dvh' : undefined

  return (
    <ScrollView flex={1} backgroundColor="$gray50" height={viewportMinHeight} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <YStack
        flex={1}
        maxHeight={viewportMinHeight}
        padding="$medium"
        paddingTop={insets.top + 16}
        paddingBottom={insets.bottom + 16}
        gap="$large"
        width="100%"
        maxWidth={520}
        alignSelf="center"
      >
        {isLoading ? (
          <YStack flex={1} minHeight={220} width="100%" borderRadius="$medium" overflow="hidden" bg="$black1" alignItems="center" justifyContent="center">
            <Circle size={64} backgroundColor="rgba(0,0,0,0.45)" alignItems="center" justifyContent="center">
              <Spinner size="large" color="$white1" />
            </Circle>
          </YStack>
        ) : isError || !data ? (
          <YStack flex={1} minHeight={220} width="100%" borderRadius="$medium" overflow="hidden" bg="$black1" alignItems="center" justifyContent="center">
            <Text.MD secondary>La vidéo n&apos;est pas disponible pour le moment.</Text.MD>
          </YStack>
        ) : (
          <YStack flex={1} minHeight={220} width="100%" borderRadius="$medium" overflow="hidden">
            <VideoPlayer
              hlsUrl={data.hls_url}
              thumbnailUrl={data.thumbnail_url}
              width={data.width}
              height={data.height}
              autoPlay
              loop={true}
              active={isScreenFocused}
              controls={false}
              fill
            />
          </YStack>
        )}

        <Title>
          <Title.Text>Et si on changeait</Title.Text>
          <Title.Break />
          <Title.Text>les choses</Title.Text>
          <Title.Highlight>Ensemble</Title.Highlight>
          <Title.Text>?</Title.Text>
        </Title>

        <YStack width="100%">
          <VoxButton theme="blue" size="xl" full onPress={handleContinue}>
            Suivant
          </VoxButton>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
