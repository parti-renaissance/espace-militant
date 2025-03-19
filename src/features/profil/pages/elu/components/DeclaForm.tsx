import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import { profileElectDeclarationFormError } from '@/services/profile/error'
import { usePostElectDeclaration } from '@/services/profile/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { Euro, X } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { View, XStack } from 'tamagui'
import * as z from 'zod'

type Props = {
  open: boolean
  onClose: () => void
  declaration?: number
}

const schema = z.object({
  revenue_amount: z.number({ message: 'Le montant doit être un nombre' }).int('Le montant doit être un nombre entier').min(0, 'Le montant doit être positif'),
})

export default function (props: Props) {
  const { control, handleSubmit, reset, formState, setError } = useForm({
    defaultValues: {
      revenue_amount: props.declaration ?? 0,
    },
    resolver: zodResolver(schema),
    mode: 'all',
  })

  const { mutateAsync, isPending } = usePostElectDeclaration()
  const { isDirty, isValid } = formState

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data)
      .then(() => {
        reset()
        props.onClose()
      })
      .catch((e) => {
        if (e instanceof profileElectDeclarationFormError) {
          e.violations.forEach((violation) => {
            setError(violation.propertyPath, { message: violation.message })
          })
        }
      })
  })

  return (
    <ModalOrPageBase
      open={props.open}
      onClose={props.onClose}
      header={
        <VoxHeader>
          <VoxHeader.LeftButton onPress={props.onClose} icon={X} backTitle="Annuler" />
        </VoxHeader>
      }
    >
      <VoxCard $gtMd={{ maxWidth: 500 }} $md={{ shadowColor: 'transparent' }}>
        <VoxCard.Content>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text.LG>Déclarer mes indemnités d’élu</Text.LG>
            <VoxButton $md={{ display: 'none' }} variant="text" theme="gray" iconLeft={X} size="sm" onPress={props.onClose} />
          </XStack>
          <Text.P>
            Montant mensuel de l’ensemble des indemnités brutes perçues au titre du ou des mandats locaux et mandats annexes (EPCI, Syndicats intercommunaux).
          </Text.P>
          <Controller
            control={control}
            name="revenue_amount"
            render={({ field, fieldState }) => {
              return (
                <View maxWidth={200}>
                  <Input
                    value={field.value.toString()}
                    error={fieldState.error?.message}
                    onBlur={field.onBlur}
                    color="gray"
                    label="Montant mensuel"
                    type="number"
                    placeholder="0"
                    onChange={(x) => field.onChange(parseInt(x))}
                    iconRight={<Euro color="$textSecondary" />}
                  />
                </View>
              )
            }}
          />
          <XStack justifyContent="flex-end" gap="$small">
            <VoxButton variant="outlined" display={isDirty ? 'flex' : 'none'} onPress={() => reset()}>
              Annuler
            </VoxButton>
            <VoxButton variant="outlined" theme="blue" onPress={onSubmit} loading={isPending} disabled={!isValid}>
              Enregistrer
            </VoxButton>
          </XStack>
        </VoxCard.Content>
      </VoxCard>
    </ModalOrPageBase>
  )
}
