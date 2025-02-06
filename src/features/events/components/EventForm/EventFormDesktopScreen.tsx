import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFileImage } from '@/components/base/FormFileUpload/FormFileImage'
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
import EventHandleActions from '../EventHandleActions'
import { useEventFormContext } from './context'

const EventDesktopAside = () => {
  const { scopeOptions, control, visibilityOptions, catOptions, timezones, mode, setMode } = useEventFormContext()

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
                label="Accèes"
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
                  defaultValue={field.value ? `${field.value?.address} ${field.value?.city_name}` : undefined}
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
      </VoxCard.Content>
    </PageLayout.SideBarRight>
  )
}

const EventDesktopFooter = () => {
  const { isPending, isUploadImagePending, isUploadDeletePending, onSubmit, editMode, currentScope, event } = useEventFormContext()
  return (
    <XStack flex={1}>
      <VoxCard.Content pt={0} flex={1}>
        <XStack alignItems="center" gap="$small">
          {editMode && event ? (
            <EventHandleActions
              event={event}
              scope={currentScope.code}
              buttonProps={{
                theme: 'orange',
                size: 'sm',
                variant: 'soft',
              }}
            />
          ) : null}
        </XStack>
      </VoxCard.Content>

      <PageLayout.SideBarRight width={390} alwaysShow paddingTop={0}>
        <VoxCard.Content pt={0}>
          <XStack alignItems="center" justifyContent="flex-end" gap="$small" flex={1} width="100%">
            <XStack>
              <VoxButton
                onPress={() => onSubmit()}
                size="md"
                variant="contained"
                theme="purple"
                pop
                loading={isPending || isUploadImagePending || isUploadDeletePending}
                iconLeft={Sparkle}
              >
                {[isUploadImagePending, isUploadDeletePending, isPending].every((x) => x === false) ? `${editMode ? 'Modifier' : 'Créer'} l'événement` : null}
                {isUploadImagePending ? "Envoi de l'image..." : null}
                {isUploadDeletePending ? "Supression de l'image..." : null}
                {isPending ? `${editMode ? 'Modification' : 'Création'}...` : null}
              </VoxButton>
            </XStack>
          </XStack>
        </VoxCard.Content>
      </PageLayout.SideBarRight>
    </XStack>
  )
}

const EventDesktopMain = () => {
  const { control } = useEventFormContext()

  return (
    <PageLayout.MainSingleColumn height="100%">
      <VoxCard.Content pr={0} height="100%">
        <VoxCard.Content height="100%" p={0} pr="$medium">
          <Controller
            render={({ field }) => {
              return <FormFileImage placeholder="Ajouter une image de couverture" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            }}
            control={control}
            name="image"
          />
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
  const { editMode } = useEventFormContext()
  return (
    <ScrollStack>
      <XStack pb="$medium" flex={1}>
        <BackButton />
      </XStack>
      <YStack gap="$medium">
        <VoxCard>
          <VoxCard.Content pb={0} justifyContent="center" alignItems="center">
            <VoxHeader.Title icon={Calendar}>{`${editMode ? 'Modifier' : 'Créer'} l'événement`}</VoxHeader.Title>
          </VoxCard.Content>
          <VoxCard.Content pb={0} pt={0}>
            {editMode ? null : (
              <MessageCard theme="gray" iconLeft={Info}>
                Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
              </MessageCard>
            )}
          </VoxCard.Content>
          <XStack>
            <EventDesktopMain />
            <EventDesktopAside />
          </XStack>
          <EventDesktopFooter />
        </VoxCard>
      </YStack>
    </ScrollStack>
  )
}

export default EventFormDesktopScreen

const EventDesktopMainSkeleton = () => {
  return (
    <PageLayout.MainSingleColumn>
      <SkeCard.Content>
        <SF height={300} />
        <SkeCard.Separator />
        <SF />
        <SF height={200} />
      </SkeCard.Content>
    </PageLayout.MainSingleColumn>
  )
}

const EventDesktopAsideSkeleton = () => {
  return (
    <PageLayout.SideBarRight width={390} alwaysShow paddingTop={0}>
      <SkeCard.Content>
        <SF theme="purple" />
        <SkeCard.Separator />
        <SF />
        <SF />
        <SF height={200} />
        <XStack gap="$small">
          <SkeCard.Button />
          <SkeCard.Button />
        </XStack>
        <SF />
        <SkeCard.Separator />
        <SF />
        <SF />
        <XStack alignItems="center" justifyContent="flex-end" gap="$small" flex={1} width="100%">
          <XStack>
            <SkeCard.Button theme="purple" />
          </XStack>
        </XStack>
      </SkeCard.Content>
    </PageLayout.SideBarRight>
  )
}

export const EventFormDesktopScreenSkeleton = (props?: { editMode?: boolean }) => {
  return (
    <YStack padding="$medium" flex={1}>
      <PageLayout.MainSingleColumn>
        <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
          <SkeCard.Button />
        </XStack>
        <SkeCard>
          <VoxCard.Content pb={0} justifyContent="center" alignItems="center">
            <VoxHeader.Title icon={Calendar}>{`${props?.editMode ? 'Modifier' : 'Créer'} l'événement`}</VoxHeader.Title>
          </VoxCard.Content>
          <VoxCard.Content pb={0} pt={0}>
            {props?.editMode ? null : (
              <MessageCard theme="gray" iconLeft={Info}>
                Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
              </MessageCard>
            )}
          </VoxCard.Content>
          <XStack>
            <EventDesktopMainSkeleton />
            <EventDesktopAsideSkeleton />
          </XStack>
        </SkeCard>
      </PageLayout.MainSingleColumn>
    </YStack>
  )
}
