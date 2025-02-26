import { useEffect } from 'react'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Controller, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

export const ButtonNodeEditor = (props: { value: S.ButtonNode; onChange: (node: S.ButtonNode) => void }) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: props.value,
  })

  const onSubmit = useDebouncedCallback(handleSubmit(props.onChange), 100)

  useEffect(() => {
    const subscriber = watch(() => {
      onSubmit()
    })

    return () => {
      subscriber.unsubscribe()
    }
  }, [])

  return (
    <>
      <Controller
        control={control}
        name="label"
        render={({ field, fieldState }) => {
          return (
            <Input
              selectTextOnFocus
              label="Label"
              color="gray"
              defaultValue={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )
        }}
      />
      <Controller
        control={control}
        name="link"
        render={({ field, fieldState }) => {
          return (
            <Input
              label="Lien"
              selectTextOnFocus
              color="gray"
              inputMode="url"
              defaultValue={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )
        }}
      />
      <Controller
        control={control}
        name="marks"
        render={({ field, fieldState }) => {
          return (
            <Select
              label="Style"
              options={[
                { value: 'primary', label: 'Primaire (bleu)' },
                { value: 'secondary', label: 'Secondaire (blanc)' },
              ]}
              value={field.value?.filter((x) => x !== 'unsupported')[0]}
              onChange={(x) => field.onChange([x])}
              error={fieldState.error?.message}
            />
          )
        }}
      />
    </>
  )
}
