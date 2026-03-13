import React, { useState } from 'react'
import { Alert, Linking } from 'react-native'
import { XStack, YStack } from 'tamagui'
import { Mail, MessageCircle, Phone } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

import type { IconComponent } from '@/models/common.model'
import { useAdherentEmail, useAdherentPhone } from '@/services/adherents/hook'

function ActionButton({ Icon, label, onPress, disabled }: { Icon: IconComponent; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <YStack
      onPress={disabled ? undefined : onPress}
      alignItems="center"
      justifyContent="center"
      gap="$small"
      bg="$gray1"
      paddingVertical={12}
      paddingHorizontal={16}
      borderRadius="$small"
      flex={1}
      flexBasis={0}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      hoverStyle={disabled ? undefined : { bg: '$gray2' }}
      pressStyle={disabled ? undefined : { bg: '$gray3' }}
    >
      <Icon size={16} color="$textPrimary" />
      <Text.SM primary semibold>
        {label}
      </Text.SM>
    </YStack>
  )
}

export interface MilitantActionButtonsProps {
  uuid: string | undefined
  scope: string | undefined
  smsAvailable?: boolean
}

type ActionType = 'sms' | 'call' | 'email'

export function MilitantActionButtons({ uuid, scope, smsAvailable = true }: MilitantActionButtonsProps) {
  const [loadingAction, setLoadingAction] = useState<ActionType | null>(null)

  const phoneQuery = useAdherentPhone(uuid, scope)
  const emailQuery = useAdherentEmail(uuid, scope)

  // Fonction générique pour gérer le clic, le fetch, le fallback d'erreur et l'ouverture de l'app
  const executeAction = async (
    actionName: ActionType,
    query: ReturnType<typeof useAdherentPhone | typeof useAdherentEmail>,
    extractData: (data: any) => string | undefined,
    urlPrefix: string,
    errorMessage: string,
  ) => {
    if (!uuid || !scope) {
      Alert.alert('Erreur', errorMessage)
      return
    }

    setLoadingAction(actionName)

    try {
      let value = query.data ? extractData(query.data) : null

      if (!value) {
        const result = await query.refetch()
        value = result.data ? extractData(result.data) : null
      }

      if (!value) {
        Alert.alert('Erreur', errorMessage)
        return
      }

      Linking.openURL(`${urlPrefix}${value}`)
    } catch {
      Alert.alert('Erreur', errorMessage)
    } finally {
      setLoadingAction(null)
    }
  }

  const isGlobalLoading = loadingAction !== null

  return (
    <XStack px="$medium" mt="$medium" gap="$small">
      <ActionButton
        Icon={MessageCircle}
        label={loadingAction === 'sms' ? 'SMS…' : 'SMS'}
        onPress={() => executeAction('sms', phoneQuery, (d) => d?.phone, 'sms:', 'Impossible de récupérer le numéro de téléphone.')}
        disabled={!smsAvailable || isGlobalLoading}
      />
      <ActionButton
        Icon={Phone}
        label={loadingAction === 'call' ? 'Appel…' : 'Appeler'}
        onPress={() => executeAction('call', phoneQuery, (d) => d?.phone, 'tel:', 'Impossible de récupérer le numéro de téléphone.')}
        disabled={!smsAvailable || isGlobalLoading}
      />
      <ActionButton
        Icon={Mail}
        label={loadingAction === 'email' ? 'Email…' : 'Email'}
        onPress={() => executeAction('email', emailQuery, (d) => d?.email, 'mailto:', "Impossible de récupérer l'adresse email.")}
        disabled={isGlobalLoading}
      />
    </XStack>
  )
}
