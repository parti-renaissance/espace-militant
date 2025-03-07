import { memo, useMemo } from 'react'
import Select, { SelectOption, SF } from '@/components/base/Select/SelectV3'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { getFormatedScope as getFormatedScopeData } from '@/features/ScopesSelector/utils'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { Sparkle } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'

export const getFormatedScope = (scope: RestUserScopesResponse[number]): SelectOption<string> => {
  const { name, description } = getFormatedScopeData(scope)
  return {
    value: scope.code,
    label: [
      <SF.Text key="name" semibold>
        {name}
      </SF.Text>,
      ' ',
      <SF.Text key="description">{description}</SF.Text>,
    ],
    theme: 'purple',
    icon: Sparkle,
  }
}

const _MessageScopeSelect = (props: { control: Control<S.GlobalForm> }) => {
  const scopes = useGetExecutiveScopes()
  const scopeOptions = useMemo(() => scopes.data.list.filter((x) => x.features.includes('messages_vox')).map(getFormatedScope), [scopes.data.list])
  return (
    <Controller
      render={({ field, fieldState }) => {
        return (
          <Select
            error={fieldState.error?.message}
            size="lg"
            theme="purple"
            matchTextWithTheme
            label="En tant que"
            value={field.value}
            options={scopeOptions}
            onChange={field.onChange}
          />
        )
      }}
      control={props.control}
      name="metaData.scope"
    />
  )
}

const MessageScopeSelect = memo(_MessageScopeSelect)

MessageScopeSelect.displayName = 'MessageScopeSelect'

export default MessageScopeSelect
