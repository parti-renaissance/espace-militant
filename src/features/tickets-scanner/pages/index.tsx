import React, { useState, useRef, useCallback, useEffect } from 'react'
import { ActivityIndicator, Dimensions } from 'react-native'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import { useScanTicket } from '@/services/tickets/hook'
import { ScanTicketResponse } from '@/services/tickets/schema'
import { User, Tickets, CameraOff, MapPin, Car, Home } from '@tamagui/lucide-icons'
import { YStack, XStack, ScrollView, View } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import StatusIndicator from '../components/StatusIndicator'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ActivistTags from '@/components/ActivistTags'

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
          }, 1000)
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


  const handleRequestPermission = useCallback(async () => {
    try {
      const result = await requestPermission()

      if (!result.granted) {
        toast.show('Permission refusée', {
          message: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de l\'appareil',
          type: 'error'
        })
      }
    } catch (error) {
      toast.show('Erreur', {
        message: 'Impossible de demander la permission. Veuillez réessayer.',
        type: 'error'
      })
    }
  }, [requestPermission])


  if (!permission) {
    return <YStack />
  }

  if (!permission.granted) {
    return (
      <YStack flex={1} backgroundColor="$textSurface">
        <YStack height={height * 0.4} backgroundColor="black">
          <YStack flex={1} backgroundColor="black">
            <View flex={1} backgroundColor="transparent" justifyContent="center" alignItems="center">
              <View width={150} height={150} marginTop={32} justifyContent="center" alignItems="center">
                <View width="100%" height="100%" borderWidth={8} borderColor="#F5D900" borderRadius={10} backgroundColor="transparent" />
              </View>
            </View>
          </YStack>
        </YStack>
        <YStack paddingVertical="$medium" gap="$medium" alignItems="center" justifyContent="center" height={height * 0.4}>
          <CameraOff size={96} color="$orange9" />
          <YStack maxWidth={360} mx="auto" gap="$medium">
            <Text.LG textAlign="center" primary semibold>
              Autoriser l'accès à l'appareil photo
            </Text.LG>
            <Text.MD primary textAlign="center">
              L'usage de l'appareil photo est nécessaire au scan des billets.
            </Text.MD>
          </YStack>
          <YStack>
            <VoxButton
              onPress={handleRequestPermission}
              variant="outlined"
            >
              J'autorise
            </VoxButton>
          </YStack>
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$textSurface">
      <YStack height={height * 0.4} backgroundColor="black">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View flex={1} backgroundColor="transparent" justifyContent="center" alignItems="center">
            <View width={150} height={150} marginTop={32} justifyContent="center" alignItems="center">
              <View width="100%" height="100%" borderWidth={8} borderColor={scanned ? '#E0C600' : '#F5D900'} borderRadius={10} backgroundColor="transparent" justifyContent="center" alignItems="center">
                {scanTicketMutation.isPending && <ActivityIndicator size="large" color="#F5D900" />}
              </View>
            </View>
            <Text color="white" fontSize={14} textAlign="center" marginTop={15} paddingHorizontal={20}>
              Pointez la caméra vers le QR code du ticket
            </Text>
          </View>
        </CameraView>
      </YStack>

      <YStack flex={1}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack $gtSm={{ maxWidth: 520 }} width="100%" marginHorizontal="auto">
            {!ticketData ? (
              <YStack paddingVertical="$medium" gap="$medium" alignItems="center" justifyContent="center" height={height * 0.4}>
                <Tickets size={96} color="$blue9" />
                <YStack maxWidth={360} mx="auto" gap="$medium">
                  <Text.LG textAlign="center" primary semibold>
                    Lancez un premier scan de billet pour commencer
                  </Text.LG>
                  <Text.MD primary textAlign="center">
                    Pour lancer un premier scan, pointez votre appareil photo vers le QR code d’un billet.
                  </Text.MD>
                </YStack>
              </YStack>
            ) : (
              <YStack gap="$medium" paddingVertical="$medium">
                <StatusIndicator ticket={ticketData} />

                <YStack gap="$medium" mt="$small">
                  {ticketData.type && (
                    <YStack backgroundColor={ticketData.type.color} borderRadius="$medium" padding="$medium" mx="$medium">
                      <Text.LG textAlign="center" color="white">
                        {ticketData.type.label}
                      </Text.LG>
                    </YStack>
                  )}

                  {ticketData.alert && (
                    <YStack backgroundColor="$blue1" borderRadius="$medium" padding="$medium" borderColor="$blue3" borderWidth={2} mx="$medium">
                      <Text.LG textAlign="center" color="$blue6">
                        {ticketData.alert}
                      </Text.LG>
                    </YStack>
                  )}
                </YStack>

                {/* Informations utilisateur */}
                {ticketData.user && (
                  <VoxCard>
                    <VoxCard.Content>
                      <YStack gap="$small">
                        <Text.SM fontWeight="600" color="#333" marginBottom="$xs">Informations utilisateur</Text.SM>
                        <XStack alignItems="center">
                          <User size={16} color="$gray10" />
                          <Text fontSize={12} fontWeight="600" color="#666">Nom:</Text>
                          <Text fontSize={12} color="#333" flex={1}>
                            {ticketData.user.civility && `${ticketData.user.civility} `}
                            {ticketData.user.first_name} {ticketData.user.last_name}
                          </Text>
                        </XStack>

                        {ticketData.user.age && (
                          <XStack alignItems="center">
                            <User size={16} color="$gray10" />
                            <Text fontSize={12} fontWeight="600" color="#666">Âge:</Text>
                            <Text fontSize={12} color="#333" flex={1}>{ticketData.user.age} ans</Text>
                          </XStack>
                        )}

                        {ticketData.user.tags && ticketData.user.tags.length > 0 && (
                          <YStack gap="$xs">
                            <Text fontSize={12} fontWeight="600" color="#666">Tags:</Text>
                            <ActivistTags tags={ticketData.user.tags} />
                          </YStack>
                        )}
                      </YStack>
                    </VoxCard.Content>
                  </VoxCard>
                )}

                {/* Informations de l'événement */}
                {(ticketData.visit_day || ticketData.transport || ticketData.accommodation) && (
                  <VoxCard>
                    <VoxCard.Content>
                      <YStack gap="$small">
                        <Text.SM fontWeight="600" color="#333" marginBottom="$xs">Détails de l'événement</Text.SM>
                        {ticketData.visit_day && (
                          <XStack alignItems="center">
                            <MapPin size={16} color="$gray10" />
                            <Text fontSize={12} fontWeight="600" color="#666">Jour:</Text>
                            <Text fontSize={12} color="#333" flex={1}>{ticketData.visit_day}</Text>
                          </XStack>
                        )}

                        {ticketData.transport && (
                          <XStack alignItems="center">
                            <Car size={16} color="$gray10" />
                            <Text fontSize={12} fontWeight="600" color="#666">Transport:</Text>
                            <Text fontSize={12} color="#333" flex={1}>{ticketData.transport}</Text>
                          </XStack>
                        )}

                        {ticketData.accommodation && (
                          <XStack alignItems="center">
                            <Home size={16} color="$gray10" />
                            <Text fontSize={12} fontWeight="600" color="#666">Hébergement:</Text>
                            <Text fontSize={12} color="#333" flex={1}>{ticketData.accommodation}</Text>
                          </XStack>
                        )}
                      </YStack>
                    </VoxCard.Content>
                  </VoxCard>
                )}

                {/* Historique des scans */}
                {ticketData.scanHistory && ticketData.scanHistory.length > 0 && (
                  <YStack gap="$small" mx="$medium">
                    <Text.LG secondary>Historique des scans</Text.LG>
                    {ticketData.scanHistory.map((scan, index) => (
                      <XStack key={index} alignItems="center" justifyContent="space-between">
                        <Text.SM primary medium>
                          {new Date(scan.date).toLocaleString('fr-FR')}
                        </Text.SM>
                        <Text.SM secondary>
                              {scan.name} ({scan.public_id})
                        </Text.SM>
                        
                      </XStack>
                    ))}
                  </YStack>
                )}
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  )
}

