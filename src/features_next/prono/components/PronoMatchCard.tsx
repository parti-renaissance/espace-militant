import { View as RNView, StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { styled, View, XStack, YStack } from 'tamagui';

import Text from '@/components/base/Text';
import Title from '@/components/Title/Title';

import heroImage from '../assets/gabriel-attal-onboarding-prono.png';
import { PronoMatchView } from '../model';
import { formatScore, formatTeamLabel } from '../utils';

const MATCH_REGION_HEIGHT = 355
const IMAGE_WIDTH = 230
const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * (842 / 463))
const IMAGE_OVERFLOW_TOP = IMAGE_HEIGHT - MATCH_REGION_HEIGHT
const PANEL_RADIUS = 24
const PANEL_PADDING_BOTTOM = 15
const GLOW_WIDTH = 320
const GLOW_HEIGHT = 180

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
    top: -IMAGE_OVERFLOW_TOP,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  blurClip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -16,
    right: -16,
    borderRadius: PANEL_RADIUS,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 180,
    left: -16,
  },
})

const baseGradient = ['#29C45D', '#4555D1'] as const
const overlayGradient = ['#E0DBD7', '#6E6764'] as const
const softWhite = '#FFFFFF'

type PronoMatchCardProps = {
  match: PronoMatchView
}

export default function PronoMatchCard({ match }: PronoMatchCardProps) {
  const imageSource = match.imageUrl ? { uri: match.imageUrl } : heroImage

  return (
    <PanelFrame>
      <RNView style={styles.gradientBg}>
        <LinearGradient colors={[...baseGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[...overlayGradient]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { opacity: 0.1 }]} />
      </RNView>
      <MatchRegion>
        <View style={styles.imageLayer} pointerEvents="none">
          <Image source={imageSource} style={styles.image} contentFit="contain" />
        </View>
        <RNView style={styles.blurClip} pointerEvents="none">
          <Svg width={GLOW_WIDTH} height={GLOW_HEIGHT} style={styles.glow}>
            <Defs>
              <RadialGradient id="pronoGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#4555D1" stopOpacity={0.95} />
                <Stop offset="55%" stopColor="#4555D1" stopOpacity={0.6} />
                <Stop offset="100%" stopColor="#4555D1" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#pronoGlow)" />
          </Svg>
        </RNView>
        <YStack width="100%" height={145} gap="$medium" zIndex={1}>
          <YStack gap="$xsmall">
            <Text.MD semibold lineHeight={14} letterSpacing={0} color={softWhite}>
              {match.label}
            </Text.MD>
            <Title.Text color="white">{formatTeamLabel(match.homeTeam, match.awayTeam)}</Title.Text>
            <Text.LG bold lineHeight={16} letterSpacing={0} color={softWhite}>
              {match.kickoffLabel}
            </Text.LG>
          </YStack>
          {match.authorPrediction ? (
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
