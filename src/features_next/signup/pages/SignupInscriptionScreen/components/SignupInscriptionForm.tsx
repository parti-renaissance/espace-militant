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

import { useSession } from '@/ctx/SessionProvider'
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
  const { signIn } = useSession()
  const setEmail = useSignupSessionStore((s) => s.setEmail)
  const setFirstName = useSignupSessionStore((s) => s.setFirstName)
  const startResendCooldown = useSignupSessionStore((s) => s.startResendCooldown)
  const redirectUri = useSignupSessionStore((s) => s.redirectUri)
  const referrerCode = useSignupSessionStore((s) => s.ref)

  const { control, handleSubmit, setError } = useForm<SignupInscriptionFormValues>({
    defaultValues: {
      first_name: '',
      email: '',
      postal_code: '',
      email_opt_in: false,
      cgu_accepted: false,
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
      ...(referrerCode ? { referrer_code: referrerCode } : {}),
    }),
    [referrerCode],
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
              maxLength={10}
              autoCapitalize="characters"
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
                  Tenez-moi informé par email
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
      <Controller
        name="cgu_accepted"
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <YStack gap="$xsmall">
            <XStack alignItems="flex-start" gap="$small">
              <Checkbox checked={value} onPress={() => onChange(!value)} onBlur={onBlur} />
              <Pressable onPress={() => onChange(!value)} style={{ flex: 1 }}>
                <Text.SM multiline color={error ? '$red600' : '$textPrimary'}>
                  En continuant, vous acceptez nos{' '}
                  <Text.SM color="$blue9" cursor="pointer" onPress={() => Linking.openURL('https://attalpresident.fr/cgu')}>
                    CGU
                  </Text.SM>{' '}
                  et notre{' '}
                  <Text.SM color="$blue9" cursor="pointer" onPress={() => Linking.openURL('https://attalpresident.fr/confidentialite')}>
                    Politique de confidentialité
                  </Text.SM>
                  , et vous autorisez Renaissance à vous envoyer des emails relatifs à votre inscription.
                </Text.SM>
              </Pressable>
            </XStack>
            {error ? (
              <Text.XSM color="$red500" pl={42}>
                {error.message}
              </Text.XSM>
            ) : null}
          </YStack>
        )}
      />

      <YStack gap="$small" py="$medium">
        <Text.MD semibold>
          Un compte Renaissance ?{' '}
          <Text.MD semibold color="$blue600" cursor="pointer" onPress={() => signIn({ state: redirectUri || '/' })}>
            Je me connecte
          </Text.MD>
        </Text.MD>
      </YStack>

      <YStack alignItems="center" height={100}>
        <FriendlyCaptchaWidget key={captchaResetKey} onToken={handleCaptchaToken} error={recaptchaError} />
      </YStack>

      <Text.SM secondary multiline>
        Les informations recueillies dans ce formulaire sont traitées par Renaissance afin de créer et gérer votre compte, personnaliser votre application et
        vous proposer des événements et actions près de chez vous. Avec votre accord, elles servent également à vous tenir informé(e) de nos activités.
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition sur vos données, que vous pouvez
        exercer en écrivant à{' '}
        <Text.SM secondary color="$blue9" cursor="pointer" onPress={() => Linking.openURL('mailto:dpo@parti-renaissance.fr')}>
          dpo@parti-renaissance.fr
        </Text.SM>
        . Vous pouvez également introduire une réclamation auprès de la CNIL. Pour en savoir plus, consultez notre{' '}
        <Text.SM secondary color="$blue9" cursor="pointer" onPress={() => Linking.openURL('https://attalpresident.fr/confidentialite')}>
          politique de confidentialité
        </Text.SM>
        .
      </Text.SM>
    </YStack>
  )
}

export default forwardRef(SignupInscriptionForm)
