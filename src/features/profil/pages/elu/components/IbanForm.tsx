import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import CountrySelect from '@/components/CountrySelect/CountrySelect'
import { VoxHeader } from '@/components/Header/Header'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { profileElectPaymentFormError } from '@/services/profile/error'
import { useGetDetailProfil, usePostElectPayment } from '@/services/profile/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pen, X } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { isWeb, XStack, YStack } from 'tamagui'
import * as z from 'zod'
import { smellsLikeIbanRegex } from './utils'

type Props = {
  open: boolean
  onClose: () => void
  declaration?: number
}

const InfoUser = () => {
  const { data } = useGetDetailProfil()
  const infos = [
    {
      label: 'Nom',
      value: data?.last_name,
    },
    {
      label: 'Prénom',
      value: data?.first_name,
    },
    {
      label: 'Pays de résidence',
      value: data?.post_address?.country,
    },
    {
      label: 'Adresse postale',
      value: data?.post_address?.address,
    },
    {
      label: 'Email',
      value: data?.email_address,
    },
  ]

  return (
    <YStack>
      {infos.map((info) => (
        <Text.SM multiline key={info.label}>
          {info.label} : <Text.SM secondary>{info.value}</Text.SM>
        </Text.SM>
      ))}
    </YStack>
  )
}

const schema = z.object({
  account_name: z.string().min(1, 'Le nom du titulaire du compte est requis'),
  iban: z.string().min(1, 'L’IBAN est requis').regex(smellsLikeIbanRegex, 'L’IBAN est invalide'),
  account_country: z.string().min(2, 'Le pays du compte bancaire est requis'),
})

export default function (props: Props) {
  const { control, handleSubmit, reset, formState, setError } = useForm({
    defaultValues: {
      account_name: '',
      iban: '',
      account_country: 'FR',
    },
    resolver: zodResolver(schema),
    mode: 'all',
  })

  const { isDirty, isValid } = formState

  const { mutateAsync, isPending } = usePostElectPayment()

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data)
      .then(() => {
        reset()
        props.onClose()
      })
      .catch((e) => {
        if (e instanceof profileElectPaymentFormError) {
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
      <VoxCard $gtMd={{ maxWidth: 500 }} $md={{ shadowColor: 'transparent' }} height="100%">
        <VoxCard.Content>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text.LG>Renseigner mes informations bancaires</Text.LG>
            <VoxButton $md={{ display: 'none' }} variant="text" theme="gray" iconLeft={X} size="sm" onPress={props.onClose} />
          </XStack>
          <Text.P>
            Les informations suivantes (Nom, Prénom, Pays de résidence, Adresse postale, E-mail) doivent être renseignées et à jour dans vos informations
            générales. Sans cette correspondance, votre contribution pourrait être mal traitée.
          </Text.P>
          <BoundarySuspenseWrapper
            fallback={
              <SkeCard>
                <SkeCard.Description />
              </SkeCard>
            }
          >
            <InfoUser />
          </BoundarySuspenseWrapper>
          <XStack>
            <Link href="/profil/informations-personnelles" asChild={!isWeb}>
              <VoxButton variant="outlined" theme="gray" onPress={props.onClose} iconLeft={Pen}>
                Éditer les informations personnelles
              </VoxButton>
            </Link>
          </XStack>
          <Text.MD semibold>Mes informations bancaires</Text.MD>
          <Controller
            control={control}
            name="account_name"
            render={({ field, fieldState }) => {
              return (
                <Input
                  error={fieldState.error?.message}
                  value={field.value}
                  onBlur={field.onBlur}
                  color="gray"
                  placeholder="Nom du titulaire du compte"
                  onChange={field.onChange}
                />
              )
            }}
          />
          <Controller
            name="account_country"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <CountrySelect
                id="country_select"
                color="gray"
                value={value ?? undefined}
                placeholder="Pays du compte bancaire"
                onBlur={onBlur}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="iban"
            render={({ field, fieldState }) => {
              return (
                <Input
                  error={fieldState.error?.message}
                  value={field.value}
                  onBlur={field.onBlur}
                  color="gray"
                  placeholder="IBAN (Identifiant international de compte bancaire)"
                  onChange={field.onChange}
                />
              )
            }}
          />
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
    </ModalOrPageBase>
  )
}
