import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import { useScanTicket } from '@/services/tickets/hook'
import { ScanTicketResponse } from '@/services/tickets/schema'
import { User, Ticket, Clock, ScanQrCode, QrCode } from '@tamagui/lucide-icons'
import { Button, Card, YStack, XStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import StatusIndicator from '../components/StatusIndicator'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

const { width, height } = Dimensions.get('window')

export default function TicketScannerPage() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [ticketData, setTicketData] = useState<ScanTicketResponse | null>(null)
  const [lastScannedId, setLastScannedId] = useState<string | null>(null)
  const scanTicketMutation = useScanTicket()
  const toast = useToastController()
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScanTicket = useCallback((data: string) => {
    console.log('QR Code scanné:', data)

    // Vérifier si c'est le même ticket que le dernier scanné
    if (lastScannedId === data) {
      console.log('Même ticket que le dernier scanné, ignoré')
      return
    }
    setScanned(true)
    // Appeler l'API pour vérifier le ticket
    scanTicketMutation.mutate(
      { qrCodeId: data },
      {
        onSettled: () => {
          // Annuler le timeout précédent s'il existe
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current)
          }

          // Programmer le reset de scanned à false dans 5 secondes
          resetTimeoutRef.current = setTimeout(() => {
            setScanned(false)
            resetTimeoutRef.current = null
          }, 5000)
        },
        onSuccess: (response) => {
          setTicketData(response)
          setLastScannedId(data)
        },
        onError: (error) => {
          console.error('Erreur lors du scan:', error)
          toast.show('Erreur', { message: 'Impossible de vérifier le ticket. Veuillez réessayer.', type: 'error' })
        },
      }
    )
  }, [scanTicketMutation, lastScannedId])

  // Nettoyer le timeout au démontage du composant
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  const handleBarCodeScanned = useCallback(({ type, data }: BarcodeScanningResult) => {
    if (scanned) return

    handleScanTicket(data)
  }, [scanned, handleScanTicket])


  if (!permission) {
    return <YStack />
  }

  if (!permission.granted) {
    return (
      <YStack flex={1} gap="$medium" justifyContent="center" alignItems="center">
        <YStack backgroundColor="$gray5" w={64} h={64} borderRadius={32} justifyContent="center" alignItems="center">
          <QrCode size={32} color="white" />
        </YStack>
        <Text.LG maxWidth={320} textWrap="balance" primary semibold textAlign="center">Nous avons besoin de votre permission pour utiliser la caméra</Text.LG>
        <YStack>
          <VoxButton onPress={requestPermission}>
            Accorder la permission
          </VoxButton>
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$textSurface">
      <YStack style={styles.cameraSection}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame} />
            </View>
            <Text style={styles.instructionText}>
              Pointez la caméra vers le QR code du ticket
            </Text>
          </View>
        </CameraView>
      </YStack>

      <YStack flex={1}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <YStack maxWidth={520} width="100%" marginHorizontal="auto">
            {!ticketData ? (
              <YStack gap="$medium" paddingVertical="$medium">
                <YStack gap="$small" alignItems="center" justifyContent="center">
                  <YStack backgroundColor="$gray6" w={64} h={64} borderRadius={32} justifyContent="center" alignItems="center">
                    <Ticket size={32} color="white" />
                  </YStack>
                  <YStack>
                    <Text.LG fontSize={24} textAlign="center" color="$gray6">
                      Scanner de tickets
                    </Text.LG>
                    <Text.MD secondary textAlign="center">
                      Scannez un QR code pour voir les informations ici
                    </Text.MD>
                  </YStack>
                </YStack>
              </YStack>
            ) : (
              <YStack gap="$medium" paddingVertical="$medium">
                <StatusIndicator ticket={ticketData} />
                <VoxCard>
                  <VoxCard.Content>
                    <YStack gap="$small">
                      <XStack alignItems="center" space="$2">
                        <Ticket size={16} color="$gray10" />
                        <Text style={styles.label}>ID:</Text>
                        <Text style={styles.value}>{ticketData.id}</Text>
                      </XStack>

                      {ticketData.userName && (
                        <XStack alignItems="center" space="$2">
                          <User size={16} color="$gray10" />
                          <Text style={styles.label}>Nom:</Text>
                          <Text style={styles.value}>{ticketData.userName}</Text>
                        </XStack>
                      )}

                      {ticketData.type && (
                        <XStack alignItems="center" space="$2">
                          <Ticket size={16} color="$gray10" />
                          <Text style={styles.label}>Type:</Text>
                          <Text style={styles.value}>{ticketData.type}</Text>
                        </XStack>
                      )}

                    </YStack>
                  </VoxCard.Content>
                </VoxCard>
                {ticketData.scannedAt && (
                  <XStack alignItems="center" space="$2">
                    <Clock size={16} color="$gray10" />
                    <Text style={styles.label}>Scanné le:</Text>
                    <Text style={styles.value}>
                      {new Date(ticketData.scannedAt).toLocaleString('fr-FR')}
                    </Text>
                  </XStack>
                )}
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  cameraSection: {
    height: height * 0.4, // 40% de la hauteur pour la caméra
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 150,
    height: 150,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'yellow',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})
