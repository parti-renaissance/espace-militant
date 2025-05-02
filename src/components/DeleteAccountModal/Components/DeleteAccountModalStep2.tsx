import Input from '@/components/base/Input/Input'
import RadioGroup from '@/components/base/RadioGroup/RadioGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Controller, useForm } from 'react-hook-form'
import { styled, View, XStack, YStack } from 'tamagui'

interface Props {
  onClose: () => void
  onConfirm: () => void
  // Indicate if we should show "désadhésion" or "suppression"
  isDelete: boolean
}

export default function DeleteAccountModalStep2({ onClose, isDelete }: Readonly<Props>) {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      reason: '',
      comment: '',
    },
  })

  const reason = watch('reason')
  const comment = watch('comment')

  const onSubmit = handleSubmit((values) => {
    alert(`Not yet implemented ${JSON.stringify(values)}`)
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
            {comment.length}/1000 caractères maximum
          </Text>
        </View>
      )}

      <XStack gap="$medium" justifyContent="flex-end" paddingBottom={'$medium'} paddingHorizontal={'$medium'}>
        <VoxButton variant="text" onPress={onClose}>
          Annuler
        </VoxButton>
        <VoxButton variant="contained" theme="orange" onPress={onSubmit}>
          Je confirme ma {isDelete ? 'suppression' : 'désadhésion'}
        </VoxButton>
      </XStack>
    </YStack>
  )
}

enum UnregistrationReason {
  Emails = 'unregistration_reasons.emails',
  Tools = 'unregistration_reasons.tools',
  Support = 'unregistration_reasons.support',
  Government = 'unregistration_reasons.government',
  Elected = 'unregistration_reasons.elected',
  Movement = 'unregistration_reasons.movement',
  Committee = 'unregistration_reasons.committee',
  Other = 'unregistration_reasons.other',
}

const UnregistrationReasonLabels: Record<UnregistrationReason, string> = {
  [UnregistrationReason.Emails]: 'Je reçois trop d’e-mails',
  [UnregistrationReason.Tools]: 'Je ne trouve plus d’utilité dans les outils développés par En Marche',
  [UnregistrationReason.Support]: 'J’avais uniquement adhéré pour soutenir la candidature d’Emmanuel Macron',
  [UnregistrationReason.Government]: "Je ne suis plus d'accord avec le gouvernement",
  [UnregistrationReason.Elected]: 'Je suis déçu(e) par mon/les élu(e)s LaREM',
  [UnregistrationReason.Movement]: 'Je ne me reconnais plus dans les actions du mouvement En Marche !',
  [UnregistrationReason.Committee]: 'Je suis en désaccord avec l’activité de mon comité local',
  [UnregistrationReason.Other]: 'Autre',
}

const JustificationText = styled(Text, {
  color: '$textSecondary',
  lineHeight: '20px',
})
