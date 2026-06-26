import { StyleSheet, View as RNView } from 'react-native'
import { useGlobalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { styled, View, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

import heroImage from '../assets/gabriel-attal-ball.png'
import { useCurrentPronoMatch } from '../hooks/useCurrentPronoMatch'
import { padCountdownUnit, usePronoCountdown } from '../hooks/usePronoCountdown'
import { PronoMatchView, PronoScore, PronoTeam } from '../model'
import { formatTeamLabel, parsePlayerPredictionFromUri } from '../utils'

const CARD_HEIGHT = 235
const CARD_RADIUS = 20
const IMAGE_WIDTH = 200
const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * (864 / 614))

const baseGradient = ['#29C45D', '#4555D1'] as const
const overlayGradient = ['#E0DBD7', '#6E6764'] as const

const CardRoot = styled(YStack, {
  position: 'relative',
  alignSelf: 'stretch',
  width: '100%',
  height: CARD_HEIGHT,
  borderRadius: CARD_RADIUS,
  padding: '$6',
  gap: '$medium',
  overflow: 'hidden',
})

export const PredictionsBox = styled(XStack, {
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$small',
  backgroundColor: '#F5F6FFE6',
  borderRadius: 16,
  paddingVertical: '$small',
  paddingHorizontal: '$medium',
})

const ScoreSquare = styled(View, {
  width: 40,
  height: 46,
  borderRadius: 8,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
})

const styles = StyleSheet.create({
  imageLayer: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
})

function ScoreCell({ code, value }: { code: string; value: number }) {
  return (
    <YStack alignItems="center" gap="$xsmall">
      <ScoreSquare>
        <Text bold fontSize={22} color="#27221F">
          {value}
        </Text>
      </ScoreSquare>
      <Text.XSM semibold color="#5B5651">
        {code}
      </Text.XSM>
    </YStack>
  )
}

export function PredictionGroup({ title, homeTeam, awayTeam, prediction }: { title: string; homeTeam: PronoTeam; awayTeam: PronoTeam; prediction: PronoScore }) {
  return (
    <YStack flex={1} alignItems="center" gap="$small">
      <Text.SM semibold color="#27221F" numberOfLines={1}>
        {title}
      </Text.SM>
      <XStack alignItems="center" gap="$xsmall">
        <ScoreCell code={homeTeam.code} value={prediction.home} />
        <Text bold fontSize={18} color="#27221F" marginBottom={18}>
          -
        </Text>
        <ScoreCell code={awayTeam.code} value={prediction.away} />
      </XStack>
    </YStack>
  )
}

export function PronoCountdownInline({ targetAt }: { targetAt: string }) {
  const remaining = usePronoCountdown(targetAt)
  const units: { value: number; unit: string }[] = [
    { value: remaining.days, unit: 'j' },
    { value: remaining.hours, unit: 'h' },
    { value: remaining.minutes, unit: 'm' },
    { value: remaining.seconds, unit: 's' },
  ]

  return (
    <XStack alignItems="baseline" gap="$small">
      {units.map(({ value, unit }) => (
        <XStack key={unit} alignItems="baseline">
          <Text.LG bold color="white">
            {padCountdownUnit(value)}
          </Text.LG>
          <Text.SM color="white">{unit}</Text.SM>
        </XStack>
      ))}
    </XStack>
  )
}

type PronoSignupCardContentProps = {
  match: PronoMatchView
  playerPrediction: PronoScore
}

export function PronoSignupCardContent({ match, playerPrediction }: PronoSignupCardContentProps) {
  const authorPrediction = match.authorPrediction ?? { home: 0, away: 0 }

  return (
    <CardRoot>
      <RNView style={StyleSheet.absoluteFill}>
        <LinearGradient colors={[...baseGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[...overlayGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { opacity: 0.1 }]} />
      </RNView>

      <Image source={heroImage} style={[styles.imageLayer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }]} contentFit="contain" pointerEvents="none" />

      <YStack gap="$xsmall" zIndex={1}>
        <Title.Text color="white">{formatTeamLabel(match.homeTeam, match.awayTeam)}</Title.Text>
        {match.kickoffAt ? <PronoCountdownInline targetAt={match.kickoffAt} /> : null}
      </YStack>

      <PredictionsBox marginTop="auto">
        <PredictionGroup title="Prono. de Gabriel :" homeTeam={match.homeTeam} awayTeam={match.awayTeam} prediction={authorPrediction} />
        <Text bold fontSize={14} color="#27221F" flexShrink={0}>
          VS
        </Text>
        <PredictionGroup title="Ton pronostic :" homeTeam={match.homeTeam} awayTeam={match.awayTeam} prediction={playerPrediction} />
      </PredictionsBox>
    </CardRoot>
  )
}

type PronoSignupCardProps = {
  match?: PronoMatchView
  playerPrediction?: PronoScore
}

export function PronoSignupCard({ match: matchProp, playerPrediction: playerPredictionProp }: PronoSignupCardProps = {}) {
  const { redirectUri } = useGlobalSearchParams<{ redirectUri?: string }>()
  const { match: currentMatch } = useCurrentPronoMatch()
  const match = matchProp ?? currentMatch
  const playerPrediction = playerPredictionProp ?? parsePlayerPredictionFromUri(redirectUri)

  if (!match || !playerPrediction) return null

  return <PronoSignupCardContent match={match} playerPrediction={playerPrediction} />
}
