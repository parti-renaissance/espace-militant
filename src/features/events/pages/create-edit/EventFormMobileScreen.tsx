import { KeyboardAvoidingView } from 'react-native'
import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import ButtonGroup from '@/components/base/ButtonGroup/ButtonGroup'
import { FormFileImage } from '@/components/base/FormFileUpload/FormFileImage'
import Input from '@/components/base/Input/Input'
import Select, { SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import DescriptionInput from '@/features/events/pages/create-edit/DescriptionInput'
import { EventFormData } from '@/features/events/pages/create-edit/schema'
import ScrollView from '@/features/profil/components/ScrollView'
import { Info, Sparkle, Users, Video, Webcam } from '@tamagui/lucide-icons'
import { Link, useNavigation } from 'expo-router'
import { Controller } from 'react-hook-form'
import { isWeb, Spinner, XStack, YStack } from 'tamagui'
import EventHandleActions from '../../components/EventHandleActions'
import { useEventFormContext } from './context'
import EventDatesField from './EventDatesField'
import EventScopeSelect from './EventScopeSelect'

export const EventFormMobileScreenSkeleton = (props?: { editMode?: boolean }) => {
  const navigation = useNavigation()

  return (
    <LayoutPage.MainSingleColumn>
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
            <VoxHeader.Title>{props?.editMode ? "Modifier l'événement" : 'Créer un événement'}</VoxHeader.Title>
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
    </LayoutPage.MainSingleColumn>
  )
}

export default function EventFormMobileScreen() {
  const {
    navigation,
    onSubmit,
    scopeOptions,
    control,
    visibilityOptions,
    catOptions,
    mode,
    setMode,
    isPending,
    isUploadImagePending,
    isUploadDeletePending,
    editMode,
    event,
    editEventScope,
    isAuthor,
    handleOnChangeBeginAt,
    handleOnChangeFinishAt,
    ConfirmAlert,
  } = useEventFormContext()

  const globalPending = isPending || isUploadImagePending || isUploadDeletePending

  return (
    <>
      {ConfirmAlert}
      <LayoutPage.MainSingleColumn
        opacity={globalPending ? 0.5 : 1}
        pointerEvents={globalPending ? 'none' : 'auto'}
        cursor={globalPending ? 'progress' : 'auto'}
      >
        <VoxHeader>
          <XStack alignItems="center" flex={1} width="100%">
            <XStack alignContent="flex-start">
              <Link href={navigation.canGoBack() ? '../' : '/evenements'} replace asChild={!isWeb}>
                {[isPending, isUploadImagePending, isUploadDeletePending].some(Boolean) ? null : (
                  <VoxButton size="lg" variant="text" theme="orange">
                    Annuler
                  </VoxButton>
                )}
              </Link>
            </XStack>
            <XStack flexGrow={1} justifyContent="center">
              <VoxHeader.Title>{`${editMode ? 'Modifier' : 'Créer'} l'événement`}</VoxHeader.Title>
            </XStack>
            <XStack>
              <VoxButton onPress={() => onSubmit()} size="md" variant="soft" theme="purple" pop loading={isPending} iconLeft={editMode ? undefined : Sparkle}>
                {[isUploadImagePending, isUploadDeletePending, isPending].every((x) => x === false) ? `${editMode ? 'Modifier' : 'Créer'}` : null}
                {isUploadImagePending ? 'image...' : null}
                {isUploadDeletePending ? 'image...' : null}
                {isPending ? `${editMode ? 'Modification' : 'Création'}...` : null}
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader>

        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              pb: '$xxxlarge',
              pt: 0,
            }}
          >
            <VoxCard>
              {editMode ? null : (
                <MessageCard theme="gray" iconLeft={Info}>
                  Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
                </MessageCard>
              )}
              <VoxCard.Content>
                <EventScopeSelect editMode={editMode} control={control} isAuthor={isAuthor} scopeOptions={scopeOptions} />
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
                <VoxCard.Separator />

                <EventDatesField control={control} handleOnChangeBeginAt={handleOnChangeBeginAt} handleOnChangeFinishAt={handleOnChangeFinishAt} />

                <VoxCard.Separator />
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
                          defaultValue={field.value ? `${field.value?.address} ${field.value?.city_name}` : undefined}
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
                <VoxCard.Separator />
                <YStack>
                  <Controller
                    render={({ field, fieldState }) => {
                      return (
                        <YStack minHeight={100} maxHeight={300}>
                          <DescriptionInput
                            error={fieldState.error?.message}
                            label="Description"
                            value={field.value}
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
                <XStack gap="$medium" alignContent="center" alignItems="center">
                  <Text.MD secondary>Optionnel</Text.MD>
                  <VoxCard.Separator />
                </XStack>
                <Controller
                  render={({ field }) => {
                    return (
                      <FormFileImage
                        emptyHeight={100}
                        placeholder="Ajouter une image de couverture"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )
                  }}
                  control={control}
                  name="image"
                />
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
                            onChange={field.onChange}
                            iconRight={<Users size={20} color="$gray4" />}
                          />
                        </YStack>
                      )
                    }}
                    control={control}
                    name="capacity"
                  />
                </YStack>
              </VoxCard.Content>
            </VoxCard>
            <VoxCard.Content>
              {editMode && event ? (
                <EventHandleActions
                  event={event}
                  scope={editEventScope}
                  buttonProps={{
                    theme: 'orange',
                    size: 'sm',
                    variant: 'text',
                  }}
                />
              ) : null}
            </VoxCard.Content>
          </ScrollView>
        </KeyboardAvoidingView>
        {globalPending ? (
          <YStack top={0} bottom={0} left={0} right={0} position="absolute" justifyContent="center" alignItems="center">
            <Spinner size="large" color="$blue6" />
          </YStack>
        ) : null}
      </LayoutPage.MainSingleColumn>
    </>
  )
}
