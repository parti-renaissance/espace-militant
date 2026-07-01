import { XStack, YStack } from 'tamagui'
import { Controller, useForm } from 'react-hook-form'

import CheckboxGroup from '@/components/base/CheckboxGroup/CheckboxGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

import { declarationsValues } from '@/services/adherents/constants'
import { useMutationUpdateProfil } from '@/services/profile/hook'
import { RestElectedProfileResponse } from '@/services/profile/schema'

export default function (props: { profil: RestElectedProfileResponse }) {
  const { handleSubmit, reset, formState, control } = useForm({
    defaultValues: {
      declared_mandates: props.profil?.declared_mandates || [],
    },
  })
  const { isDirty } = formState
  const { mutateAsync, isPending } = useMutationUpdateProfil({ userUuid: props.profil.uuid })
  const onSubmit = handleSubmit((x) => {
    const declaredMandates = x.declared_mandates
    return mutateAsync({ declared_mandates: declaredMandates }).then(() => {
      reset({ declared_mandates: declaredMandates })
    })
  })

  return (
    <VoxCard>
      <VoxCard.Content>
        <YStack gap="$medium">
          <Text.LG semibold>Déclaration de mandat</Text.LG>
          <Text.P>
            Si vous êtes élu de la nation, vous pouvez déclarer des mandats depuis cette page afin d’en notifier le bureau de l’Assemblée départementale qui a
            le pouvoir de vous rattacher des mandats.
          </Text.P>
          <Controller
            name="declared_mandates"
            control={control}
            render={({ field }) => {
              return <CheckboxGroup options={declarationsValues} onChange={field.onChange} value={field.value} />
            }}
          />
          <XStack justifyContent="flex-end" gap="$small">
            <VoxButton variant="outlined" disabled={!isDirty} onPress={() => reset()}>
              Annuler
            </VoxButton>
            <VoxButton theme="blue" variant="outlined" loading={isPending} onPress={onSubmit} disabled={!isDirty}>
              Enregistrer
            </VoxButton>
          </XStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
