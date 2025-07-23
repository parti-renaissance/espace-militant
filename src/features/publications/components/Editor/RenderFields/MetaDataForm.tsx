import React, { memo, useMemo, useState, useEffect } from 'react'
import { Control, Controller } from 'react-hook-form'
import { YStack } from 'tamagui'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import SenderView from '../../SenderView'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse, RestGetMessageFiltersResponse, RestGetMessageResponse } from '@/services/publications/schema'
import Animated from 'react-native-reanimated'
import SelectFilters, { SelectedFiltersType } from './SelectFilters'
import { usePutMessageFilters } from '@/services/publications/hook'
import { identifyQuickFilter } from './SelectFilters/helpers'

const temporaryMapFiltersForApi = (filters: SelectedFiltersType): SelectedFiltersType => {
  const { committee, ...filtersWithoutCommittee } = filters

  const mappedFilters = { ...filtersWithoutCommittee }

  if (mappedFilters.zone && typeof mappedFilters.zone === 'object' && 'uuid' in mappedFilters.zone) {
    mappedFilters.zone = (mappedFilters.zone as { uuid: string }).uuid
  }
  else if (!mappedFilters.zone && mappedFilters.zones && Array.isArray(mappedFilters.zones) && mappedFilters.zones.length > 0) {
    const firstZone = mappedFilters.zones[0] as { uuid: string; type: string; code: string; name: string }
    mappedFilters.zone = firstZone.uuid
  }
  return mappedFilters
}

export const MetaDataForm = memo((props: {
  control: Control<S.GlobalForm>,
  availableSenders?: RestAvailableSendersResponse,
  message?: RestGetMessageResponse,
  displayToolbar?: boolean,
  onMetaDataChange?: () => void,
  messageFilters?: RestGetMessageFiltersResponse,
  messageId?: string,
  scope: string
}) => {
  const senderToDisplay = useMemo(() => {
    return props.message?.sender || (props.availableSenders && props.availableSenders.length > 0 ? props.availableSenders[0] : null)
  }, [props.message?.sender, props.availableSenders])

  const [filters, setFilters] = useState<SelectedFiltersType>(props.messageFilters as SelectedFiltersType ?? { 'adherent_tags': 'adherent' })
  const [quickFilterId, setQuickFilterId] = useState<string | null>('adherents')

  const { mutate: putMessageFilters } = usePutMessageFilters({ messageId: props.messageId, scope: props.scope })

  useEffect(() => {
    const newFilters = props.messageFilters as SelectedFiltersType ?? { 'adherent_tags': 'adherent' }
    const correspondingQuickFilter = identifyQuickFilter(newFilters)
    setQuickFilterId(correspondingQuickFilter)
    setFilters(newFilters)
  }, [props.messageFilters])


  const handleFiltersChange = ({ newFilters, newQuickFilterId }: { newFilters: SelectedFiltersType, newQuickFilterId: string | null }) => {
    const mergedFilters = { ...filters, ...newFilters }

    const mappedFilters = temporaryMapFiltersForApi(mergedFilters)

    let hasAnyChange = false
    const initialFilters = props.messageFilters as SelectedFiltersType ?? { 'adherent_tags': 'adherent' }

    Object.keys(mergedFilters).forEach(key => {
      const newValue = mergedFilters[key]
      const initialValue = initialFilters[key]
      if (newValue !== initialValue) {
        hasAnyChange = true
      }
    })

    if (hasAnyChange && props.messageId && props.scope) {
      setFilters(mergedFilters)
      if (newQuickFilterId) { setQuickFilterId(newQuickFilterId) }
      putMessageFilters(mappedFilters, {
        onError: (error) => {
          setFilters(filters)
          setQuickFilterId(quickFilterId)
        },
      })
    }
  }

  return (
    <YStack gap="$medium" backgroundColor="white" borderTopRightRadius="$medium" borderTopLeftRadius="$medium" paddingHorizontal="$medium" paddingTop="$large" paddingBottom={props.displayToolbar ? '$medium' : 0}>
      <SenderView sender={senderToDisplay} datetime="1 min." />
      <SelectFilters
        selectedFilters={filters}
        onFiltersChange={handleFiltersChange}
        selectedQuickFilterId={quickFilterId}
        messageId={props.messageId}
        scope={props.scope}
      />
      <Controller
        control={props.control}
        name="metaData.subject"
        render={({ field, fieldState }) => {
          return (
            <Animated.View style={{ height: 'auto' }}>
              {field.value && !props.displayToolbar ? (
                <Text.LG semibold mb="$large">{field.value}</Text.LG>
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
})
