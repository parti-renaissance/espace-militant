import React, { memo, useCallback, useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { XStack, YStack } from 'tamagui'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

import { useGetFilterCollection, useGetMessageCountRecipientsPartial } from '@/services/publications/hook'
import { useEditorStore } from '@/features_next/publications/components/Editor/store/editorStore'

import SenderView from '../../SenderView'
import { useAutoSaveFilters } from '../hooks/useAutoSaveFilters'
import SelectFilters from './SelectFilters'
import { deserializeScopeTargets } from './SelectFilters/AdvancedFilters/ScopeTarget'
import { FilterValue } from './SelectFilters/type'
import type { SelectedFiltersType } from './SelectFilters/type'

export const MetaDataForm = memo(
  (props: { onMetaDataChange?: () => void }) => {
    const { control, setValue } = useFormContext<S.GlobalForm>()
    const messageId = useEditorStore((s) => s.messageId)
    const scope = useEditorStore((s) => s.scope)
    const displayToolbar = useEditorStore((s) => s.displayToolbar)
    const availableSenders = useEditorStore((s) => s.availableSenders)
    const messageFilters = useEditorStore((s) => s.messageFilters)
    const selectedSender = useEditorStore((s) => s.selectedSender)
    const onSenderChange = useEditorStore((s) => s.onSenderChange)

    const selectedFilters = (useWatch({ control, name: 'filters.data' }) as SelectedFiltersType | undefined) ?? {
      adherent_tags: 'adherent',
    }

    const { isPending: isPuttingMessageFilters } = useAutoSaveFilters({ enabled: !!messageId && !!scope })
    useGetFilterCollection({ scope, enabled: !!scope })
    const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipientsPartial({
      messageId,
      scope,
      enabled: !!messageId && !!scope,
    })

    useEffect(() => {
      if (messageFilters) {
        const { uuid: _uuid, ...filtersWithoutUuid } = messageFilters as SelectedFiltersType & { uuid?: string }
        const normalized: SelectedFiltersType = { ...filtersWithoutUuid }
        if ('scope_targets' in normalized) {
          const grouped = deserializeScopeTargets(normalized.scope_targets)
          normalized.scope_targets = grouped.length > 0 ? grouped : null
        }
        setValue('filters.data', normalized, { shouldDirty: false, shouldTouch: false })
      } else if (!messageId) {
        // Nouvelle publication : réinitialiser les filtres par défaut (évite de garder ceux de la publication précédente)
        setValue('filters.data', { adherent_tags: 'adherent' }, { shouldDirty: false, shouldTouch: false })
      }
    }, [messageId, messageFilters, setValue])

    useEffect(() => {
      if (!isFetchingMessageCountRecipients && messageCountRecipients) {
        const hasRecipients = (messageCountRecipients?.contacts ?? 0) > 0
        setValue('filters.hasRecipients', hasRecipients)
      }
    }, [messageCountRecipients, isFetchingMessageCountRecipients, setValue])

    const animatedProgress = useSharedValue(displayToolbar ? 1 : 0)
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
      const targetProgress = displayToolbar ? 1 : 0

      animatedProgress.value = withTiming(targetProgress, {
        duration: 300,
        easing: Easing.ease,
      })
    }, [displayToolbar, animatedProgress])

    const handleUpdateFilter = useCallback(
      (updatedFilter: { [code: string]: FilterValue }) => {
        setValue(
          'filters.data',
          { ...selectedFilters, ...updatedFilter },
          { shouldDirty: true, shouldTouch: true },
        )
      },
      [selectedFilters, setValue],
    )

    return (
      <YStack
        backgroundColor="white"
        borderTopRightRadius="$medium"
        borderTopLeftRadius="$medium"
        paddingHorizontal="$medium"
        paddingTop="$large"
        paddingBottom={displayToolbar ? '$medium' : 0}
      >
        <SenderView
          sender={selectedSender}
          availableSenders={displayToolbar ? availableSenders : undefined}
          datetime="1 min."
          onSenderSelect={onSenderChange ?? (() => {})}
        />
        <Animated.View style={[animatedStyle, { justifyContent: 'center' }]}>
          <Controller
            control={control}
            name="filters.hasRecipients"
            render={({ field, fieldState }) => {
              return (
                <>
                  <SelectFilters
                    hasError={fieldState.error ? true : false}
                    selectedFilters={selectedFilters}
                    updateFilter={handleUpdateFilter}
                    isLoading={isPuttingMessageFilters}
                    messageCountRecipients={messageCountRecipients}
                    isFetchingMessageCountRecipients={isFetchingMessageCountRecipients}
                  />
                  {fieldState.error ? (
                    <XStack gap="$small" alignItems="center" pl="$medium" mt="$small">
                      <Text.XSM color="$orange5">{fieldState.error.message}</Text.XSM>
                    </XStack>
                  ) : null}
                </>
              )
            }}
          />
        </Animated.View>

        <Controller
          control={control}
          name="metaData.subject"
          render={({ field, fieldState }) => {
            return (
              <Animated.View style={{ height: 'auto' }}>
                {field.value && !displayToolbar ? (
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
