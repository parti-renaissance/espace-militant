import React, { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import Checkbox from '@/components/base/Checkbox/Checkbox'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import Button from '@/components/Button'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import { useReferralsInvite } from '@/services/referral/hook'
import {
  ReferralInviteRequestSchema,
  ReferralInviteRequestType,
  ReferralPreRegisterRequestSchema,
  ReferralPreRegisterRequestType,
} from '@/services/referral/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from '@tamagui/lucide-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { View, XStack, YStack } from 'tamagui'

interface Props {
  isOpen: boolean
  closeModal: () => void
}

export default function ReferralFormModal({ isOpen, closeModal }: Props) {
  const [isChecked, setIsChecked] = useState(false)
  const [isFullForm, setIsFullForm] = useState(false)

  const { mutateAsync: invite, isPending: isInviting } = useReferralsInvite()

  const { control, watch, handleSubmit, formState } = useForm<ReferralPreRegisterRequestType>({
    defaultValues: {
      first_name: '',
      email_address: '',
    },
    resolver: zodResolver(isFullForm ? ReferralInviteRequestSchema : ReferralPreRegisterRequestSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const { isDirty, isValid } = formState
  const firstName = watch('first_name')

  const onSubmit: SubmitHandler<ReferralPreRegisterRequestType | ReferralInviteRequestType> = useCallback((data) => {
    if (!isFullForm) {
      invite({
        first_name: data.first_name,
        email_address: data.email_address,
      }).then(closeModal)
    }
  }, [])

  const toggleCheck = useCallback(() => setIsChecked((v) => !v), [])
  const toggleFullForm = useCallback(() => setIsFullForm((v) => !v), [])

  return (
    <ModalOrPageBase mobileBackdrop allowDrag open={isOpen} onClose={closeModal} snapPoints={[isFullForm ? 90 : 65]}>
      <YStack padding={'$8'} gap={'$8'}>
        <XStack>
          <Text bold>Invitation</Text>
        </XStack>

        <View>
          <Controller
            name="first_name"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input color="gray" placeholder="Prénom" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
            )}
          />
        </View>

        <View>
          <Controller
            name="email_address"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input
                color="gray"
                value={value}
                placeholder="Email"
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
                style={{ width: '100%' }}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoCorrect={false}
              />
            )}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <YStack>
            <Checkbox checked={isChecked} onPress={toggleCheck} />
          </YStack>

          <YStack>
            <Pressable onPress={toggleCheck}>
              <Text.MD multiline fontWeight={400} lineHeight={20}>
                Je certifie sur l’honneur avoir obtenu le consentement préalable de la personne que j’invite à adhérer.
              </Text.MD>
            </Pressable>
          </YStack>
        </View>

        {firstName.length > 0 && (
          <XStack padding={'$6'} borderRadius={'$8'} backgroundColor={'$gray1'} alignItems={'center'} gap={'$4'}>
            <XStack flex={1} $gtSm={{ flex: 1 }}>
              <Info />
            </XStack>
            <YStack flex={7} $gtSm={{ flex: 3 }}>
              <Text bold>Connaissez-vous son adresse postale ?</Text>
              <Text>En préinscrivant entièrement {firstName}, vous multipliez par 10 ses chances d’adhérer.</Text>
            </YStack>
            <YStack flex={5} $gtSm={{ flex: 3 }} justifyContent={'center'}>
              <Button variant={'text'} onPress={toggleFullForm}>
                <Text color="$orange6">Préinscrire</Text>
              </Button>
            </YStack>
          </XStack>
        )}
        <View alignSelf={'flex-end'}>
          <Button theme="orange" size="xl" disabled={!isChecked || !isValid || !isDirty} onPress={handleSubmit(onSubmit)} loading={isInviting}>
            <Button.Text color="$white1" bold>
              Envoyer l’email d’invitation
            </Button.Text>
          </Button>
        </View>
      </YStack>
    </ModalOrPageBase>
  )
}
