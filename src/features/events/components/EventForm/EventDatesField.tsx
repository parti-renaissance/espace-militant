import { memo } from 'react'
import { FormFrame } from '@/components/base/FormFrames'
import Select from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import DatePickerField from '@/components/DatePickerV2'
import { getTimezoneOffset } from 'date-fns-tz'
import { Controller } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'
import { listTimeZones } from 'timezone-support'
import { EventFormContext } from './context'

function getTimezoneOffsetLabel(timeZone: string) {
  const offset = getTimezoneOffset(timeZone)

  return `UTC ${offset < 0 ? '' : '+'}${offset / 1000 / 60 / 60}h`
}

const timezones = listTimeZones().map((timeZone) => ({
  value: timeZone,
  label: `${timeZone} (${getTimezoneOffsetLabel(timeZone)})`,
}))

const DatesField = (props: Pick<EventFormContext, 'control' | 'handleOnChangeBeginAt' | 'handleOnChangeFinishAt'>) => {
  return (
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
                  <DatePickerField
                    error={fieldState.error?.message}
                    type="date"
                    value={field.value}
                    onChange={props.handleOnChangeBeginAt(field.onChange)}
                    onBlur={field.onBlur}
                  />
                  <DatePickerField
                    error={fieldState.error?.message}
                    type="time"
                    value={field.value}
                    onChange={props.handleOnChangeBeginAt(field.onChange)}
                    onBlur={field.onBlur}
                  />
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
        control={props.control}
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
                  <DatePickerField
                    error={fieldState.error?.message}
                    type="date"
                    value={field.value}
                    onChange={props.handleOnChangeFinishAt(field.onChange)}
                    onBlur={field.onBlur}
                  />
                  <DatePickerField
                    error={fieldState.error?.message}
                    type="time"
                    value={field.value}
                    onChange={props.handleOnChangeFinishAt(field.onChange)}
                    onBlur={field.onBlur}
                  />
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
        control={props.control}
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
        control={props.control}
        name="time_zone"
      />
    </FormFrame>
  )
}

const MemoDatesField = memo(DatesField)

MemoDatesField.displayName = 'EventDatesFields'

export default MemoDatesField
