import { ReactNode } from 'react';
import { Platform, View as RNView, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { styled, View, XStack, YStack } from 'tamagui';



import Text from '@/components/base/Text';



import { PLAAK_44_BOLD } from '../../../../theme/fonts';
import resultDrawImage from '../assets/result-draw.png';
import resultGabrielImage from '../assets/result-gabriel.png';
import resultWinImage from '../assets/result-win.png';
import { PronoScore, PronoTeam } from '../model';
import PronoBadge from './PronoBadge';
import PronoPronosticsCard from './PronoPronosticsCard';


export type PronoResultVariant = 'win' | 'gabriel' | 'draw'

const PANEL_TEXT_COLOR = '#27221F'
const IMAGE_TOP = -118
const SPACER_HEIGHT = 150
const CARD_RADIUS = 24
const PANEL_RADIUS = 24

type VariantConfig = {
  label: string
  gradient: readonly [string, string]
  bannerColor: string
  labelColor: string
  panelColor: string
  predictionPanelColor: string
  authorAccentColor: string
  playerAccentColor: string
  image: number
  imageWidth: number
  imageHeight: number
}

const VARIANTS: Record<PronoResultVariant, VariantConfig> = {
  win: {
    label: 'TU AS GAGNÉ !',
    gradient: ['#29C45D', '#4555D1'],
    bannerColor: '#1C6026CC',
    labelColor: '#BCEFC3',
    panelColor: '#D2F6D1',
    predictionPanelColor: '#F6FFF7',
    authorAccentColor: '#BF9824',
    playerAccentColor: '#4B9F57',
    image: resultWinImage,
    imageWidth: 160,
    imageHeight: Math.round(150 * (840 / 549)),
  },
  gabriel: {
    label: 'GABRIEL A GAGNÉ',
    gradient: ['#E83644', '#4555D1'],
    bannerColor: '#7D300BCC',
    labelColor: '#FFD7B0',
    panelColor: '#FFDDB0',
    predictionPanelColor: '#FFF7EF',
    authorAccentColor: '#BF9824',
    playerAccentColor: '#C7652B',
    image: resultGabrielImage,
    imageWidth: 160,
    imageHeight: Math.round(150 * (840 / 549)),
  },
  draw: {
    label: 'BALLE AU CENTRE !',
    gradient: ['#70BBFF', '#4555D1'],
    bannerColor: '#004580CC',
    labelColor: '#AAD4FF',
    panelColor: '#AAD4FF',
    predictionPanelColor: '#EAF4FF',
    authorAccentColor: '#BF9824',
    playerAccentColor: '#C7652B',
    image: resultDrawImage,
    imageWidth: 160,
    imageHeight: Math.round(150 * (840 / 549)),
  },
}

const overlayGradient = ['#E0DBD7', '#6E6764'] as const
const bannerBlurStyle = Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as unknown as ViewStyle) : undefined

const CardRoot = styled(YStack, {
  position: 'relative',
  alignSelf: 'stretch',
  width: '100%',
  marginTop: 124,
  borderRadius: CARD_RADIUS,
  paddingHorizontal: 22,
  paddingBottom: 20,
  overflow: 'visible',
})

const Banner = styled(XStack, {
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  width: '88%',
  minHeight: 58,
  paddingHorizontal: '$medium',
  paddingVertical: '$small',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
})

const Panel = styled(YStack, {
  alignSelf: 'stretch',
  gap: '$medium',
  marginTop: -1,
  paddingTop: '$large',
  paddingHorizontal: '$medium',
  paddingBottom: '$medium',
  borderRadius: PANEL_RADIUS,
})

const ScoreSquare = styled(View, {
  width: 46,
  height: 52,
  borderRadius: 10,
  backgroundColor: '$white1',
  alignItems: 'center',
  justifyContent: 'center',
})

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  imageLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: IMAGE_TOP,
    alignItems: 'center',
  },
})

function RealScoreTeam({ team, value, reverse }: { team: PronoTeam; value: number; reverse?: boolean }) {
  const score = (
    <ScoreSquare>
      <Text bold fontSize={28} color={PANEL_TEXT_COLOR}>
        {value}
      </Text>
    </ScoreSquare>
  )
  const teamLabel = (
    <>
      <Text fontSize={24}>{team.flag}</Text>
      <Text bold fontSize={27} color={PANEL_TEXT_COLOR}>
        {team.code}
      </Text>
    </>
  )

  return (
    <XStack alignItems="center" gap="$xsmall">
      {reverse ? score : teamLabel}
      {reverse ? teamLabel : score}
    </XStack>
  )
}

type PronoResultCardProps = {
  variant: PronoResultVariant
  homeTeam: PronoTeam
  awayTeam: PronoTeam
  result: PronoScore
  authorPrediction: PronoScore
  playerPrediction: PronoScore
  footer?: ReactNode
}

export default function PronoResultCard({ variant, homeTeam, awayTeam, result, authorPrediction, playerPrediction, footer }: PronoResultCardProps) {
  const config = VARIANTS[variant]

  return (
    <CardRoot>
      <RNView style={styles.gradientBg}>
        <LinearGradient colors={[...config.gradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[...overlayGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { opacity: 0.1 }]} />
      </RNView>
      <View style={styles.imageLayer} pointerEvents="none">
        <Image source={config.image} style={{ width: config.imageWidth, height: config.imageHeight }} contentFit="contain" />
      </View>
      <YStack zIndex={1} gap={0}>
        <YStack height={SPACER_HEIGHT} justifyContent="flex-end" paddingBottom="$medium">
          <PronoBadge marginLeft={0} />
        </YStack>
        <Banner backgroundColor={config.bannerColor} style={bannerBlurStyle}>
          <Text
            fontFamily={PLAAK_44_BOLD}
            fontWeight="700"
            fontSize={32}
            lineHeight={32}
            letterSpacing={-0.96}
            color={config.labelColor}
            textAlign="center"
          >
            {config.label}
          </Text>
        </Banner>
        <Panel backgroundColor={config.panelColor}>
          <XStack alignItems="center" justifyContent="center" gap="$small">
            <RealScoreTeam team={homeTeam} value={result.home} />
            <Text bold fontSize={24} color={PANEL_TEXT_COLOR}>
              -
            </Text>
            <RealScoreTeam team={awayTeam} value={result.away} reverse />
          </XStack>
          <PronoPronosticsCard
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            authorPrediction={authorPrediction}
            playerPrediction={playerPrediction}
            locked
            backgroundColor={config.panelColor}
            innerBackgroundColor={config.predictionPanelColor}
            authorScoreColor={config.authorAccentColor}
            playerScoreColor={config.playerAccentColor}
            compact
          />
        </Panel>
        {footer ? <YStack marginTop="$medium">{footer}</YStack> : null}
      </YStack>
    </CardRoot>
  )
}
