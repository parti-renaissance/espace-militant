import React from 'react'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFileImage } from '@/components/base/FormFileUpload/FormFileImage'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import DescriptionInput from './DescriptionInput'
import { EventFormData } from '../schema'
import { ArrowLeft, Calendar, Info, Sparkle, Users, Video, Webcam } from '@tamagui/lucide-icons'
import { Link, useNavigation } from 'expo-router'
import { Controller } from 'react-hook-form'
import { isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import EventHandleActions from '../../../components/EventHandleActions'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { useEventFormContext } from '../context'
import EventDatesField from './EventDatesField'
import EventScopeSelect from './EventScopeSelect'

const EventFormAside = () => {
  const {
    isPastEvent,
    scopeOptions,
    control,
    editMode,
    visibilityOptions,
    catOptions,
    mode,
    setMode,
    isAuthor,
    handleOnChangeBeginAt,
    handleOnChangeFinishAt,
    isAgoraLeader,
  } = useEventFormContext()

  return (
    <YStack gap="$medium">
      <EventScopeSelect editMode={editMode} control={control} isAuthor={isAuthor} scopeOptions={scopeOptions} />
      <Controller
        render={({ field, fieldState }) => {
          return (
            <Select
              error={fieldState.error?.message}
              size="sm"
              color="gray"
              label="Accès"
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
              disabled={isAgoraLeader}
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
      <EventDatesField
        disabled={isPastEvent}
        control={control}
        handleOnChangeBeginAt={handleOnChangeBeginAt}
        handleOnChangeFinishAt={handleOnChangeFinishAt}
      />
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
                { value: 'meeting', label: 'En Présentiel', disabled: isAgoraLeader },
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
                enableFallback
                size="sm"
                color="gray"
                label="Localisation"
                defaultValue={field.value?.address && field.value.city_name ? `${field.value.address} ${field.value?.city_name}` : undefined}
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
                  iconRight={<Webcam size={20} color="$gray4" />}
                />
              )
            }}
            control={control}
            name="visio_url"
          />
        </YStack>
      )}

      {!isAgoraLeader ? (
        <>
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
                      iconRight={<Video size={20} color="$gray4" />}
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
              render={({ field, fieldState }) => {
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
                      error={fieldState.error?.message}
                      onChange={(x) => {
                        const value = x.trim()
                        field.onChange(value === '' ? null : Number(value))
                      }}
                      iconRight={<Users size={20} color="$gray4" />}
                    />
                  </YStack>
                )
              }}
              control={control}
              name="capacity"
            />
          </YStack>
        </>
      ) : null}
    </YStack>
  )
}

const EventFormActions = () => {
  const { isPending, isUploadImagePending, isUploadDeletePending, onSubmit, editMode, event, editEventScope } = useEventFormContext()

  return (
    <XStack gap="$medium">
      {editMode && event ? (
        <EventHandleActions
          event={event}
          scope={editEventScope}
          buttonProps={{
            theme: 'orange',
            size: 'sm',
            variant: 'soft',
          }}
        />
      ) : null}
      <YStack ml="auto">
        <VoxButton
          onPress={() => onSubmit()}
          size="md"
          variant="contained"
          theme="purple"
          loading={isPending || isUploadImagePending || isUploadDeletePending}
          iconLeft={Sparkle}
        >
          {[isUploadImagePending, isUploadDeletePending, isPending].every((x) => x === false) ? `${editMode ? 'Modifier' : 'Créer'} l'événement` : null}
          {isUploadImagePending ? "Envoi de l'image..." : null}
          {isUploadDeletePending ? "Suppression de l'image..." : null}
          {isPending ? `${editMode ? 'Modification' : 'Création'}...` : null}
        </VoxButton>
      </YStack>
    </XStack>
  )
}

const EventFormMain = () => {
  const { control } = useEventFormContext()

  return (
    <YStack gap="$medium">
      <Controller
        render={({ field }) => {
          return <FormFileImage placeholder="Ajouter une image de couverture" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
        }}
        control={control}
        name="image"
      />
      <VoxCard.Separator />
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
      <Controller
        render={({ field, fieldState }) => {
          return (
            <YStack minHeight={100} maxHeight={400}>
              <DescriptionInput
                error={fieldState.error?.message}
                label="Description"
                value={field.value!}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </YStack>
          )
        }}
        control={control}
        name="description"
      />
    </YStack>
  )
}

const BackButton = (props: { children?: React.ReactNode }) => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : '/(militant)/evenements'} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        {props.children ?? 'Annuler'}
      </VoxButton>
    </Link>
  )
}

export const EventFormDesktopScreen = () => {
  const { editMode, isUploadImagePending, isUploadDeletePending, isPending, ConfirmAlert } = useEventFormContext()
  const globalPending = isPending || isUploadImagePending || isUploadDeletePending

  return (
    <>
      {ConfirmAlert}
      <Layout.Main maxWidth={892}>
        <LayoutScrollView>
          <XStack paddingBottom="$medium" flex={1}>
            <BackButton />
          </XStack>
          <YStack gap="$medium">
            <VoxCard
              opacity={globalPending ? 0.5 : 1}
              style={{ pointerEvents: globalPending ? 'none' : 'auto' }}
              cursor={globalPending ? 'progress' : 'auto'}
            >
              <VoxCard.Content paddingBottom={0} justifyContent="center" alignItems="center">
                <VoxHeader.Title icon={Calendar}>{`${editMode ? 'Modifier' : 'Créer'} l'événement`}</VoxHeader.Title>
              </VoxCard.Content>
              {editMode ? null : (
                <VoxCard.Content paddingBottom={0} paddingTop={0}>
                  <MessageCard theme="gray" iconLeft={Info}>
                    Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
                  </MessageCard>
                </VoxCard.Content>
              )}
              <XStack alignItems="flex-start" paddingVertical="$medium">
                <YStack flex={1} flexShrink={1} gap="$medium" paddingHorizontal="$medium">
                  <EventFormMain />
                </YStack>
                <YStack maxWidth={400} paddingHorizontal="$medium" gap="$medium">
                  <EventFormAside />
                </YStack>
              </XStack>
              <VoxCard.Content pt={0}>
                <EventFormActions />
              </VoxCard.Content>
            </VoxCard>
            {globalPending ? (
              <YStack top={0} bottom={0} left={0} right={0} position="absolute" justifyContent="center" alignItems="center">
                <Spinner size="large" color="$blue6" />
              </YStack>
            ) : null}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
    </>
  )
}


