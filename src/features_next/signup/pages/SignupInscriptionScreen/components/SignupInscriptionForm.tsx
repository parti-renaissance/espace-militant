import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Linking, Pressable } from 'react-native'
import { XStack, YStack } from 'tamagui'
import { AlertTriangle, MapPin } from '@tamagui/lucide-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import Checkbox from '@/components/base/Checkbox/Checkbox'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import FriendlyCaptchaWidget from '@/features_next/signup/pages/SignupInscriptionScreen/components/FriendlyCaptchaWidget'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'
import { applySignupFormError } from '@/features_next/signup/utils/errors'

import { DEFAULT_SIGNUP_SOURCE } from '@/services/signup/constants'
import { useSignup } from '@/services/signup/hook'
import { SignupInscriptionFormSchema, type RestPostSignupRequest, type SignupInscriptionFormValues } from '@/services/signup/schema'

export type SignupInscriptionFormHandle = {
  submit: () => void
}

type SignupInscriptionFormProps = {
  onSuccess: () => void
}

function SignupInscriptionForm({ onSuccess }: SignupInscriptionFormProps, ref: React.Ref<SignupInscriptionFormHandle>) {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const { mutateAsync: signup } = useSignup()
  const setEmail = useSignupSessionStore((s) => s.setEmail)
  const setFirstName = useSignupSessionStore((s) => s.setFirstName)
  const startResendCooldown = useSignupSessionStore((s) => s.startResendCooldown)

  const { control, handleSubmit, setError } = useForm<SignupInscriptionFormValues>({
    defaultValues: {
      first_name: '',
      email: '',
      postal_code: '',
      email_opt_in: false,
    },
    resolver: zodResolver(SignupInscriptionFormSchema),
    mode: 'onSubmit',
  })

  const handleCaptchaToken = useCallback((token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError(null)
  }, [])

  const mapToApiPayload = useCallback(
    (data: SignupInscriptionFormValues, token: string): RestPostSignupRequest => ({
      email: data.email.trim(),
      source: DEFAULT_SIGNUP_SOURCE,
      recaptcha: token,
      cgu_accepted: true,
      first_name: data.first_name.trim(),
      postal_code: data.postal_code.trim(),
      country: 'FR',
      email_opt_in: data.email_opt_in,
    }),
    [],
  )

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null)
    setRecaptchaError(null)
    if (!recaptchaToken) {
      setRecaptchaError('Veuillez compléter la vérification anti-robot.')
      return
    }
    try {
      await signup(mapToApiPayload(data, recaptchaToken))
      setEmail(data.email.trim())
      setFirstName(data.first_name.trim())
      startResendCooldown()
      onSuccess()
    } catch (error) {
      applySignupFormError({
        error,
        setError,
        setRecaptchaError: (message) => {
          if (message) {
            setRecaptchaToken(null)
            setCaptchaResetKey((k) => k + 1)
          }
          setRecaptchaError(message)
        },
        setFormError,
      })
    }
  })

  useImperativeHandle(ref, () => ({ submit: onSubmit }), [onSubmit])

  return (
    <YStack gap="$medium">
      {formError ? (
        <MessageCard iconLeft={AlertTriangle} theme="orange">
          {formError}
        </MessageCard>
      ) : null}

      <Controller
        name="first_name"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input placeholder="Prénom" onBlur={onBlur} onChangeText={onChange} value={value} error={error?.message} autoComplete="given-name" size="sm" />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={error?.message}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            size="sm"
          />
        )}
      />

      <Controller
        name="postal_code"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <YStack gap="$small">
            <Input
              placeholder="Code postal"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={error?.message}
              keyboardType="number-pad"
              maxLength={5}
              autoComplete="postal-code"
              size="sm"
            />
            <XStack alignItems="center" gap="$small" flexShrink={1}>
              <MapPin size={16} color="$gray400" />
              <Text.SM secondary>Pour voir les événements et actions près de chez vous.</Text.SM>
            </XStack>
          </YStack>
        )}
      />

      <Controller
        name="email_opt_in"
        control={control}
        render={({ field: { onBlur, onChange, value } }) => (
          <XStack alignItems="center" gap="$small" mt="$small">
            <Checkbox checked={value} onPress={() => onChange(!value)} onBlur={onBlur} />
            <Pressable onPress={() => onChange(!value)} style={{ flex: 1 }}>
              <Text.MD multiline>
                <Text.MD semibold multiline>
                  Tenez moi informé par email
                </Text.MD>{' '}
                de l&apos;actualité de politique de Renaissance{' '}
                <Text.MD secondary multiline>
                  (optionnel).
                </Text.MD>
              </Text.MD>
            </Pressable>
          </XStack>
        )}
      />
      <YStack gap="$small">
        <Text.MD semibold textAlign="center">
          Avez-vous un compte Renaissance ?
        </Text.MD>
        <VoxButton
          theme="blue"
          full
          variant="text"
          onPress={() => {
            /** TODO: Add signin logic */
          }}
        >
          J’ai déja un compte, je me connecte
        </VoxButton>
      </YStack>

      <YStack alignItems="center" height={75}>
        <FriendlyCaptchaWidget key={captchaResetKey} onToken={handleCaptchaToken} error={recaptchaError} />
      </YStack>

      <Text.SM secondary>
        En continuant, vous acceptez nos{' '}
        <Text.SM secondary color="$blue9" onPress={() => Linking.openURL('https://parti-renaissance.fr/politique-de-protection-des-donnees/')}>
          CGU
        </Text.SM>{' '}
        et notre{' '}
        <Text.SM secondary color="$blue9" onPress={() => Linking.openURL('https://parti-renaissance.fr/politique-de-protection-des-donnees/')}>
          Politique de confidentialité
        </Text.SM>
        , et vous autorisez Renaissance à vous envoyer des emails relatifs à votre inscription.
      </Text.SM>
    </YStack>
  )
}

export default forwardRef(SignupInscriptionForm)
