import { ReactNode } from 'react';
import { Platform, View as RNView, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { styled, View, XStack, YStack } from 'tamagui';



import Text from '@/components/base/Text';
import Title from '@/components/Title/Title';



import heroImage from '../assets/gabriel-attal-ball.png';
import { PronoMatchView } from '../model';
import { formatScore, formatTeamLabel } from '../utils';
import PronoBadge from './PronoBadge';

const MATCH_REGION_HEIGHT = 355
const IMAGE_WIDTH = 230
const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * (842 / 463))
const PANEL_RADIUS = 24
const PANEL_PADDING_BOTTOM = 15
const GLOW_WIDTH = 320
const GLOW_HEIGHT = 210

const PanelFrame = styled(YStack, {
  position: 'relative',
  alignSelf: 'stretch',
  width: '100%',
  marginTop: '$xxlarge',
  paddingHorizontal: '$medium',
  paddingBottom: '$medium',
})

const MatchRegion = styled(YStack, {
  position: 'relative',
  height: MATCH_REGION_HEIGHT,
  justifyContent: 'flex-end',
})

const PronosticBox = styled(XStack, {
  alignSelf: 'flex-start',
  alignItems: 'center',
  gap: '$small',
  backgroundColor: '#F5F6FFCC',
  borderRadius: 12,
  padding: '$small',
})

const ScoreBox = styled(View, {
  width: 60,
  height: 40,
  borderRadius: 8,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
})

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: PANEL_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  imageLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -PANEL_PADDING_BOTTOM,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blurClip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -16,
    right: -16,
    borderRadius: PANEL_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
  },
  glow: {
    marginTop: 180,
    width: GLOW_WIDTH,
    height: GLOW_HEIGHT,
  },
})

const baseGradient = ['#29C45D', '#4555D1'] as const
const overlayGradient = ['#E0DBD7', '#6E6764'] as const
const softWhite = '#FFFFFF'

const glowWebStyle = {
  backgroundImage: 'radial-gradient(50% 50% at 50% 50%, rgba(69,85,209,0.95) 0%, rgba(69,85,209,0.6) 55%, rgba(69,85,209,0) 100%)',
} as unknown as ViewStyle

type PronoMatchCardProps = {
  match: PronoMatchView
  showAuthorPrediction?: boolean
  showBadge?: boolean
  image?: number | { uri: string }
  imageWidth?: number
  imageHeight?: number
  cropAfterKickoff?: boolean
  panelPaddingBottom?: number
  contentOffsetY?: number
  children?: ReactNode
}

export default function PronoMatchCard({
  match,
  showAuthorPrediction = true,
  showBadge = false,
  image = heroImage,
  imageWidth = IMAGE_WIDTH,
  imageHeight = IMAGE_HEIGHT,
  cropAfterKickoff = false,
  panelPaddingBottom = PANEL_PADDING_BOTTOM,
  contentOffsetY = 0,
  children,
}: PronoMatchCardProps) {
  const imageSource = match.imageUrl ? { uri: match.imageUrl } : image
  const overflowTop = imageHeight - MATCH_REGION_HEIGHT
  const imageTop = -overflowTop + (cropAfterKickoff ? 36 : 0)

  return (
    <PanelFrame paddingBottom={cropAfterKickoff ? '$small' : '$medium'}>
      <RNView style={styles.gradientBg}>
        <LinearGradient colors={[...baseGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[...overlayGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { opacity: 0.1 }]} />
      </RNView>
      {showBadge ? <PronoBadge position="absolute" top="$medium" left="$medium" zIndex={2} /> : null}
      <MatchRegion>
        <RNView style={styles.blurClip} pointerEvents="none">
          {Platform.OS === 'web' ? (
            <RNView style={[styles.glow, glowWebStyle]} />
          ) : (
            <RNView style={styles.glow}>
              <Svg width={GLOW_WIDTH} height={GLOW_HEIGHT}>
                <Defs>
                  <RadialGradient id="pronoGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0%" stopColor="#4555D1" stopOpacity={0.95} />
                    <Stop offset="55%" stopColor="#4555D1" stopOpacity={0.6} />
                    <Stop offset="100%" stopColor="#4555D1" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Ellipse cx={GLOW_WIDTH / 2} cy={GLOW_HEIGHT / 2} rx={GLOW_WIDTH / 2} ry={GLOW_HEIGHT / 2} fill="url(#pronoGlow)" />
              </Svg>
            </RNView>
          )}
        </RNView>
        <View style={[styles.imageLayer, { top: imageTop, bottom: -panelPaddingBottom }]} pointerEvents="none">
          <Image source={imageSource} style={{ width: imageWidth, height: imageHeight }} contentFit="contain" />
        </View>
        <YStack width="100%" height={cropAfterKickoff ? undefined : 145} gap="$medium" zIndex={1} marginBottom={contentOffsetY}>
          <YStack gap="$xsmall">
            <Text.MD semibold lineHeight={14} letterSpacing={0} color={softWhite}>
              {match.label}
            </Text.MD>
            <Title.Text color="white">{formatTeamLabel(match.homeTeam, match.awayTeam)}</Title.Text>
            <Text.LG bold lineHeight={16} letterSpacing={0} color={softWhite}>
              {match.kickoffLabel}
            </Text.LG>
          </YStack>
          {children
            ? children
            : showAuthorPrediction && match.authorPrediction ? (
                <PronosticBox>
                  <Text.SM semibold color="black" maxWidth={90} multiline>
                    Le pronostic de Gabriel Attal
                  </Text.SM>
                  <ScoreBox>
                    <Text bold fontSize={20} color="#27221F">
                      {formatScore(match.authorPrediction)}
                    </Text>
                  </ScoreBox>
                </PronosticBox>
              ) : null}
        </YStack>
      </MatchRegion>
    </PanelFrame>
  )
}
