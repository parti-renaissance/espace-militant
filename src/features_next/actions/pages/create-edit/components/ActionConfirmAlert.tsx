import React, { ComponentRef, forwardRef, memo, useImperativeHandle, useRef } from 'react'
import { Theme, useMedia, XStack, YStack } from 'tamagui'
import { BellDot, Lock, Mail } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'

import { FormFrame } from '@/components/base/FormFrames'
import SwitchGroup from '@/components/base/SwitchGroup/SwitchGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import VoxSimpleModal from '@/components/VoxSimpleModal'

import type { ActionFormValues } from '@/services/actions/paramsMapper'

type ActionConfirmAlertProps = {
  onAccept: () => void | Promise<unknown>
  onCancel?: () => void
  isPending?: boolean
  control: Control<ActionFormValues>
}

type ModalRef = ComponentRef<typeof VoxSimpleModal>

const _ActionConfirmAlert = forwardRef<ModalRef, ActionConfirmAlertProps>((props, ref) => {
  const insideRef = useRef<ModalRef>(null)
  const media = useMedia()

  useImperativeHandle(ref, () => ({
    present: () => {
      insideRef.current?.present()
    },
    close: insideRef.current!.close,
  }))

  const handleCancel = () => {
    props.onCancel?.()
    insideRef.current?.close()
  }

  const handleAccept = async () => {
    return Promise.resolve(props.onAccept()).then(() => {
      insideRef.current?.close()
    })
  }

  return (
    <VoxSimpleModal ref={insideRef}>
      <VoxCard.Content justifyContent="space-between" gap="$large" maxWidth={media.sm ? 350 : 500}>
        <YStack gap="$medium">
          <Text.LG semibold>Créer l’action ?</Text.LG>
          <Text.MD color="$textPrimary">
            Une fois créé vous pourrez toujours le modifier mais la première communication sera partie.
          </Text.MD>
          <XStack gap="$small" alignItems="center">
            <Theme name="blue">
              <XStack flexGrow={1} paddingHorizontal="$medium">
                <Lock size={20} color="$color5" />
              </XStack>
              <YStack flexShrink={1}>
                <Text.MD color="$color5">
                  <Text.MD bold color="$color5">
                    Réservé aux membres.{' '}
                  </Text.MD>
                  Les externes ne pourront pas s’y inscrire sans créer un compte et renseigner leurs informations. Un aperçu sera visible
                  publiquement.
                </Text.MD>
              </YStack>
            </Theme>
          </XStack>
          <XStack gap="$small" alignItems="center">
            <XStack paddingHorizontal="$medium">
              <BellDot size={20} color="$textPrimary" />
            </XStack>
            <YStack flexShrink={1}>
              <Text.MD color="$textPrimary">Les contacts de la commune recevront une notification push automatiquement.</Text.MD>
            </YStack>
          </XStack>
          <Controller
            name="send_invitation_email"
            control={props.control}
            render={({ field }) => (
              <FormFrame paddingHorizontal={0}>
                <XStack gap="$small" alignItems="center" flex={1}>
                  <XStack paddingHorizontal="$medium">
                    <Mail size={20} color="$textPrimary" />
                  </XStack>
                  <YStack flex={1}>
                    <SwitchGroup
                      textProps={{
                        multiline: false,
                      }}
                      onChange={(x) => field.onChange(Boolean(x[0]))}
                      value={field.value ? ['notif'] : []}
                      options={[
                        {
                          value: 'notif',
                          label: 'Inviter par email tous les contacts de la commune',
                        },
                      ]}
                    />
                  </YStack>
                </XStack>
              </FormFrame>
            )}
          />
        </YStack>
        <XStack gap="$medium">
          <VoxButton variant="outlined" flex={3} children="Annuler" onPress={handleCancel} theme="gray" />
          <VoxButton children="Créer" loading={props.isPending} flex={1} onPress={handleAccept} theme="pink" />
        </XStack>
      </VoxCard.Content>
    </VoxSimpleModal>
  )
})

const ActionConfirmAlert = memo(_ActionConfirmAlert)

export const useActionConfirmAlert = (props: ActionConfirmAlertProps) => {
  const alertRef = useRef<ModalRef>(null)
  const Wrapper = <ActionConfirmAlert ref={alertRef} {...props} />
  const present = () => alertRef.current?.present()

  return { ConfirmAlert: Wrapper, present }
}
