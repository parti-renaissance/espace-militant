import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { OtaPhase, UpdateGatewayMode } from '@/features_next/update/hooks/useUpdateGateway'

import { blue, white } from '../../../../theme/colors.hex'
import updateRefreshImg from '../assets/updateRefresh.png'

type UpdateGatewayScreenProps = {
  mode: Exclude<UpdateGatewayMode, 'ready'>
  otaPhase: OtaPhase | null
  error: Error | null
  isStoreActionPending: boolean
  onRetry: () => void
  onOpenStore: () => void
}

const otaPhaseMessage: Record<OtaPhase, string> = {
  downloading: 'Téléchargement de la mise à jour…',
  preparing_reload: 'Préparation du redémarrage…',
  reloading: 'Redémarrage de l’application…',
}

export default function UpdateGatewayScreen({
  mode,
  otaPhase,
  error,
  isStoreActionPending,
  onRetry,
  onOpenStore,
}: UpdateGatewayScreenProps) {
  const insets = useSafeAreaInsets()

  if (error) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.content}>
          <Image source={updateRefreshImg} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>Mise à jour interrompue</Text>
          <Text style={styles.subtitle}>{error.message}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onRetry}>
          <Text style={styles.buttonLabel}>Réessayer</Text>
        </Pressable>
      </View>
    )
  }

  if (mode === 'store') {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.content}>
          <Image source={updateRefreshImg} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>Nouvelles fonctionnalités disponibles !</Text>
          <Text style={styles.subtitle}>
            Mettez à jour votre application depuis votre store pour découvrir les nouveautés.
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isStoreActionPending && styles.buttonDisabled]}
          onPress={onOpenStore}
          disabled={isStoreActionPending}
        >
          {isStoreActionPending ? (
            <ActivityIndicator color={white.white1} />
          ) : (
            <Text style={styles.buttonLabel}>Mettre à jour</Text>
          )}
        </Pressable>
      </View>
    )
  }

  const message = otaPhase ? otaPhaseMessage[otaPhase] : 'Mise à jour en cours…'

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.content}>
        <Image source={updateRefreshImg} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Mise à jour en cours</Text>
        <Text style={styles.subtitle}>{message}</Text>
        <ActivityIndicator size="large" color={blue.blue500} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
  },
  button: {
    width: '100%',
    height: 44,
    backgroundColor: blue.blue500,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: blue.blue600,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: white.white1,
    fontSize: 14,
    fontWeight: '600',
  },
})
