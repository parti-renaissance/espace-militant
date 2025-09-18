import React, { useState, useRef, useCallback, useEffect } from 'react'
import { ActivityIndicator, Dimensions } from 'react-native'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import { useScanTicket } from '@/services/tickets/hook'
import { ScanTicketResponse } from '@/services/tickets/schema'
import { Tickets, CameraOff } from '@tamagui/lucide-icons'
import { YStack, XStack, ScrollView, View, useMedia } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import StatusIndicator, { StatusIndicatorSkeleton } from '../components/StatusIndicator'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ActivistTags from '@/components/ActivistTags'
import SkeCard from '@/components/Skeleton/CardSkeleton'

const { width, height } = Dimensions.get('window')

export default function TicketScannerPage() {
  const media = useMedia()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [ticketData, setTicketData] = useState<ScanTicketResponse | null>(null)
  const [lastScannedId, setLastScannedId] = useState<string | null>(null)
  const scanTicketMutation = useScanTicket()
  const toast = useToastController()
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScanTicket = useCallback((ticketUuid: string) => {
    // Vérifier si c'est le même ticket que le dernier scanné
    if (lastScannedId === ticketUuid) {
      return
    }
    setScanned(true)
    // Appeler l'API pour vérifier le ticket
    scanTicketMutation.mutate(
      ticketUuid,
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
          setLastScannedId(ticketUuid)
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
      <YStack height={height * 0.4} backgroundColor="black" position="relative">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="transparent"
          justifyContent="center"
          alignItems="center"
        >
          <View width={150} height={150} marginTop={32} justifyContent="center" alignItems="center">
            <View width="100%" height="100%" borderWidth={8} borderColor={scanned ? '$gray7' : '#F5D900'} borderRadius={10} backgroundColor="transparent" justifyContent="center" alignItems="center">
              {scanTicketMutation.isPending && <ActivityIndicator size="large" color="#F5D900" />}
            </View>
          </View>
          <Text color="white" fontSize={14} textAlign="center" opacity={scanned ? 0 : 1} marginTop={15} paddingHorizontal={20}>
            Pointez la caméra vers le QR code du ticket
          </Text>
        </View>
      </YStack>

      <YStack flex={1}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack maxWidth={media.gtSm ? 520 : undefined} paddingBottom={100} width="100%" marginHorizontal="auto">
            {scanTicketMutation.isPending ? (
              <SkeCard>
                <SkeCard.Content>
                  <StatusIndicatorSkeleton />
                  <YStack backgroundColor="#F7F7F7" height={50} borderRadius="$medium" />
                  <YStack backgroundColor="#F7F7F7" height={200} borderRadius="$medium" />
                </SkeCard.Content>
              </SkeCard>
            ) : !ticketData ? (
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

                {(ticketData.type || ticketData.alert) && (
                  <YStack gap="$medium" mt="$small">
                    {ticketData.type?.label && (
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
                )}

                {/* Informations utilisateur */}
                {ticketData.user && (
                  <VoxCard>
                    <VoxCard.Content>
                      <YStack gap="$small">
                        <YStack gap="$xsmall">
                          <Text.MD secondary regular>{ticketData.user.public_id}</Text.MD>
                          <Text.LG primary semibold>{ticketData.user.civility && `${ticketData.user.civility} `}{ticketData.user.first_name} {ticketData.user.last_name}</Text.LG>
                        </YStack>
                        {ticketData.user.tags && ticketData.user.tags.length > 0 && (
                          <ActivistTags tags={ticketData.user.tags} />
                        )}
                        {ticketData.user.age && (
                          <Text.MD secondary regular>{ticketData.user.age} ans</Text.MD>
                        )}

                        <YStack>
                          {ticketData.visit_day && (
                            <Text.MD regular>{ticketData.visit_day}</Text.MD>
                          )}
                          {ticketData.transport && (
                            <Text.MD regular>{ticketData.transport}</Text.MD>
                          )}
                          {ticketData.accommodation && (
                            <Text.MD regular>{ticketData.accommodation}</Text.MD>
                          )}
                        </YStack>
                      </YStack>
                    </VoxCard.Content>
                  </VoxCard>
                )}
                {ticketData.scan_history ? (
                  <YStack gap="$small" mx="$medium">
                    <Text.LG secondary>Historique des scans</Text.LG>
                    {ticketData.scan_history && ticketData.scan_history.length > 0 ? (
                      ticketData.scan_history.map((scan, index) => (
                        <XStack key={index} alignItems="center" justifyContent="space-between">
                          <Text.SM primary medium>
                            {new Date(scan.date).toLocaleString('fr-FR')}
                          </Text.SM>
                          <Text.SM secondary>
                            {scan.name} ({scan.public_id})
                          </Text.SM>

                        </XStack>
                      ))
                    ) : (
                      <Text.SM secondary regular>Aucun historique de scan</Text.SM>
                    )}
                  </YStack>
                ) : null }
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  )
}

