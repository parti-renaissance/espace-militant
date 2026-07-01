import React from 'react'
import { XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxSimpleModal from '@/components/VoxSimpleModal'

import { useActionFormContext } from '../helpers/context'

export default function ActionCancelModal() {
  const { cancelModalRef, isCancelPending, onConfirmCancel } = useActionFormContext()

  return (
    <VoxSimpleModal ref={cancelModalRef}>
      <YStack gap="$medium" padding="$medium">
        <Text fontSize={16} fontWeight="$6">
          Annuler cette action ?
        </Text>
        <Text secondary>Cette action sera annulée et ne sera plus visible pour les militants. Cette opération est irréversible.</Text>
        <XStack gap="$medium" justifyContent="flex-end">
          <VoxButton variant="outlined" theme="gray" onPress={() => cancelModalRef.current?.close()}>
            Retour
          </VoxButton>
          <VoxButton theme="orange" variant="contained" loading={isCancelPending} onPress={onConfirmCancel}>
            Confirmer l’annulation
          </VoxButton>
        </XStack>
      </YStack>
    </VoxSimpleModal>
  )
}
