import { StyleSheet, View as RNView } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

import heroImage from '../assets/gabriel-attal-ball.png'
import { useCurrentPronoMatch } from '../hooks/useCurrentPronoMatch'
import { formatTeamLabel, parsePlayerPredictionFromUri } from '../utils'
import { PredictionGroup, PredictionsBox, PronoCountdownInline } from './PronoSignupCard'

const baseGradient = ['#29C45D', '#4555D1'] as const
const overlayGradient = ['#E0DBD7', '#6E6764'] as const

const styles = StyleSheet.create({
  imageLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function PronoSignupIllustration() {
  const redirectUri = useSignupSessionStore((s) => s.redirectUri)
  const { match } = useCurrentPronoMatch()
  const playerPrediction = parsePlayerPredictionFromUri(redirectUri ?? undefined)
  const authorPrediction = match?.authorPrediction ?? { home: 0, away: 0 }

  return (
    <YStack flex={1} width="100%" height="100%" position="relative" overflow="hidden" justifyContent="flex-end" padding="$large" gap="$large">
      <RNView style={StyleSheet.absoluteFill}>
        <LinearGradient colors={[...baseGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[...overlayGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { opacity: 0.1 }]} />
      </RNView>

      <RNView style={styles.imageLayer} pointerEvents="none">
        <Image source={heroImage} style={{ width: '100%', height: '100%' }} contentFit="contain" />
      </RNView>

      {match ? (
        <YStack gap="$medium" zIndex={1}>
          <YStack gap="$xsmall">
            <Title.Text color="white">{formatTeamLabel(match.homeTeam, match.awayTeam)}</Title.Text>
            {match.kickoffAt ? <PronoCountdownInline targetAt={match.kickoffAt} /> : null}
          </YStack>
          {playerPrediction ? (
            <PredictionsBox>
              <PredictionGroup title="Prono. de Gabriel :" homeTeam={match.homeTeam} awayTeam={match.awayTeam} prediction={authorPrediction} />
              <Text bold fontSize={14} color="#27221F" flexShrink={0}>
                VS
              </Text>
              <PredictionGroup title="Ton pronostic :" homeTeam={match.homeTeam} awayTeam={match.awayTeam} prediction={playerPrediction} />
            </PredictionsBox>
          ) : null}
        </YStack>
      ) : null}
    </YStack>
  )
}
