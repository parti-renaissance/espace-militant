import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import CountrySelect from '@/components/CountrySelect/CountrySelect'
import DatePicker from '@/components/DatePicker'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import SpacedContainer from '@/components/SpacedContainer/SpacedContainer'
import ActionTypeEntry from '@/screens/actions/ActionTypeEntry'
import { ActionFormError } from '@/services/actions/error'
import { useAction, useCancelAction } from '@/services/actions/hook/useActions'
import { useCreateOrEditAction } from '@/services/actions/hook/useCreateOrEditAction'
import { Action, ActionType, ActionTypeIcon, isFullAction, ReadableActionType } from '@/services/actions/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PenLine, Ban } from '@tamagui/lucide-icons'
import { addHours, formatISO } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { useMedia, View } from 'tamagui'
import { validateActionFormSchema } from './schema'

interface Props {
  onClose?: () => void
  uuid?: string
  scope?: string
}

export default function ActionForm({ onClose, uuid, scope }: Props) {
  const media = useMedia()
  const webViewPort = media.gtXs

  const { data, isLoading } = useAction(uuid)

  return (
    <View padding={'$medium'} style={{ marginBottom: webViewPort ? 0 : 80 }}>
      <Text fontSize={16} fontWeight={'$6'} mb={'$medium'}>
        {uuid ? 'Je modifie une action' : 'Je crée une action'}
      </Text>
      <View>
        {uuid && isLoading ? (
          <SkeCard minWidth={370} $gtSm={{ borderRadius: 'unset' }}>
            <SkeCard.Title />
            <SkeCard.Title />
            <SkeCard.Description />
            <SkeCard.Title />
            <SkeCard.Title />
            <SkeCard.Description />
            <SkeCard.Title />
            <SkeCard.Title />
            <SkeCard.Description />
            <SkeCard.Title />
            <SkeCard.Title />
            <SkeCard.Description />
          </SkeCard>
        ) : (
          <_ActionForm onClose={onClose} uuid={uuid} scope={scope} data={uuid ? data : undefined} />
        )}
      </View>
    </View>
  )
}

