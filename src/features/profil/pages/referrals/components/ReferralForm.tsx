import React, { useCallback, useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Checkbox from '@/components/base/Checkbox/Checkbox'
import Input from '@/components/base/Input/Input'
import SelectV3 from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import DatePickerField from '@/components/DatePicker'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import NationalitySelect from '@/components/NationalitySelect/NationalitySelect'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestViolation } from '@/data/restObjects/RestUpdateProfileRequest'
import { validateBirthdateFormSchema } from '@/features/profil/pages/account/form/schema'
import ReferralFormIncentive from '@/features/profil/pages/referrals/components/ReferralFormIncentive'
import ReferralSuccess from '@/features/profil/pages/referrals/components/ReferralSuccess'
import { postAddressSchema } from '@/services/events/schema'
import { ReferralFormError } from '@/services/referral/error'
import { useReferralsInvite, useReferralsPreRegister } from '@/services/referral/hook'
import { spacing } from '@/styles/spacing'
import { errorMessages } from '@/utils/errorMessages'
import { phoneCodes } from '@/utils/phoneCodes'
import { zodResolver } from '@hookform/resolvers/zod'
import { gray } from '@tamagui/colors'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { isWeb, useMedia, View, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import Button, { VoxButton } from '../../../../../components/Button'

interface Props {
  close: () => void
}

export default function ReferralForm({ close }: Props) {
  const { xs } = useMedia()
  const isMobileWebSpecific = isWeb && xs

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

  const { control, watch, handleSubmit, reset } = useForm<ReferralPreRegisterSchemaType | ReferralPreRegisterLightSchemaType>({
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
      consent: false,
    },
    resolver: zodResolver(isFullForm ? ReferralPreRegisterSchema : ReferralPreRegisterLightSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const firstName = watch('first_name')
  const email = watch('email_address')

  const onClose = useCallback(() => {
    resetPreRegisterState()
    resetInviteState()
    reset()
    close()
  }, [close])

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
          civility: fullData.civility === 'male' ? 'Monsieur' : 'Madame',
        })
      }
    },
    [isFullForm, onClose],
  )

  const toggleFullForm = useCallback(() => setIsFullForm((v) => !v), [])

  if (isSuccess) {
    return <ReferralSuccess onClose={onClose} name={firstName} />
  }

  return (
    <YStack padding={'$medium'} gap={'$medium'} $gtSm={{ width: 500 }} alignSelf={'center'}>
      <XStack alignItems={'center'} justifyContent={isMobileWebSpecific ? 'flex-end' : 'space-between'}>
        {!isMobileWebSpecific && <Text.LG bold>Invitation</Text.LG>}
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

      <XStack gap={'$medium'}>
        <View flex={1}>
          <Controller
            name="first_name"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input
                color="gray"
                autoFocus={Platform.OS === 'web'}
                placeholder="Prénom"
                value={value ?? undefined}
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
              />
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
            style={{ width: '100%', fontWeight: 500 }}
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

      <Controller
        name="consent"
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <YStack>
            <XStack alignItems={'center'} maxWidth={'100%'} gap={'$4'}>
              <Checkbox checked={value} onPress={() => onChange(!value)} onBlur={onBlur} />

              <Pressable onPress={() => onChange(!value)} style={{ maxWidth: '90%' }}>
                <Text.MD multiline fontWeight={400} lineHeight={20}>
                  Je certifie sur l’honneur avoir obtenu le consentement préalable de la personne que j’invite à adhérer.
                </Text.MD>
              </Pressable>
            </XStack>

            {error && (
              <XStack gap="$small" alignItems="center" pl="$medium">
                <Text.XSM color="$orange5">{error.message}</Text.XSM>
              </XStack>
            )}
          </YStack>
        )}
      />

      {firstName.length > 0 && email.includes('@') && !isFullForm && <ReferralFormIncentive name={firstName} onToggle={toggleFullForm} />}

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

      <View alignSelf={isMobileWebSpecific ? undefined : 'flex-end'} style={isMobileWebSpecific ? styles.mobileWebSpecificButton : null}>
        <VoxButton
          theme="orange"
          size="xl"
          onPress={handleSubmit(onSubmit)}
          loading={isRegistering || isInviting}
          alignSelf={isMobileWebSpecific ? 'center' : undefined}
        >
          {isFullForm ? 'Envoyer l’email de préinvitation' : 'Envoyer l’email d’invitation'}
        </VoxButton>
      </View>
    </YStack>
  )
}

const styles = StyleSheet.create({
  mobileWebSpecificButton: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.margin,
    borderTopWidth: 1,
    borderTopColor: gray.gray2,
  },
})

const ReferralPreRegisterLightSchema = z.object({
  email_address: z.string().email(errorMessages.email),
  first_name: z.string().min(1, errorMessages.emptyField),
  consent: z.boolean().refine(Boolean, { message: errorMessages.needChecked }),
})

const ReferralPreRegisterSchema = z.object({
  email_address: z.string().email(errorMessages.email),
  first_name: z.string().min(1, errorMessages.emptyField),
  last_name: z.string().min(1, errorMessages.emptyField),
  civility: z.string().min(1, errorMessages.emptyField),
  nationality: z.string().min(1, errorMessages.emptyField),
  birthdate: validateBirthdateFormSchema.optional().nullable(),
  phone: z
    .object({
      country: z.string(),
      number: z.string(),
    })
    .optional()
    .nullable(),
  post_address: postAddressSchema,
  consent: z.boolean().refine(Boolean, { message: errorMessages.needChecked }),
})

type ReferralPreRegisterSchemaType = z.infer<typeof ReferralPreRegisterSchema>
type ReferralPreRegisterLightSchemaType = z.infer<typeof ReferralPreRegisterLightSchema>
