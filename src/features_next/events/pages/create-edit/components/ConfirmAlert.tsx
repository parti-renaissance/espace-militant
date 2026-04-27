import React, { ComponentRef, forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import { Theme, useMedia, XStack, YStack } from 'tamagui'
import { BellDot, EyeOff, Mail } from '@tamagui/lucide-icons'
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form'

import { FormFrame } from '@/components/base/FormFrames'
import SwitchGroup from '@/components/base/SwitchGroup/SwitchGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import VoxSimpleModal from '@/components/VoxSimpleModal'

import LoaderView from '@/screens/shared/LoaderView'
import { useCountInvitationsEvent } from '@/services/events/hook'

import { EventFormData } from '../schema'
import getVisibilityOptions from '../visibility-options'

type ConfirmAlertProps = {
  onAccept: () => void | Promise<unknown>
  onCancel?: () => void
  isPending?: boolean
  title: string
  control: Control<EventFormData>
  setValue: UseFormSetValue<EventFormData>
  isAgoraLeader?: boolean
  agoraUuid?: string | null
  scope?: string | null
}

type ModalRef = ComponentRef<typeof VoxSimpleModal>

const VisibilityReview = (props: { visibility: string }) => {
  const visibilityOptions = getVisibilityOptions()
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
          <Text.MD color={visuOption.theme ? '$color5' : '$textPrimary'}>
            <Text.MD bold color={visuOption.theme ? '$color5' : '$textPrimary'}>
              {visuOption.label}.{' '}
            </Text.MD>
            {visuOption.subLabel}
          </Text.MD>
        </YStack>
      </Theme>
    </XStack>
  ) : null
}

const CountInvitation = (props: { visibility: string; agoraUuid?: string | null; scope?: string | null }) => {
  const shouldCount = props.visibility === 'invitation' && !!props.agoraUuid && !!props.scope

  const { data, isLoading } = useCountInvitationsEvent({
    roles: undefined,
    agora: shouldCount ? props.agoraUuid! : undefined,
    scope: shouldCount ? props.scope! : '',
  })

  const count = shouldCount && data?.count

  return (
    shouldCount && (
      <YStack gap="$medium" alignItems="center" p="$medium" backgroundColor="$textSurface" borderRadius="$5">
        {isLoading ? (
          <YStack height={47} justifyContent="center">
            <LoaderView />
          </YStack>
        ) : (
          <Text color="$blue9" fontSize={40} semibold>
            {count ?? 1}
          </Text>
        )}
        <Text.MD semibold>Invités</Text.MD>
      </YStack>
    )
  )
}

const isInvitationVisibility = (visibility?: string) => visibility === 'invitation'

const _ConfirmAlert = forwardRef<ModalRef, ConfirmAlertProps>((props, ref) => {
  const insideRef = useRef<ModalRef>(null)
  const media = useMedia()

  const visibility = useWatch({ control: props.control, name: 'visibility' })
  const hidden = useWatch({ control: props.control, name: 'hidden' })

  useEffect(() => {
    if (hidden) {
      props.setValue('send_invitation_email', false, { shouldDirty: true, shouldValidate: true })
    }
  }, [hidden, props.setValue])

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
          <Text.LG semibold>{props.title}</Text.LG>
          <VisibilityReview visibility={visibility} />
          {!hidden ? (
            <XStack gap="$small" alignItems="center">
              <XStack paddingHorizontal="$medium">
                <BellDot size={20} color="$textPrimary" />
              </XStack>
              <YStack flexShrink={1}>
                <Text.MD color="$textPrimary">Vos militants possédant l’app mobile recevront une notification automatique.</Text.MD>
              </YStack>
            </XStack>
          ) : null}
          {hidden ? (
            <XStack gap="$small" alignItems="center">
              <XStack paddingHorizontal="$medium">
                <EyeOff size={20} color="$textPrimary" />
              </XStack>
              <YStack flexShrink={1}>
                <Text.MD color="$textPrimary">
                  <Text.MD bold color="$textPrimary">
                    Non répertorié.{' '}
                  </Text.MD>
                  Cet événement n&apos;est accessible que par son lien direct et ne peut pas être retrouvé via la plateforme.
                </Text.MD>
              </YStack>
            </XStack>
          ) : null}
          {!hidden && isInvitationVisibility(visibility) ? (
            <XStack gap="$small" alignItems="center">
              <XStack paddingHorizontal="$medium">
                <Mail size={20} color="$textPrimary" />
              </XStack>
              <YStack flexShrink={1}>
                <Text.MD color="$textPrimary">Tous les invités recevront un email automatique.</Text.MD>
              </YStack>
            </XStack>
          ) : !hidden ? (
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
          ) : null}
          {!hidden && visibility === 'invitation' ? <CountInvitation visibility={visibility} agoraUuid={props.agoraUuid} scope={props.scope} /> : null}
        </YStack>
        <XStack gap="$medium">
          <VoxButton variant="outlined" flex={3} children="Annuler" onPress={handleCancel} theme="gray" />
          <VoxButton
            children={!hidden && isInvitationVisibility(visibility) ? 'Envoyer les invitations' : 'Créer'}
            loading={props.isPending}
            flex={1}
            onPress={handleAccept}
            theme="purple"
          />
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
