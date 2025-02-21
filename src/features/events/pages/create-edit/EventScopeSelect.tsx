import { memo } from 'react'
import Select from '@/components/base/Select/SelectV3'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Controller } from 'react-hook-form'
import { EventFormContext } from './context'

const _EventScopeSelect = (props: Pick<EventFormContext, 'control' | 'isAuthor' | 'editMode' | 'scopeOptions'>) => {
  return props.editMode ? null : (
    <>
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
              options={props.scopeOptions}
              onChange={field.onChange}
            />
          )
        }}
        control={props.control}
        name="scope"
      />
      <VoxCard.Separator />
    </>
  )
}

const EventScopeSelect = memo(_EventScopeSelect)

EventScopeSelect.displayName = 'EventScopeSelect'

export default EventScopeSelect
