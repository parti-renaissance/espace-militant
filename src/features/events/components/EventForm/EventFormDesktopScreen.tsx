import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFrame } from '@/components/base/FormFrames'
import Input from '@/components/base/Input/Input'
import Select, { SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import DatePickerField from '@/components/DatePickerV2'
import { VoxHeader } from '@/components/Header/Header'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import DescriptionInput from '@/features/events/components/EventForm/DescriptionInput'
import { EventFormData } from '@/features/events/components/EventForm/schema'
import { ArrowLeft, Calendar, Info, Sparkle, Users, Video, Webcam } from '@tamagui/lucide-icons'
import { Link, useNavigation } from 'expo-router'
import { Controller } from 'react-hook-form'
import { isWeb, XStack, YStack } from 'tamagui'
import { ScrollStack } from '../../pages/detail/EventComponents'
import { useEventFormContext } from './context'

export const EventFormDesktopScreenSkeleton = () => {
  const navigation = useNavigation()
  return (
    <PageLayout.MainSingleColumn>
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
              <VoxButton size="lg" variant="soft" theme="orange">
                Annuler
              </VoxButton>
            </Link>
          </XStack>
          <XStack flexGrow={1} justifyContent="center">
            <VoxHeader.Title>Créer un événement</VoxHeader.Title>
          </XStack>
          <XStack>
            <VoxButton size="lg" variant="text" theme="blue" disabled>
              Créer
            </VoxButton>
          </XStack>
        </XStack>
      </VoxHeader>

      <SkeCard>
        <SkeCard.Content>
          <SF theme="purple" />
          <SkeCard.Separator />
          <SF />
          <SF />
          <SF />
          <SkeCard.Separator />
          <SF height={200} />
          <SkeCard.Separator />
          <XStack gap="$small">
            <SkeCard.Button />
            <SkeCard.Button />
          </XStack>
          <SF />
          <SF height={200} />
          <SkeCard.Separator />
          <SF />
          <SF />
        </SkeCard.Content>
      </SkeCard>
    </PageLayout.MainSingleColumn>
  )
}

const EventDesktopAside = () => {
  const { navigation, onSubmit, scopeOptions, control, visibilityOptions, catOptions, timezones, mode, setMode, isPending } = useEventFormContext()

  return (
    <PageLayout.SideBarRight width={390} alwaysShow paddingTop={0}>
      <VoxCard.Content>
        <Controller
          render={({ field, fieldState }) => {
            return (
              <Select
                error={fieldState.error?.message}
                size="sm"
                theme="purple"
                matchTextWithTheme
                label="Pour"
                value={field.value}
                options={scopeOptions}
                onChange={field.onChange}
              />
            )
          }}
          control={control}
          name="scope"
        />
        <VoxCard.Separator />

        <Controller
          render={({ field, fieldState }) => {
            return (
              <Select
                error={fieldState.error?.message}
                size="sm"
                color="gray"
                label="Accées"
                value={field.value}
                options={visibilityOptions}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )
          }}
          control={control}
          name="visibility"
        />

        <Controller
          render={({ field, fieldState }) => {
            return (
              <Select
                error={fieldState.error?.message}
                size="sm"
                color="gray"
                label="Catégorie"
                value={field.value}
                options={catOptions}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )
          }}
          control={control}
          name="category"
        />
        <FormFrame height="auto" flexDirection="column" paddingHorizontal={0} pt="$medium" overflow="hidden" theme="gray">
          <Controller
            render={({ field, fieldState }) => {
              return (
                <YStack>
                  <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                    <XStack flex={1}>
                      <FormFrame.Label>Date début</FormFrame.Label>
                    </XStack>
                    <XStack gap="$small" flex={1} justifyContent="flex-end">
                      <DatePickerField error={fieldState.error?.message} type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                      <DatePickerField error={fieldState.error?.message} type="time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    </XStack>
                  </XStack>
                  {fieldState.error ? (
                    <XStack paddingHorizontal="$medium" alignSelf="flex-end" pt="$xsmall">
                      <Text.XSM textAlign="right" color="$orange5">
                        {fieldState.error?.message}
                      </Text.XSM>
                    </XStack>
                  ) : null}
                </YStack>
              )
            }}
            control={control}
            name="begin_at"
          />
          <Controller
            render={({ field, fieldState }) => {
              return (
                <YStack>
                  <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
                    <XStack flex={1}>
                      <FormFrame.Label>Date fin</FormFrame.Label>
                    </XStack>
                    <XStack gap="$small" flex={1} justifyContent="flex-end">
                      <DatePickerField error={fieldState.error?.message} type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                      <DatePickerField error={fieldState.error?.message} type="time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    </XStack>
                  </XStack>
                  {fieldState.error ? (
                    <XStack paddingHorizontal="$medium" alignSelf="flex-end" pt="$xsmall">
                      <Text.XSM textAlign="right" color="$orange5">
                        {fieldState.error?.message}
                      </Text.XSM>
                    </XStack>
                  ) : null}
                </YStack>
              )
            }}
            control={control}
            name="finish_at"
          />

          <Controller
            render={({ field }) => {
              return (
                <Select
                  size="sm"
                  color="gray"
                  label="Fuseau horaire"
                  value={field.value}
                  searchable
                  options={timezones}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  frameProps={{
                    pb: '$medium',
                    pt: '$medium',
                    height: 'auto',
                  }}
                />
              )
            }}
            control={control}
            name="time_zone"
          />
        </FormFrame>
        <Controller
          render={({ field }) => {
            return (
              <ButtonGroup
                flex={1}
                size="md"
                theme="blue"
                variant="soft"
                switchMode
                options={[
                  { value: 'meeting', label: 'En Présentiel' },
                  { value: 'online', label: 'En ligne' },
                ]}
                onChange={(x) => {
                  field.onChange(x)
                  setMode(x as EventFormData['mode'])
                }}
                value={field.value}
              />
            )
          }}
          control={control}
          name="mode"
        />
        {mode === 'meeting' ? (
          <Controller
            render={({ field, fieldState }) => {
              return (
                <AddressAutocomplete
                  size="sm"
                  color="gray"
                  label="Localisation"
                  error={fieldState.error?.message}
                  onBlur={field.onBlur}
                  setAddressComponents={(x) => {
                    field.onChange({
                      address: x.address,
                      city_name: x.city,
                      postal_code: x.postalCode,
                      country: x.country,
                    })
                  }}
                />
              )
            }}
            control={control}
            name="post_address"
          />
        ) : (
          <YStack>
            <Controller
              render={({ field, fieldState }) => {
                return (
                  <Input
                    size="sm"
                    color="gray"
                    placeholder="Lien visio"
                    onBlur={field.onBlur}
                    inputMode="url"
                    error={fieldState.error?.message}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    iconRight={<Webcam size={16} color="$gray4" />}
                  />
                )
              }}
              control={control}
              name="visio_url"
            />
          </YStack>
        )}

        <XStack gap="$medium" alignContent="center" alignItems="center">
          <Text.MD secondary>Optionnel</Text.MD>
          <VoxCard.Separator />
        </XStack>

        <YStack>
          <Controller
            render={({ field, fieldState }) => {
              return (
                <YStack height={44}>
                  <Input
                    size="sm"
                    color="gray"
                    placeholder="Lien du live"
                    inputMode="url"
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    iconRight={<Video size={16} color="$gray4" />}
                  />
                </YStack>
              )
            }}
            control={control}
            name="live_url"
          />
        </YStack>

        <YStack>
          <Controller
            render={({ field }) => {
              return (
                <YStack height={44}>
                  <Input
                    size="sm"
                    color="gray"
                    placeholder="Capacité"
                    type="number"
                    inputMode="numeric"
                    defaultValue={field.value?.toString()}
                    onBlur={field.onBlur}
                    onChange={(x) => field.onChange(Number(x))}
                    iconRight={<Users size={16} color="$gray4" />}
                  />
                </YStack>
              )
            }}
            control={control}
            name="capacity"
          />
        </YStack>
        <XStack alignItems="center" justifyContent="flex-end" gap="$small" flex={1} width="100%">
          {/* <XStack alignContent="flex-start">
            <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
              <VoxButton size="lg" variant="outlined">
                Annuler
              </VoxButton>
            </Link>
          </XStack> */}
          <XStack>
            <VoxButton onPress={() => onSubmit()} size="md" variant="contained" theme="purple" pop loading={isPending} iconLeft={Sparkle}>
              Créer l'événement
            </VoxButton>
          </XStack>
        </XStack>
      </VoxCard.Content>
    </PageLayout.SideBarRight>
  )
}

const EventDesktopMain = () => {
  const { control } = useEventFormContext()

  return (
    <PageLayout.MainSingleColumn height="100%">
      <VoxCard.Content pr={0} height="100%">
        <VoxCard.Content height="100%" p={0} pr="$medium">
          <SF height={300} />
          <VoxCard.Separator />
          <YStack>
            <Controller
              render={({ field, fieldState }) => {
                return (
                  <Input
                    error={fieldState.error?.message}
                    size="sm"
                    color="gray"
                    placeholder="Titre"
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )
              }}
              control={control}
              name="name"
            />
          </YStack>
          <YStack>
            <Controller
              render={({ field, fieldState }) => {
                return (
                  <>
                    <YStack minHeight={100} maxHeight={400}>
                      <DescriptionInput
                        error={fieldState.error?.message}
                        label="Description"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </YStack>
                  </>
                )
              }}
              control={control}
              name="description"
            />
          </YStack>
        </VoxCard.Content>
      </VoxCard.Content>
    </PageLayout.MainSingleColumn>
  )
}

const BackButton = (props: { children?: React.ReactNode }) => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : '/evenements'} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        {props.children ?? 'Annuler'}
      </VoxButton>
    </Link>
  )
}

const EventFormDesktopScreen = () => {
  return (
    <ScrollStack>
      <XStack pb="$medium" flex={1}>
        <BackButton />
      </XStack>
      <YStack gap="$medium">
        <VoxCard>
          <VoxCard.Content pb={0} justifyContent="center" alignItems="center">
            <VoxHeader.Title icon={Calendar}>Nouvel événement</VoxHeader.Title>
          </VoxCard.Content>
          <VoxCard.Content pb={0} pt={0}>
            <MessageCard theme="gray" iconLeft={Info}>
              Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
            </MessageCard>
          </VoxCard.Content>

          <XStack>
            <EventDesktopMain />
            <EventDesktopAside />
          </XStack>
        </VoxCard>
      </YStack>
    </ScrollStack>
  )
}

export default EventFormDesktopScreen
