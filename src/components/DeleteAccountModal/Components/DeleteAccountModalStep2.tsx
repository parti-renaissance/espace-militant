import Input from '@/components/base/Input/Input'
import RadioGroup from '@/components/base/RadioGroup/RadioGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { useDeleteProfil } from '@/services/profile/hook'
import { UnregistrationReason } from '@/services/profile/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { styled, View, XStack, YStack } from 'tamagui'
import { z } from 'zod'
interface Props {
  onClose: () => void
  onConfirm: () => void
  isAdherent: boolean
}

const schema = z.object({
  reason: z.nativeEnum(UnregistrationReason, {
    errorMap: () => ({ message: 'Veuillez sélectionner une raison' }),
  }),
  comment: z.string().max(1000, '1000 caractères maximum').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function DeleteAccountModalStep2({ onClose, onConfirm, isAdherent }: Readonly<Props>) {
  const { mutate } = useDeleteProfil()
  const { control, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      reason: undefined,
      comment: '',
    },
    resolver: zodResolver(schema),
  })

  const reason = watch('reason')
  const comment = watch('comment')

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        reasons: [values.reason],
        comment: values.comment?.trim().slice(0, 1000) || '',
      },
      {
        onSuccess: () => {
          onConfirm()
        },
      },
    )
  })

  return (
    <YStack paddingVertical={'$medium'} gap={'$large'} marginTop={'$large'}>
      <Text fontWeight={'bold'} marginBottom={'$normal'} fontSize={16} paddingHorizontal={'$medium'}>
        Pourquoi nous quitter ?
      </Text>

      <JustificationText paddingHorizontal={'$medium'}>
        Cela nous attriste de voir un acteur de notre Parti décider de nous quitter. Nous aimerions beaucoup comprendre ce qui vous a conduit à cette décision.{' '}
      </JustificationText>

      <JustificationText paddingHorizontal={'$medium'}>
        Votre avis est précieux pour nous aider à nous améliorer et à faire évoluer notre Parti. N’hésitez pas à nous partager vos raisons, même brièvement.
      </JustificationText>

      <View background="$gray1" padding="$medium">
        <Controller
          control={control}
          name={'reason'}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              options={Object.entries(UnregistrationReasonLabels).map(([value, label]) => ({
                label,
                value,
              }))}
            />
          )}
        />
      </View>

      {reason === UnregistrationReason.Other && (
        <View paddingHorizontal={'$medium'}>
          <Controller
            control={control}
            name={'comment'}
            render={({ field }) => <Input placeholder={'Mon message'} multiline numberOfLines={5} color="gray" value={field.value} onChange={field.onChange} />}
          />

          <Text mt={'$2'} marginLeft={'$medium'} color="$textSecondary">
            {comment?.length ?? 0}/1000 caractères maximum
          </Text>
        </View>
      )}

      <XStack gap="$medium" justifyContent="flex-end" paddingBottom={'$medium'} paddingHorizontal={'$medium'}>
        <VoxButton variant="outlined" onPress={onClose}>
          J’annule tout
        </VoxButton>
        <VoxButton variant="contained" theme="orange" onPress={onSubmit}>
          Je confirme ma {isAdherent ? 'désadhésion' : 'suppression'}
        </VoxButton>
      </XStack>
    </YStack>
  )
}

const UnregistrationReasonLabels: Record<UnregistrationReason, string> = {
  [UnregistrationReason.Emails]: "Je reçois trop d'emails",
  [UnregistrationReason.Support]: "J'avais uniquement créé ce compte pour soutenir la candidature d'Emmanuel Macron",
  [UnregistrationReason.Government]: "Je ne suis plus d'accord avec le gouvernement",
  [UnregistrationReason.Movement]: 'Je ne me reconnais plus dans les orientations nationales du Parti',
  [UnregistrationReason.Elected]: 'Je suis déçu(e) par mon/mes élu(e)s Renaissance',
  [UnregistrationReason.Tools]: 'Je ne trouve plus d’utilité dans les outils développés par Renaissance',
  [UnregistrationReason.Other]: 'Autre raison',
}

const JustificationText = styled(Text, {
  color: '$textSecondary',
  lineHeight: 20,
})
