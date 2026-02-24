import React, { memo, useCallback, useEffect, useState } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { XStack, YStack } from 'tamagui'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

import { useGetFilterCollection, useGetMessageCountRecipientsPartial, usePutMessageFilters } from '@/services/publications/hook'
import { RestAvailableSender, RestAvailableSendersResponse, RestGetMessageFiltersResponse, RestGetMessageResponse } from '@/services/publications/schema'

import SenderView from '../../SenderView'
import SelectFilters, { SelectedFiltersType } from './SelectFilters'
import { identifyQuickFilter } from './SelectFilters/helpers'
import { FilterValue } from './SelectFilters/type'

const temporaryMapFiltersForApi = (filters: SelectedFiltersType): SelectedFiltersType => {
  const mappedFilters = { ...filters }

  // Extraction uuid de zone si l'API PUT attend une string
  if (mappedFilters.zone && typeof mappedFilters.zone === 'object' && 'uuid' in mappedFilters.zone) {
    mappedFilters.zone = (mappedFilters.zone as { uuid: string }).uuid
  } else if (!mappedFilters.zone && mappedFilters.zones && Array.isArray(mappedFilters.zones) && mappedFilters.zones.length > 0) {
    const firstZone = mappedFilters.zones[0] as { uuid: string; type: string; code: string; name: string }
    mappedFilters.zone = firstZone.uuid
  }

  if (mappedFilters.committee != null) {
    if (typeof mappedFilters.committee === 'object' && 'uuid' in mappedFilters.committee) {
      mappedFilters.committee = (mappedFilters.committee as { uuid: string }).uuid
    }
  }

  // uuid est un identifiant métadonnée, pas un filtre — ne pas l'envoyer à l'API
  delete mappedFilters.uuid

  return mappedFilters
}

