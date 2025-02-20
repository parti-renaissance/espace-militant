import { ComponentRef, forwardRef, memo, useImperativeHandle, useRef } from 'react'
import { FormFrame } from '@/components/base/FormFrames'
import SwitchGroup from '@/components/base/SwitchGroup/SwitchGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import VoxSimpleModal from '@/components/VoxSimpleModal'
import { EventFormData } from '@/features/events/pages/create-edit/schema'
import { BellDot, Mail } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { Theme, XStack, YStack } from 'tamagui'
import visibilityOptions from './visibility-options'

type ConfirmAlertProps = {
  onAccept: () => void | Promise<unknown>
  onCancel?: () => void
  isPending?: boolean
  title: string
  control: Control<EventFormData>
}

type ModalRef = ComponentRef<typeof VoxSimpleModal>

const VisibilityReview = (props: { visibility: string }) => {
  const visuOption = visibilityOptions.find((x) => x.value === props.visibility)
  return visuOption ? (
    <XStack gap="$small" alignItems="center">
      <Theme name={visuOption.theme}>
        {visuOption.icon ? (
          <XStack flexGrow={1} paddingHorizontal="$medium">
            <visuOption.icon size={20} color={visuOption.theme ? '$color5' : '$textPrimary'} />
          </XStack>
        ) : null}
        <YStack flexShrink={1}>
          <Text.MD color={visuOption.theme ? '$color5' : '$textPrimary'}>{visuOption.subLabel}</Text.MD>
        </YStack>
      </Theme>
    </XStack>
  ) : null
}

const _ConfirmAlert = forwardRef<ModalRef, ConfirmAlertProps>((props, ref) => {
  const insideRef = useRef<ModalRef>(null)

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
      <VoxCard.Content justifyContent="space-between" gap="$large" $sm={{ maxWidth: 350 }} maxWidth={500}>
        <YStack gap="$medium">
          <Text.LG semibold>{props.title}</Text.LG>
          <Controller name="visibility" render={({ field }) => <VisibilityReview visibility={field.value} />} control={props.control} />
          <XStack gap="$small" alignItems="center">
            <XStack flexGrow={1} paddingHorizontal="$medium">
              <BellDot size={20} color="$textPrimary" />
            </XStack>
            <YStack flexShrink={1}>
              <Text.MD color="$textPrimary">Vos militants possédant l’app mobile recevront une notification automatique.</Text.MD>
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
                          label: 'Inviter également mes adhérents par email.',
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
          <VoxButton children="Créer" loading={props.isPending} flex={1} onPress={handleAccept} theme="blue" />
        </XStack>
      </VoxCard.Content>
    </VoxSimpleModal>
  )
})

const ConfirmAlert = memo(_ConfirmAlert)

export const useConfirmAlert = (props: ConfirmAlertProps) => {
  const alertRef = useRef<ModalRef>(null)
  const Wrapper = <ConfirmAlert ref={alertRef} {...props} />
  const present = () => alertRef.current?.present()

  return { ConfirmAlert: Wrapper, present }
}
