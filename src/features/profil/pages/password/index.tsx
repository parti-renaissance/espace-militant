import { KeyboardAvoidingView, Platform } from 'react-native'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { ProfilChangePasswordFormError } from '@/services/profile/error'
import { usetPostChangePassword } from '@/services/profile/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'
import * as z from 'zod'
import ScrollView from '../../components/ScrollView'

const ChangePasswordSchema = z
  .object({
    old_password: z.string().min(1, "L'ancien mot de passe est requis"),
    new_password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
      .regex(/[!@#$%^&*()\-=+{}\|:;\"'<>,.?[\]\/\\]/, 'Le mot de passe doit contenir au moins un charactère spécial'),
    new_password_confirmation: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.new_password_confirmation) {
      return ctx.addIssue({
        path: ['new_password_confirmation'],
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passe ne correspondent pas',
      })
    }
  })

export default function ChangePasswordScreen() {
  const { control, formState, handleSubmit, reset, setError } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'all',
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  })
  const { isDirty, isValid } = formState
  const { isPending, mutateAsync } = usetPostChangePassword()

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data)
      .then(() => {
        reset()
      })
      .catch((e) => {
        if (e instanceof ProfilChangePasswordFormError) {
          e.violations.forEach((violation) => {
            setError(violation.propertyPath, { message: violation.message })
          })
        }
      })
  })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <ScrollView>
        <VoxCard>
          <VoxCard.Content>
            <Text.LG>Modifier mon mot de passe</Text.LG>
            <Text.P> Vous devez renseigner votre mot de passe actuel pour changer de mot de passe.</Text.P>
            <Controller
              control={control}
              name="old_password"
              render={({ field, fieldState }) => (
                <Input
                  color="gray"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  secureTextEntry
                  placeholder="Mot de passe actuel"
                  autoComplete="current-password"
                  type="password"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="new_password"
              render={({ field, fieldState }) => (
                <Input
                  color="gray"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  type="password"
                  secureTextEntry
                  autoComplete="new-password"
                  placeholder="Nouveau mot de passe"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="new_password_confirmation"
              render={({ field, fieldState }) => (
                <Input
                  color="gray"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  placeholder="Confirmer le nouveau mot de passe"
                  autoComplete="new-password"
                  secureTextEntry
                  type="password"
                  error={fieldState.error?.message}
                />
              )}
            />
            <YStack>
              <Text.P>Afin de garantir un minimum de sécurité sur les accès votre mot de passe doit contenir au moins :</Text.P>
              <YStack pl={12}>
                <XStack gap={6}>
                  <Text.P>•</Text.P>
                  <Text.P>8 caractères minimum</Text.P>
                </XStack>
                <XStack gap={6}>
                  <Text.P>•</Text.P>
                  <Text.P>Une lettre majuscule</Text.P>
                </XStack>
                <XStack gap={6}>
                  <Text.P>•</Text.P>
                  <Text.P>Une lettre minuscule</Text.P>
                </XStack>
                <XStack gap={6}>
                  <Text.P>•</Text.P>
                  <Text.P>Un caractère spécial</Text.P>
                </XStack>
              </YStack>
            </YStack>

            <XStack justifyContent="flex-end" gap="$small">
              <VoxButton variant="outlined" display={isDirty ? 'flex' : 'none'} onPress={() => reset()}>
                Annuler
              </VoxButton>
              <VoxButton variant="outlined" theme="blue" onPress={onSubmit} loading={isPending} disabled={!isDirty || !isValid}>
                Enregistrer
              </VoxButton>
            </XStack>
          </VoxCard.Content>
        </VoxCard>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