export const MetaDataForm = memo(
  (props: {
    control: Control<S.GlobalForm>
    availableSenders?: RestAvailableSendersResponse
    message?: RestGetMessageResponse
    displayToolbar?: boolean
    onMetaDataChange?: () => void
    messageFilters?: RestGetMessageFiltersResponse
    isMessageFiltersLoading?: boolean
    messageId?: string
    scope: string
    onSenderChange: (sender: RestAvailableSender) => void
    selectedSender: RestAvailableSender | null
  }) => {
    const { setValue } = useFormContext<S.GlobalForm>()
    const isMessageFiltersLoading = props.isMessageFiltersLoading ?? false

    const [filters, setFilters] = useState<SelectedFiltersType>(() => {
      if (props.messageFilters) {
        const { uuid: _uuid, ...filtersWithoutUuid } = props.messageFilters as SelectedFiltersType
        return filtersWithoutUuid as SelectedFiltersType
      }
      return { adherent_tags: 'adherent' }
    })
    const [quickFilterId, setQuickFilterId] = useState<string | null>(() => {
      if (props.messageFilters) {
        return identifyQuickFilter(props.messageFilters as SelectedFiltersType)
      }
      return 'adherent'
    })

    const { mutate: putMessageFilters, isPending: isPuttingMessageFilters } = usePutMessageFilters({ messageId: props.messageId, scope: props.scope })
    // Prefetch filter collection
    useGetFilterCollection({ scope: props.scope, enabled: !!props.scope })
    const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipientsPartial({
      messageId: props.messageId,
      scope: props.scope,
      enabled: !!props.messageId && !!props.scope,
    })

    useEffect(() => {
      if (!isFetchingMessageCountRecipients && messageCountRecipients) {
        const hasRecipients = (messageCountRecipients?.contacts ?? 0) > 0
        setValue('filters.hasRecipients', hasRecipients)
      }
    }, [messageCountRecipients, isFetchingMessageCountRecipients, setValue])

    const animatedProgress = useSharedValue(props.displayToolbar ? 1 : 0)
    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: animatedProgress.value === 1 ? 'auto' : animatedProgress.value * 56,
        opacity: animatedProgress.value,
        overflow: 'hidden',
        marginTop: 16,
        marginBottom: animatedProgress.value * 16,
      }
    })

    useEffect(() => {
      const targetProgress = props.displayToolbar ? 1 : 0

      animatedProgress.value = withTiming(targetProgress, {
        duration: 300,
        easing: Easing.ease,
      })
    }, [props.displayToolbar, animatedProgress])

    useEffect(() => {
      const rawFilters = (props.messageFilters as SelectedFiltersType) ?? { adherent_tags: 'adherent' }
      const { uuid: _uuid, ...filtersWithoutUuid } = rawFilters
      const newFilters = filtersWithoutUuid as SelectedFiltersType
      const correspondingQuickFilter = identifyQuickFilter(newFilters)
      setQuickFilterId(correspondingQuickFilter)
      setFilters(newFilters)
    }, [props.messageFilters])

    // Fonction debouncée pour l'envoi des filtres
    const debouncedPutMessageFilters = useDebouncedCallback(
      (mappedFilters: SelectedFiltersType) => {
        putMessageFilters(mappedFilters, {
          onError: () => {
            // En cas d'erreur, on revient aux filtres précédents
            setFilters(filters)
            setQuickFilterId(quickFilterId)
          },
        })
      },
      500, // 500ms de délai
      {
        leading: false,
        trailing: true,
      },
    )

    const handleUpdateFilter = useCallback(
      (updatedFilter: { [code: string]: FilterValue }) => {
        setFilters((oldFilters) => {
          const newFilters = { ...oldFilters, ...updatedFilter }

          const correspondingQuickFilter = identifyQuickFilter(newFilters)
          setQuickFilterId(correspondingQuickFilter)

          if (props.messageId && props.scope) {
            const mappedFilters = temporaryMapFiltersForApi(newFilters)

            if (correspondingQuickFilter) {
              putMessageFilters(mappedFilters, {
                onError: () => {
                  setFilters(oldFilters)
                  setQuickFilterId(quickFilterId)
                },
              })
            } else {
              debouncedPutMessageFilters(mappedFilters)
            }
          }

          return newFilters
        })
      },
      [props.messageId, props.scope, putMessageFilters, debouncedPutMessageFilters, quickFilterId],
    )

    return (
      <YStack
        backgroundColor="white"
        borderTopRightRadius="$medium"
        borderTopLeftRadius="$medium"
        paddingHorizontal="$medium"
        paddingTop="$large"
        paddingBottom={props.displayToolbar ? '$medium' : 0}
      >
        <SenderView
          sender={props.selectedSender}
          availableSenders={props.displayToolbar ? props.availableSenders : undefined}
          datetime="1 min."
          onSenderSelect={props.onSenderChange}
        />
        <Animated.View style={[animatedStyle, { justifyContent: 'center' }]}>
          <Controller
            control={props.control}
            name="filters.hasRecipients"
            render={({ field, fieldState }) => {
              return (
                <>
                  <SelectFilters
                    hasError={fieldState.error ? true : false}
                    selectedFilters={filters}
                    updateFilter={handleUpdateFilter}
                    selectedQuickFilterId={quickFilterId}
                    messageId={props.messageId}
                    scope={props.scope}
                    isLoading={isPuttingMessageFilters}
                    isMessageFiltersLoading={isMessageFiltersLoading}
                  />
                  {fieldState.error ? (
                    <XStack gap="$small" alignItems="center" pl="$medium" mt="$small">
                      <Text.XSM color="$orange5">{fieldState.error.message}</Text.XSM>
                    </XStack>
                  ) : (
                    <></>
                  )}
                </>
              )
            }}
          />
        </Animated.View>

        <Controller
          control={props.control}
          name="metaData.subject"
          render={({ field, fieldState }) => {
            return (
              <Animated.View style={{ height: 'auto' }}>
                {field.value && !props.displayToolbar ? (
                  <Text.LG semibold mb="$large">
                    {field.value}
                  </Text.LG>
                ) : (
                  <Input
                    placeholder="Titre de la publication"
                    label=""
                    color="gray"
                    defaultValue={field.value}
                    onBlur={() => {
                      field.onBlur()
                      props.onMetaDataChange?.()
                    }}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              </Animated.View>
            )
          }}
        />
      </YStack>
    )
  },
)