function _ActionForm({ onClose, uuid, scope, data }: Props & { data: Action | undefined }) {
  const media = useMedia()
  const webViewPort = media.gtXs

  const { control, handleSubmit, formState, reset, setError } = useForm({
    resolver: zodResolver(validateActionFormSchema),
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
    defaultValues: {
      type: data?.type ?? ActionType.PAP,
      date: data?.date ?? addHours(new Date(), 1),
      addressInput: data?.post_address ? `${data.post_address.address}  ${data.post_address.city_name}` : '',
      post_address: {
        address: data?.post_address?.address ?? '',
        city_name: data?.post_address?.city_name ?? '',
        postal_code: data?.post_address?.postal_code ?? '',
        country: data?.post_address?.country ?? '',
      },
      description: (data && isFullAction(data) ? data?.description : '') ?? '',
    },
  })

  const $postAction = useCreateOrEditAction({
    uuid,
    scope,
  })

  const { mutateAsync: cancelAction, isPending } = useCancelAction()

  const handleCancel = () => {
    if (uuid) {
      cancelAction({ uuid }).then(() => {
      }).catch((e) => {
        console.warn(e);
      }).finally(() => {
        onClose?.()
      })
    }
  }

  const onSubmit = handleSubmit((data) => {
    $postAction
      .mutateAsync({ ...data, date: formatISO(data.date) })
      .then(() => {
        reset(data)
        onClose?.()
      })
      .catch((e) => {
        if (e instanceof ActionFormError) {
          e.violations.forEach((violation) => {
            setError(violation.propertyPath, { message: violation.message })
          })
        }
      })
  })

  const [manualAddress, setManualAddress] = useState<boolean>(false)
  const onManualAddressToggle = useCallback(() => {
    setManualAddress((v) => !v)
  }, [])
  useEffect(() => {
    if (formState.errors.post_address) {
      setManualAddress(true)
    }
  }, [formState.errors.post_address])

  return (
    <Fragment>
      <View mb={'$medium'}>
        <Text fontSize={14} fontWeight={'$6'}>
          Catégories d’actions
        </Text>
      </View>
      <View flexDirection={webViewPort ? 'row' : undefined} gap={'$medium'} mb={'$medium'}>
        <Controller
          control={control}
          name={'type'}
          render={({ field: { onChange, value } }) => (
            <>
              {Object.values(ActionType).map((el) => (
                <View key={`${el}`} flex={webViewPort ? 1 : undefined} width={webViewPort ? '100%' : undefined}>
                  <ActionTypeEntry
                    label={ReadableActionType[el]}
                    Icon={ActionTypeIcon[el]}
                    description={''}
                    selected={value === el}
                    onPress={() => onChange(el)}
                  />
                </View>
              ))}
            </>
          )}
        />
      </View>

      <SpacedContainer>
        <Text fontSize={14} fontWeight={'$6'}>
          Fixez un rendez-vous
        </Text>
      </SpacedContainer>

      <View flexDirection={webViewPort ? 'row' : undefined} gap={webViewPort ? '$medium' : undefined}>
        <SpacedContainer style={{ flex: 1 }}>
          <Controller
            control={control}
            name={'date'}
            render={({ field, fieldState }) => (
              <DatePicker
                label={'Date'}
                type="date"
                error={fieldState.error?.message}
                onBlur={field.onBlur}
                value={field.value}
                color="gray"
                onChange={field.onChange}
              />
            )}
          />
        </SpacedContainer>

        <SpacedContainer style={{ flex: 1 }}>
          <Controller
            control={control}
            name={'date'}
            render={({ field, fieldState }) => (
              <DatePicker
                label={'Heure'}
                error={fieldState.error?.message ?  ' ' : undefined}
                onBlur={field.onBlur}
                value={field.value}
                color="gray"
                onChange={field.onChange}
                type={'time'}
              />
            )}
          />
        </SpacedContainer>
      </View>

      <SpacedContainer>
        {manualAddress ? (
          <View gap="$medium">
            <Controller
              name="post_address.address"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input color="gray" placeholder="Adresse" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
              )}
            />

            <Controller
              name="post_address.city_name"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input color="gray" placeholder="Ville" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
              )}
            />

            <Controller
              name="post_address.postal_code"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input color="gray" placeholder="Code postal" value={value ?? undefined} onBlur={onBlur} onChange={onChange} error={error?.message} />
              )}
            />

            <Controller
              name="post_address.country"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <CountrySelect
                  id="country_select"
                  color="gray"
                  value={value ?? undefined}
                  placeholder="Pays"
                  onBlur={onBlur}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </View>
        ) : (
          <Controller
            name="post_address"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <AddressAutocomplete
                color="gray"
                label="Adresse"
                placeholder="Rechercher une adresse"
                defaultValue={`${value?.address} ${value?.city_name}`.trim()}
                onBlur={onBlur}
                setAddressComponents={(x) =>
                  onChange({
                    address: x.address,
                    city_name: x.city,
                    postal_code: x.postalCode,
                    country: x.country,
                  })
                }
                error={error?.message}
              />
            )}
          />
        )}
      </SpacedContainer>

      <SpacedContainer>
        <TouchableOpacity onPress={onManualAddressToggle}>
          {manualAddress ? (
            <Text color={'$textSecondary'} textAlign="center" mt={'$medium'}>
              <Text color={'$blue6'}>Revenir</Text> à une saisie simplifiée
            </Text>
          ) : (
            <>
              <Text color={'$textSecondary'} textAlign="center">
                Un problème ?
              </Text>
              <Text color={'$textSecondary'} textAlign="center">
                <Text color={'$blue6'}>Cliquez ici</Text> pour saisir manuellement votre adresse.
              </Text>
            </>
          )}
        </TouchableOpacity>
      </SpacedContainer>

      <SpacedContainer>
        <Text fontSize={14} fontWeight={'$6'}>
          Description (optionnelle)
        </Text>
      </SpacedContainer>

      <SpacedContainer>
        <Controller
          control={control}
          name={'description'}
          render={({ field }) => (
            <Input placeholder={'Ajoutez une description'} multiline numberOfLines={5} color="gray" value={field.value} onChange={field.onChange} />
          )}
        />

        <Text mt={'$2'}>1000 caractères maximum</Text>
      </SpacedContainer>

      <View flexDirection={'row'} justifyContent={'flex-end'} gap={'$medium'}>
        {uuid
          ? (
            <VoxButton variant={'text'} iconLeft={Ban} theme="orange" onPress={handleCancel}>
              Annuler
            </VoxButton>
          ) : null
        }
        <VoxButton variant="contained" onPress={onSubmit} iconLeft={PenLine} loading={$postAction.isPending}>
          {uuid ? 'Modifier l’action' : 'Créer l’action'}
        </VoxButton>
      </View>
    </Fragment>
  )
}
