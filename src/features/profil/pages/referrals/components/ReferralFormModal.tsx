import React, { useCallback, useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Checkbox from '@/components/base/Checkbox/Checkbox'
import Input from '@/components/base/Input/Input'
import SelectV3 from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import Button from '@/components/Button'
import DatePickerField from '@/components/DatePicker'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import NationalitySelect from '@/components/NationalitySelect/NationalitySelect'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestViolation } from '@/data/restObjects/RestUpdateProfileRequest'
import ReferralSuccess from '@/features/profil/pages/referrals/components/ReferralSuccess'
import { postAddressSchema } from '@/services/events/schema'
import { ReferralFormError } from '@/services/referral/error'
import { useReferralsInvite, useReferralsPreRegister } from '@/services/referral/hook'
import { errorMessages } from '@/utils/errorMessages'
import { phoneCodes } from '@/utils/phoneCodes'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Info } from '@tamagui/lucide-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { View, XStack, YStack } from 'tamagui'
import { z } from 'zod'

interface Props {
  isOpen: boolean
  closeModal: () => void
}

export default function ReferralFormModal({ isOpen, closeModal }: Readonly<Props>) {
  const [isChecked, setIsChecked] = useState(false)
  const [isFullForm, setIsFullForm] = useState(false)

  const { mutate: invite, isPending: isInviting, isSuccess: isInviteSuccess, reset: resetInviteState, error: inviteError } = useReferralsInvite()
  const {
    mutate: preRegister,
    isPending: isRegistering,
    isSuccess: isPreRegisterSuccess,
    reset: resetPreRegisterState,
    error: preRegisterError,
  } = useReferralsPreRegister()
  const isSuccess = isInviteSuccess || isPreRegisterSuccess

  const apiErrors: RestViolation[] | undefined = useMemo(() => {
    if (!inviteError && !preRegisterError) return []

    if (!isFullForm && inviteError instanceof ReferralFormError) {
      return inviteError.violations
    }

    if (isFullForm && preRegisterError instanceof ReferralFormError) {
      return preRegisterError.violations
    }
  }, [inviteError, preRegisterError, isFullForm])

  const { control, watch, handleSubmit, formState, reset } = useForm<ReferralPreRegisterSchemaType | ReferralPreRegisterLightSchemaType>({
    defaultValues: {
      first_name: '',
      email_address: '',
      civility: '',
      last_name: '',
      phone: {
        country: 'FR',
        number: '',
      },
      nationality: 'FR',
      birthdate: undefined,
    },
    resolver: zodResolver(isFullForm ? ReferralPreRegisterSchema : ReferralPreRegisterLightSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const { isDirty, isValid } = formState
  const firstName = watch('first_name')

  const onClose = useCallback(() => {
    closeModal()
    reset()
    resetPreRegisterState()
    resetInviteState()
  }, [closeModal])

  const onSubmit: SubmitHandler<ReferralPreRegisterSchemaType | ReferralPreRegisterLightSchemaType> = useCallback(
    (data) => {
      if (!isFullForm) {
        invite({
          first_name: data.first_name,
          email_address: data.email_address,
        })
      } else {
        // We cast for simplicity as it is checked before by form validator
        const fullData = data as ReferralPreRegisterSchemaType
        preRegister({
          ...fullData,
          phone: fullData.phone?.number && fullData.phone.number.length > 1 ? fullData.phone?.number : undefined,
          civility: fullData.civility === 'male' ? 'Madame' : 'Monsieur',
        })
      }
    },
    [isFullForm, onClose],
  )

  const toggleCheck = useCallback(() => setIsChecked((v) => !v), [])
  const toggleFullForm = useCallback(() => setIsFullForm((v) => !v), [])

  return (
    <ModalOrBottomSheet allowDrag open={isOpen} onClose={closeModal}>
      {isSuccess ? (
        <ReferralSuccess onClose={onClose} name={firstName} />
      ) : (
        <YStack padding={'$8'} gap={'$8'}>
          <XStack alignItems={'center'} justifyContent={'space-between'}>
            <Text bold>Invitation</Text>
            {isFullForm && (
              <Button variant={'text'} onPress={toggleFullForm}>
                <Text color="$orange6">Revenir à l'invitation simple</Text>
              </Button>
            )}
          </XStack>

          {apiErrors?.map((error) => (
            <MessageCard iconLeft={AlertTriangle} theme="orange" key={error.propertyPath}>
              {error.message}
            </MessageCard>
          ))}

          {isFullForm && (
            <Controller
              name="civility"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <SelectV3
                  placeholder="Civilité"
                  onBlur={onBlur}
                  color="gray"
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  options={[
                    { value: 'male', label: 'Monsieur' },
                    { value: 'female', label: 'Madame' },
                  ]}
                />
              )}
            />
          )}

          <XStack gap={'$8'}>
            <View flex={1}>
              <Controller
                name="first_name"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input color="gray" placeholder="Prénom" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
                )}
              />
            </View>
            {isFullForm && (
              <View flex={1}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <Input color="gray" placeholder="Nom" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
                  )}
                />
              </View>
            )}
          </XStack>

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

          {isFullForm && (
            <>
              <Controller
                render={({ field, fieldState }) => {
                  return (
                    <AddressAutocomplete
                      size="sm"
                      color="gray"
                      label="Localisation"
                      error={fieldState.error?.message}
                      onBlur={field.onBlur}
                      setAddressComponents={(x) => {
                        field.onChange({
                          address: x.address,
                          city_name: x.city,
                          postal_code: x.postalCode,
                          country: x.country,
                        })
                      }}
                    />
                  )
                }}
                control={control}
                name="post_address"
              />

              <Controller
                name="nationality"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <NationalitySelect
                    id="nationality"
                    color="gray"
                    value={value ?? 'FR'}
                    placeholder="Nationalité"
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </>
          )}

          <XStack alignItems={'center'}>
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
          </XStack>

          {firstName.length > 0 && !isFullForm && (
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

          {isFullForm && (
            <>
              <XStack gap="$medium" alignContent="center" alignItems="center">
                <Text.MD secondary>Optionnel</Text.MD>
                <VoxCard.Separator />
              </XStack>

              <Controller
                name="birthdate"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <DatePickerField
                    color="gray"
                    label="Date de naissance"
                    type="date"
                    value={value ?? undefined}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <XStack gap="$medium">
                    <View width={130}>
                      <SelectV3
                        searchable={true}
                        color="gray"
                        value={value?.country ?? 'FR'}
                        size="lg"
                        options={phoneCodes}
                        onChange={(x) => onChange({ number: value?.number, country: x })}
                      />
                    </View>
                    <View flexGrow={1}>
                      <Input
                        value={value?.number}
                        color="gray"
                        placeholder="Téléphone"
                        onBlur={onBlur}
                        onChange={(x) => {
                          if (!x) {
                            onChange(null)
                          } else {
                            onChange({ number: x, country: value?.country })
                          }
                        }}
                        error={error?.message}
                      />
                    </View>
                  </XStack>
                )}
              />
            </>
          )}

          <View alignSelf={'flex-end'}>
            <Button
              theme="orange"
              size="xl"
              disabled={!isChecked || !isValid || !isDirty}
              onPress={handleSubmit(onSubmit)}
              loading={isRegistering || isInviting}
            >
              <Button.Text color="$white1" bold>
                {isFullForm ? 'Envoyer l’email de préinvitation' : 'Envoyer l’email d’invitation'}
              </Button.Text>
            </Button>
          </View>
        </YStack>
      )}
    </ModalOrBottomSheet>
  )
}

const ReferralPreRegisterLightSchema = z.object({
  email_address: z.string().email(errorMessages.email),
  first_name: z.string().min(1, errorMessages.emptyField),
})

const ReferralPreRegisterSchema = z.object({
  email_address: z.string().email(errorMessages.email),
  first_name: z.string().min(1, errorMessages.emptyField),
  last_name: z.string().min(1, errorMessages.emptyField),
  civility: z.string().min(1, errorMessages.emptyField),
  nationality: z.string().min(1, errorMessages.emptyField),
  birthdate: z.date().optional().nullable(),
  phone: z
    .object({
      country: z.string(),
      number: z.string(),
    })
    .optional()
    .nullable(),
  post_address: postAddressSchema,
})

type ReferralPreRegisterSchemaType = z.infer<typeof ReferralPreRegisterSchema>
type ReferralPreRegisterLightSchemaType = z.infer<typeof ReferralPreRegisterLightSchema>
