import { useCallback, useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { ScrollView, useMedia, useTheme, View, XStack, YStack } from 'tamagui'
import { ArrowLeft, ArrowRight, X } from '@tamagui/lucide-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import DateInput from '@/components/base/DateInput'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import Title from '@/components/Title/Title'

import { isPathExist } from '@/services/common/errors/utils'
import { ProfileFormError } from '@/services/profile/error'
import { useGetDetailProfil, useMutationUpdateProfil } from '@/services/profile/hook'
import { RestDetailedProfileResponse, RestUpdateProfileRequest } from '@/services/profile/schema'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { phoneCodes } from '@/utils/phoneCodes'

import { isValid } from 'date-fns'

import { validateBirthdateFormSchema, validateCoordFormSchema, validateInformationsFormSchema, validateLocationFormSchema } from '../pages/account/form/schema'

type PostAddressFormValue = {
  address?: string | null
  postal_code?: string | null
  city_name?: string | null
  country?: string | null
}

const isPostAddressFilled = (postAddress?: PostAddressFormValue | null) => {
  if (!postAddress) return false

  return Boolean(postAddress.address?.trim() || postAddress.city_name?.trim() || postAddress.postal_code?.trim() || postAddress.country?.trim())
}

const validateCompleteProfilStep1Schema = z.object({
  post_address: validateLocationFormSchema.shape.post_address,
  phone: validateCoordFormSchema.shape.phone,
})

const validateCompleteProfilStep2Schema = z.object({
  gender: validateInformationsFormSchema.shape.gender,
  first_name: validateInformationsFormSchema.shape.first_name,
  last_name: validateInformationsFormSchema.shape.last_name,
  birthdate: validateBirthdateFormSchema,
})

const validateCompleteProfilFormSchema = validateCompleteProfilStep1Schema.merge(
  z.object({
    gender: validateInformationsFormSchema.shape.gender.optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    birthdate: validateBirthdateFormSchema.optional(),
  }),
)

const validateCompleteProfilSchema = validateCompleteProfilStep1Schema.merge(validateCompleteProfilStep2Schema)

type CompleteProfilFormValues = z.infer<typeof validateCompleteProfilFormSchema>
type CompleteProfilSubmitValues = z.infer<typeof validateCompleteProfilSchema>

const STEP_1_FIELDS = ['post_address', 'phone'] as const satisfies ReadonlyArray<keyof CompleteProfilFormValues>
const MODAL_MAX_WIDTH = 440

const buildDefaultValues = (profile: RestDetailedProfileResponse): CompleteProfilFormValues => {
  const gender = profile.gender === 'male' || profile.gender === 'female' || profile.gender === 'other' ? profile.gender : undefined

  return {
    post_address: {
      address: profile.post_address?.address ?? '',
      city_name: profile.post_address?.city_name ?? '',
      postal_code: profile.post_address?.postal_code ?? '',
      country: profile.post_address?.country ?? '',
    },
    phone: {
      country: profile.phone?.country ?? 'FR',
      number: profile.phone?.number,
    },
    gender,
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    birthdate: profile.birthdate && isValid(profile.birthdate) ? profile.birthdate : undefined,
  }
}

const buildUpdatePayload = (data: CompleteProfilSubmitValues): RestUpdateProfileRequest => {
  const payload: RestUpdateProfileRequest = {
    gender: data.gender,
    first_name: data.first_name,
    last_name: data.last_name,
    birthdate: data.birthdate,
  }

  if (isPostAddressFilled(data.post_address)) {
    payload.post_address = {
      address: data.post_address?.address ?? null,
      postal_code: data.post_address?.postal_code ?? null,
      city_name: data.post_address?.city_name ?? null,
      country: data.post_address?.country ?? null,
    }
  }

  if (!data.phone?.number?.trim()) {
    return payload
  }

  return {
    ...payload,
    phone: {
      country: data.phone.country ?? 'FR',
      number: data.phone.number,
    },
  } as RestUpdateProfileRequest
}

type CompleteProfilProps = {
  open: boolean
  onClose: () => void
  redirectTo?: Href
  onSuccess?: () => void
}

export default function CompleteProfil({ open, onClose, redirectTo, onSuccess }: CompleteProfilProps) {
  const theme = useTheme()
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const isMobileSheet = !media.gtSm

  if (!open) {
    return null
  }

  return (
    <ModalOrPageBase
      open={open}
      onClose={onClose}
      closeOnBackdropPress={false}
      contentBackgroundColor={theme.gray50.val}
      contentMaxWidth={isMobileSheet ? undefined : MODAL_MAX_WIDTH}
      modalBreakpoint="gtSm"
      scrollable={isMobileSheet ? false : undefined}
    >
      <BoundarySuspenseWrapper fallback={<></>}>
        <CompleteProfilContent isMobileSheet={isMobileSheet} insets={insets} media={media} onClose={onClose} redirectTo={redirectTo} onSuccess={onSuccess} />
      </BoundarySuspenseWrapper>
    </ModalOrPageBase>
  )
}

type CompleteProfilContentProps = {
  isMobileSheet: boolean
  insets: ReturnType<typeof useSafeAreaInsets>
  media: ReturnType<typeof useMedia>
  onClose: () => void
  redirectTo?: Href
  onSuccess?: () => void
}

function CompleteProfilContent({ isMobileSheet, insets, media, onClose, redirectTo, onSuccess }: CompleteProfilContentProps) {
  const { data: profile } = useGetDetailProfil()
  const [step, setStep] = useState<1 | 2>(1)

  const defaultValues = useMemo(() => buildDefaultValues(profile), [profile])

  const { control, handleSubmit, reset, trigger, setError } = useForm<CompleteProfilFormValues>({
    resolver: zodResolver(validateCompleteProfilFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { mutateAsync, isPending } = useMutationUpdateProfil({ userUuid: profile.uuid })

  const handleClose = useCallback(() => {
    setStep(1)
    reset(defaultValues)
    onClose()
  }, [defaultValues, onClose, reset])

  const onNextStep = async () => {
    const isValid = await trigger([...STEP_1_FIELDS])
    if (!isValid) {
      return
    }

    setStep(2)
  }

  const onPreviousStep = () => {
    if (step === 2) {
      setStep(1)
    } else {
      handleClose()
    }
  }

  const onSubmit = handleSubmit((data) => {
    const parsed = validateCompleteProfilSchema.safeParse(data)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.map(String).join('.')
        if (path && isPathExist(path, defaultValues)) {
          setError(path, { message: issue.message })
        }
      })
      return
    }

    mutateAsync(buildUpdatePayload(parsed.data))
      .then(() => {
        handleClose()
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          onSuccess?.()
        }
      })
      .catch((error) => {
        if (error instanceof ProfileFormError) {
          error.violations.forEach((violation) => {
            if (isPathExist(violation.propertyPath, defaultValues)) {
              setError(violation.propertyPath, { message: violation.message })
            } else {
              ErrorMonitor.log('Unknown property path / complete profil form', violation)
            }
          })
        }
      })
  })

  const footer =
    step === 1 ? (
      <VoxButton theme="blue" size="xl" width="100%" iconRight={ArrowRight} onPress={onNextStep}>
        Suivant
      </VoxButton>
    ) : (
      <VoxButton theme="blue" size="xl" width="100%" iconRight={ArrowRight} onPress={onSubmit} loading={isPending} disabled={isPending}>
        Je valide mes infos
      </VoxButton>
    )

  const formContent =
    step === 1 ? (
      <>
        <YStack gap="$medium">
          <Title size="h1">
            <Title.Text>Je Débloque tout </Title.Text>
            <Title.Break />
            <Title.Highlight>le potentiel</Title.Highlight>
            <Title.Text>de l’app</Title.Text>
            <Title.Break />
            <Title.Text>de campagne</Title.Text>
          </Title>
          <Text.LG regular>Ces informations permettent d’adapter votre expérience à votre localisation.</Text.LG>
        </YStack>
        <YStack gap="$medium">
          <YStack gap="$small">
            <Text.MD semibold>Adresse postale</Text.MD>
            <Controller
              name="post_address"
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
                formState: {
                  errors: { post_address: postAddressErrors },
                },
              }) => (
                <AddressAutocomplete
                  addressOnly
                  color="white"
                  size="sm"
                  placeholder="Adresse"
                  defaultValue={`${value?.address ?? ''} ${value?.city_name ?? ''}`.trim()}
                  onBlur={onBlur}
                  setAddressComponents={(address) =>
                    onChange({
                      address: address.address,
                      city_name: address.city,
                      postal_code: address.postalCode,
                      country: address.country,
                    })
                  }
                  error={
                    postAddressErrors?.address?.message ||
                    postAddressErrors?.city_name?.message ||
                    postAddressErrors?.postal_code?.message ||
                    postAddressErrors?.country?.message ||
                    error?.message
                  }
                />
              )}
            />
          </YStack>

          <YStack gap="$small">
            <Text.MD>
              <Text.MD semibold>Téléphone </Text.MD>
              <Text.MD secondary>(Optionnel - aucun spam)</Text.MD>
            </Text.MD>

            <Controller
              name="phone"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <XStack gap="$medium">
                  <View width={130}>
                    <Select
                      searchable
                      color="white"
                      value={value?.country ?? 'FR'}
                      size="sm"
                      options={phoneCodes}
                      onChange={(country) => onChange({ number: value?.number, country })}
                    />
                  </View>
                  <View flexGrow={1}>
                    <Input
                      value={value?.number}
                      color="white"
                      size="sm"
                      placeholder="Téléphone (optionnel)"
                      onBlur={onBlur}
                      onChange={(number) => {
                        if (!number) {
                          onChange(null)
                        } else {
                          onChange({ number, country: value?.country ?? 'FR' })
                        }
                      }}
                      error={error?.message}
                    />
                  </View>
                </XStack>
              )}
            />
          </YStack>
        </YStack>
      </>
    ) : (
      <>
        <YStack gap="$medium">
          <Title size="h1">
            <Title.Text>ON Y EST </Title.Text>
            <Title.Highlight>PRESQUE</Title.Highlight>
          </Title>
          <Text.LG regular>Quelques précisions pour savoir comment nous adresser à vous et adapter nos futurs échanges.</Text.LG>
        </YStack>
        <YStack gap="$medium">
          <Controller
            name="gender"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Select
                placeholder="Civilité"
                onBlur={onBlur}
                color="white"
                size="sm"
                disabled={!!profile.certified}
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

          <Controller
            name="first_name"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input
                color="white"
                size="sm"
                disabled={!!profile.certified}
                placeholder="Prénom"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input
                color="white"
                size="sm"
                disabled={!!profile.certified}
                placeholder="Nom"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="birthdate"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DateInput
                label="Date de naissance"
                value={value && isValid(value) ? value : null}
                onChange={(iso) => onChange(iso ? new Date(iso) : undefined)}
                placeholder="Sélectionner date de naissance"
                size="sm"
                color="white"
                disabled={!!profile.certified}
                error={error?.message}
              />
            )}
          />
        </YStack>
      </>
    )

  return (
    <YStack
      width="100%"
      maxWidth={isMobileSheet ? undefined : MODAL_MAX_WIDTH}
      flex={isMobileSheet ? 1 : undefined}
      backgroundColor="$gray50"
      alignSelf={isMobileSheet ? undefined : 'center'}
    >
      <XStack width="100%" px="$medium" pt="$medium" justifyContent="space-between" alignItems="center">
        <YStack>
          <VoxButton variant="text" iconLeft={ArrowLeft} onPress={onPreviousStep}>
            Retour
          </VoxButton>
        </YStack>
        {media.gtSm ? (
          <YStack>
            <VoxButton theme="gray" variant="text" shrink iconLeft={X} onPress={handleClose}></VoxButton>
          </YStack>
        ) : null}
      </XStack>
      {isMobileSheet ? (
        <YStack flex={1} width="100%" backgroundColor="$gray50">
          <ScrollView flexGrow={1} flexShrink={1} minHeight={0} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <YStack gap="$large" padding="$large">
              {formContent}
            </YStack>
          </ScrollView>
          <YStack flexShrink={0} width="100%" paddingHorizontal="$large" paddingTop="$medium" paddingBottom={insets.bottom + 16} backgroundColor="$gray50">
            {footer}
          </YStack>
        </YStack>
      ) : (
        <YStack gap="$large" padding="$large" width="100%">
          {formContent}
          {footer}
        </YStack>
      )}
    </YStack>
  )
}
