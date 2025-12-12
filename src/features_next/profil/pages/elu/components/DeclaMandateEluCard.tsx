import CheckboxGroup from '@/components/base/CheckboxGroup/CheckboxGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useMutationUpdateProfil } from '@/services/profile/hook'
import { RestElectedProfileResponse } from '@/services/profile/schema'
import { Controller, useForm } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'

export default function (props: { profil: RestElectedProfileResponse }) {
  const declarationsValues = [
    {
      label: 'Député européen',
      value: 'depute_europeen',
    },
    {
      label: 'Sénateur',
      value: 'senateur',
    },
    {
      label: 'Député',
      value: 'depute',
    },
    {
      label: 'Président du Conseil régional',
      value: 'president_conseil_regional',
    },
    {
      label: 'Conseiller régional',
      value: 'conseiller_regional',
    },
    {
      label: 'Président du Conseil départemental',
      value: 'president_conseil_departemental',
    },
    {
      label: 'Conseiller départemental',
      value: 'conseiller_departemental',
    },
    {
      label: 'Conseiller territorial',
      value: 'conseiller_territorial',
    },
    {
      label: 'Président du Conseil communautaire',
      value: 'president_conseil_communautaire',
    },
    {
      label: 'Conseiller communautaire',
      value: 'conseiller_communautaire',
    },
    {
      label: 'Maire',
      value: 'maire',
    },
    {
      label: 'Conseiller municipal',
      value: 'conseiller_municipal',
    },
    {
      label: "Conseiller d'arrondissement",
      value: 'conseiller_arrondissement',
    },
    {
      label: "Membre de l'Assemblée des Français de l'étranger",
      value: 'membre_assemblee_fde',
    },
    {
      label: 'Conseiller FDE',
      value: 'conseiller_fde',
    },
    {
      label: 'Délégué consulaire',
      value: 'delegue_consulaire',
    },
  ]
  const { handleSubmit, reset, formState, control } = useForm({
    defaultValues: {
      mandates: props.profil?.mandates || [],
    },
  })
  const { isDirty } = formState
  const { mutateAsync, isPending } = useMutationUpdateProfil({ userUuid: props.profil.uuid })
  const onSubmit = handleSubmit((x) =>
    mutateAsync(x).then(() => {
      reset({ mandates: x.mandates })
    }),
  )

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
            name="mandates"
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
