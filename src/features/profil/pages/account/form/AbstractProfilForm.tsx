import React, { useEffect } from 'react'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { isPathExist } from '@/services/common/errors/utils'
import { ProfileFormError } from '@/services/profile/error'
import { useMutationUpdateProfil } from '@/services/profile/hook'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { zodResolver } from '@hookform/resolvers/zod'
import { Control, FieldValues, FormState, useForm } from 'react-hook-form'
import { XStack } from 'tamagui'
import * as z from 'zod'

const AbstractForm = <T extends z.Schema<any, any>, TF extends FieldValues>(
  props: {
    defaultValues: TF
    uuid: string
    validatorSchema: T
    onErrors?: (errors: FormState<TF>['errors']) => void
    children: (props: { control: Control<TF>; formState: FormState<TF> }) => React.ReactNode
  } & { cardProps?: React.ComponentProps<typeof VoxCard> },
) => {
  const { control, handleSubmit, formState, reset, setError } = useForm({
    resolver: zodResolver(props.validatorSchema),
    values: props.defaultValues,
    mode: 'all',
  })
  const { isDirty, isValid, isSubmitSuccessful } = formState

  useEffect(() => {
    reset(props.defaultValues)
  }, [props.defaultValues])

  React.useEffect(() => {
    if (props.onErrors) {
      props.onErrors(formState.errors)
    }
  }, [formState])

  const { mutateAsync, isPending } = useMutationUpdateProfil({ userUuid: props.uuid })

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data).catch((e) => {
      if (e instanceof ProfileFormError) {
        e.violations.forEach((violation) => {
          if (isPathExist(violation.propertyPath, props.defaultValues)) {
            setError(violation.propertyPath, { message: violation.message })
          } else {
            ErrorMonitor.log('Unknown property path / profil form', violation)
          }
        })
      }
    })
  })

  return (
    <VoxCard {...props.cardProps}>
      <VoxCard.Content gap="$large">
        {props.children({ control, formState })}
        <XStack justifyContent="flex-end" gap="$small">
          <VoxButton variant="outlined" display={isDirty ? 'flex' : 'none'} onPress={() => reset()}>
            Annuler
          </VoxButton>
          <VoxButton variant="outlined" theme="blue" onPress={onSubmit} loading={isPending} disabled={!isDirty || !isValid}>
            Enregister
          </VoxButton>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default AbstractForm
