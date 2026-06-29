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

import launchPhones from '../assets/prono-launch-phones.png'
import { PronoMatchView, PronoScore } from '../model'
import { PronoSignupCardContent } from './PronoSignupCard'

const CARD_MAX_WIDTH = 1136
const CARD_MAX_HEIGHT = isWeb ? 'calc(100dvh - 48px)' : '100%'
const CARD_MIN_HEIGHT = 560
const CARD_BACKGROUND = '#FAF7F4'
const BADGE_BACKGROUND = '#F2FCF3'
const BADGE_TEXT = '#34A044'
const CLOSE_TEXT = '#554F4C'

const LEFT_GRADIENT = ['#29C45D', '#4555D1'] as const

function LeftColumn() {
  return (
    <YStack width="50%" minWidth={300} height="100%" alignItems="center" justifyContent="center" overflow="hidden" position="relative">
      <LinearGradient colors={[...LEFT_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <Image source={launchPhones} style={styles.launchImage} contentFit="contain" />
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

          <PronoSignupCardContent match={match} playerPrediction={playerPrediction} showGlow={false} />

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
      <View flex={1} backgroundColor="rgba(135,151,168,0.2)" style={Platform.select({ web: { backdropFilter: 'blur(30px)', height: '100dvh' } as object })}>
        <Pressable style={styles.backdrop} onPress={(event) => event.target === event.currentTarget && onClose()}>
          <XStack
            width="100%"
            maxWidth={CARD_MAX_WIDTH}
            height="100%"
            minHeight={CARD_MIN_HEIGHT}
            maxHeight={CARD_MAX_HEIGHT}
            borderRadius="$medium"
            overflow="hidden"
            backgroundColor={CARD_BACKGROUND}
            alignItems="stretch"
            shadowColor="#919EAB"
            shadowOffset={{ width: 0, height: -24 }}
            shadowOpacity={0.16}
            shadowRadius={48}
            elevation={12}
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
  launchImage: {
    width: 400,
    maxWidth: '90%',
    aspectRatio: 1428 / 1940,
  },
  storeBadge: {
    width: 180,
    height: 53,
  },
})
