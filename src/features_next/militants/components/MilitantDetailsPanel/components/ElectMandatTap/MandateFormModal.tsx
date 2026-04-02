import { useCallback, useMemo } from 'react'
import { useMedia, XStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import Switch from '@/components/base/SwitchV2/SwitchV2'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { GlobalSearch, ZoneProvider } from '@/components/GlobalSearch'
import { VoxHeader } from '@/components/Header/Header'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import DateInterval from '@/features_next/publications/components/Editor/RenderFields/SelectFilters/AdvancedFilters/DateInterval'

import { declarationsValues } from '@/services/adherents/constants'
import { useMutationCreateAdherentElectMandate, useMutationUpdateAdherentElectMandate } from '@/services/adherents/hook'
import type { RestAdherentElectMandate } from '@/services/adherents/schema'

const mandateTypeOptions = declarationsValues.map((d) => ({ value: d.value, label: d.label }))

const mandateFormSchema = z.object({
  mandate_type: z.string().min(1, 'Le type de mandat est requis'),
  zone: z.string().min(1, 'La zone est requise'),
  dates: z.object({
    start: z.string().nullable(),
    end: z.string().nullable(),
  }),
  delegation: z.string().nullable(),
})

type MandateFormValues = z.infer<typeof mandateFormSchema>

export interface MandateFormModalProps {
  open: boolean
  onClose: () => void
  adherentUuid: string
  scope: string
  mandate?: RestAdherentElectMandate | null
}

export default function MandateFormModal({ open, onClose, adherentUuid, scope, mandate }: MandateFormModalProps) {
  const media = useMedia()
  const isEditing = Boolean(mandate)

  const zoneDefaultValue = useMemo(() => {
    if (!mandate?.zone) return undefined
    return { value: mandate.zone.uuid, label: `${mandate.zone.name} (${mandate.zone.code})` }
  }, [mandate?.zone])

  const { control, handleSubmit, reset, formState, watch, setValue } = useForm<MandateFormValues>({
    defaultValues: {
      mandate_type: mandate?.mandate_type ?? '',
      zone: mandate?.zone.uuid ?? '',
      delegation: mandate?.delegation ?? '',
      dates: {
        start: mandate?.begin_at ?? null,
        end: mandate?.finish_at ?? null,
      },
    },
    resolver: zodResolver(mandateFormSchema),
    mode: 'all',
  })

  const { isValid } = formState
  const datesValue = watch('dates')
  const mandateTypeValue = watch('mandate_type')

  const zoneProvider = useMemo(() => {
    return new ZoneProvider(mandateTypeValue ? { forMandateType: mandateTypeValue } : undefined)
  }, [mandateTypeValue])

  const { mutateAsync: createMandate, isPending: isCreating } = useMutationCreateAdherentElectMandate({ adherentUuid, scope })
  const { mutateAsync: updateMandate, isPending: isUpdating } = useMutationUpdateAdherentElectMandate({ adherentUuid, scope })

  const isPending = isCreating || isUpdating

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  const onSubmit = handleSubmit((data) => {
    const payload = {
      adherent: adherentUuid,
      mandate_type: data.mandate_type,
      zone: data.zone,
      begin_at: data.dates.start ?? new Date().toISOString().split('T')[0],
      finish_at: data.dates.end ?? null,
      delegation: data.delegation ?? '',
    }

    const action = isEditing && mandate ? updateMandate({ mandateUuid: mandate.uuid, payload }) : createMandate({ payload })

    action.then(() => {
      reset()
      onClose()
    })
  })

  return (
    <ModalOrPageBase
      open={open}
      onClose={handleClose}
      header={
        <VoxHeader justifyContent="space-between">
          <VoxHeader.Title>{isEditing ? 'Modifier le mandat' : 'Ajouter un mandat'}</VoxHeader.Title>
          <VoxHeader.LeftButton onPress={handleClose} icon={X} />
        </VoxHeader>
      }
    >
      <VoxCard width={media.gtMd ? 500 : undefined} shadowColor={media.md ? 'transparent' : undefined}>
        <VoxCard.Content>
          {media.gtMd ? (
            <XStack justifyContent="space-between" alignItems="flex-start">
              <Text.LG>{isEditing ? 'Modifier le mandat' : 'Ajouter un mandat'}</Text.LG>
            </XStack>
          ) : null}

          <Controller
            control={control}
            name="mandate_type"
            render={({ field, fieldState }) => (
              <Select
                label="Type de mandat"
                value={field.value}
                options={mandateTypeOptions}
                onChange={(v) => field.onChange(v ?? '')}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                color="gray"
                size="md"
                noValuePlaceholder="Choisir"
              />
            )}
          />

          <Controller
            control={control}
            name="zone"
            render={({ field, fieldState }) => (
              <GlobalSearch
                provider={zoneProvider}
                defaultValue={zoneDefaultValue}
                placeholder="Rechercher une zone..."
                scope={scope}
                nullable
                error={fieldState.error?.message}
                onBlur={field.onBlur}
                onSelect={(result) => field.onChange(result?.id ?? '')}
              />
            )}
          />

          <XStack alignItems="center" gap="$xxsmall">
            <Switch
              checked={!datesValue.end}
              onPress={() => {
                const newEnd = datesValue.end ? null : new Date().toISOString().split('T')[0]
                setValue('dates', { ...datesValue, end: newEnd }, { shouldDirty: true, shouldValidate: true })
              }}
            />
            <Text.SM>Le mandat est en cours</Text.SM>
          </XStack>

          <Controller
            control={control}
            name="dates"
            render={({ field }) => <DateInterval labelFrom="Date de début" labelTo="Date de fin" value={field.value} onChange={field.onChange} resetable />}
          />

          <Controller
            control={control}
            name="delegation"
            render={({ field, fieldState }) => (
              <Input
                label="Délégation"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                color="gray"
                placeholder="Délégation (optionnel)"
                size="md"
              />
            )}
          />

          <XStack justifyContent="flex-end" gap="$small">
            <VoxButton variant="outlined" theme="blue" onPress={onSubmit} loading={isPending} disabled={!isValid}>
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </VoxButton>
          </XStack>
        </VoxCard.Content>
      </VoxCard>
    </ModalOrPageBase>
  )
}
