import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { isWeb, ScrollView, View, XStack, YStack } from 'tamagui'
import { CheckCircle2 } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import appStoreBadge from '@/components/ProfileCards/AppDownloadCTA/Assets/app-store-badge-fr.png'
import googlePlayBadge from '@/components/ProfileCards/AppDownloadCTA/Assets/google-play-badge-fr.png'
import Title from '@/components/Title/Title'

import redirectToStore from '@/helpers/redirectToStore'

import phoneGame from '../assets/prono-phone-game.png'
import phoneResult from '../assets/prono-phone-result.png'
import qrStores from '../assets/prono-qr-stores.png'
import { PronoMatchView, PronoScore } from '../model'
import { PronoSignupCardContent } from './PronoSignupCard'

const CARD_MAX_WIDTH = 1136
const CARD_MAX_HEIGHT = isWeb ? 'calc(100dvh - 48px)' : '100%'
const CARD_BACKGROUND = '#FAF7F4'
const BADGE_BACKGROUND = '#F2FCF3'
const BADGE_TEXT = '#34A044'
const CLOSE_TEXT = '#554F4C'

const LEFT_GRADIENT = ['#29C45D', '#4555D1'] as const

const SCREEN_WIDTH = 196
const SCREEN_HEIGHT = Math.round((SCREEN_WIDTH * 844) / 390)
const PHONE_PADDING = 8
const PHONE_BODY_WIDTH = SCREEN_WIDTH + PHONE_PADDING * 2
const PHONE_BODY_HEIGHT = SCREEN_HEIGHT + PHONE_PADDING * 2

const STAGE_WIDTH = 362
const STAGE_HEIGHT = 480
const QR_CARD_SIZE = 130

type PhoneMockProps = {
  source: number
  rotate: string
  top: number
  left: number
  zIndex: number
}

function PhoneMock({ source, rotate, top, left, zIndex }: PhoneMockProps) {
  return (
    <View
      position="absolute"
      top={top}
      left={left}
      zIndex={zIndex}
      width={PHONE_BODY_WIDTH}
      height={PHONE_BODY_HEIGHT}
      backgroundColor="#0B0B0F"
      borderRadius={38}
      padding={PHONE_PADDING}
      style={[styles.phoneShadow, { transform: [{ rotate }] }]}
    >
      <Image source={source} style={styles.phoneScreen} contentFit="cover" />
    </View>
  )
}

function LeftColumn() {
  return (
    <YStack width="50%" minWidth={300} height="100%" alignItems="center" justifyContent="center" overflow="hidden" position="relative">
      <LinearGradient colors={[...LEFT_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />

      <View width={STAGE_WIDTH} height={STAGE_HEIGHT} position="relative">
        <PhoneMock source={phoneResult} rotate="6deg" top={0} left={150} zIndex={1} />
        <PhoneMock source={phoneGame} rotate="-2deg" top={24} left={0} zIndex={2} />

        <View
          position="absolute"
          top={200}
          left={(STAGE_WIDTH - QR_CARD_SIZE) / 2}
          zIndex={3}
          width={QR_CARD_SIZE}
          height={QR_CARD_SIZE}
          backgroundColor="white"
          borderRadius={14}
          alignItems="center"
          justifyContent="center"
          style={styles.qrShadow}
        >
          <Image source={qrStores} style={styles.qrImage} contentFit="contain" />
        </View>
      </View>
    </YStack>
  )
}

type PronoLaunchModalDesktopProps = {
  open: boolean
  onClose: () => void
  match: PronoMatchView
  playerPrediction: PronoScore
}

function RightColumn({ match, playerPrediction, onClose }: PronoLaunchModalDesktopProps) {
  return (
    <YStack flex={1} minWidth={0} height="100%" backgroundColor={CARD_BACKGROUND}>
      <ScrollView flex={1} width="100%" height="100%" minHeight={0} showsVerticalScrollIndicator={false} contentContainerStyle={styles.rightScroll}>
        <YStack width={358} maxWidth="100%" gap={24}>
          <YStack gap={16}>
            <XStack
              alignSelf="flex-start"
              alignItems="center"
              gap={4}
              backgroundColor={BADGE_BACKGROUND}
              borderRadius={999}
              paddingHorizontal={8}
              paddingVertical={4}
            >
              <CheckCircle2 size={12} color={BADGE_TEXT} />
              <Text.SM semibold color={BADGE_TEXT}>
                Compte créé
              </Text.SM>
            </XStack>

            <Title size="h1">
              <Title.Highlight>FÉLICITATIONS</Title.Highlight>
              <Title.Text> 🎉</Title.Text>
              <Title.Break />
              <Title.Text>PRONOSTIC ENREGISTRÉ</Title.Text>
            </Title>
          </YStack>

          <PronoSignupCardContent match={match} playerPrediction={playerPrediction} />

          <Text.MD regular color="$textPrimary" lineHeight={22}>
            Pour être notifié en direct du résultat de votre défi, installez l’application Attal Président.
          </Text.MD>

          <YStack gap={16} alignItems="center">
            <TouchableOpacity onPress={() => redirectToStore('ios')} accessibilityRole="button" accessibilityLabel="Télécharger dans l'App Store">
              <Image source={appStoreBadge} style={styles.storeBadge} contentFit="contain" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => redirectToStore('android')} accessibilityRole="button" accessibilityLabel="Disponible sur Google Play">
              <Image source={googlePlayBadge} style={styles.storeBadge} contentFit="contain" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text.MD semibold color={CLOSE_TEXT} textAlign="center">
                Fermer
              </Text.MD>
            </TouchableOpacity>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}

export default function PronoLaunchModalDesktop({ open, onClose, match, playerPrediction }: PronoLaunchModalDesktopProps) {
  return (
    <Modal animationType="fade" transparent visible={open}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={(event) => event.target === event.currentTarget && onClose()}>
          <XStack
            width="100%"
            maxWidth={CARD_MAX_WIDTH}
            height="100%"
            maxHeight={CARD_MAX_HEIGHT}
            borderRadius="$medium"
            overflow="hidden"
            backgroundColor={CARD_BACKGROUND}
            alignItems="stretch"
            style={styles.cardShadow}
          >
            <LeftColumn />
            <RightColumn open={open} onClose={onClose} match={match} playerPrediction={playerPrediction} />
          </XStack>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(135,151,168,0.2)',
    ...Platform.select({ web: { backdropFilter: 'blur(30px)', height: '100dvh' } as object }),
  },
  backdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    cursor: 'auto',
  },
  rightScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 64,
  },
  cardShadow: {
    shadowColor: '#919EAB',
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 0.16,
    shadowRadius: 48,
    elevation: 12,
  },
  phoneScreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 30,
  },
  phoneShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  qrShadow: {
    shadowColor: 'rgba(0,93,168,0.16)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  qrImage: {
    width: 98,
    height: 98,
  },
  storeBadge: {
    width: 180,
    height: 53,
  },
})
