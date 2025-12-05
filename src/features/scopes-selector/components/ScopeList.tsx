import { ScopeItem } from '@/features/scopes-selector/components/ScopeItem'
import { RestUserScopesResponse } from '@/services/profile/schema'
import { styled, XStack } from 'tamagui'
import { getFormatedScope } from '../utils'

type Props = {
  scopes: RestUserScopesResponse
  onChange: (scope: string) => void
  value?: string
}

const ScopeListFrame = styled(XStack, {
  flex: 1,
  flexWrap: 'wrap',
  alignItems: 'flex-start', // if you want to fill rows left to right
})

export const ScopeList = ({ scopes, value, onChange }: Props) => {
  return (
    <ScopeListFrame>
      {scopes.map((scope, i) => {
        const { name, description } = getFormatedScope(scope)
        return (
          <XStack key={scope.code} width="50%" height={216} borderColor="$textOutline" borderRightWidth={i % 2 === 0 ? 1 : 0} borderBottomWidth={1}>
            <ScopeItem key={scope.code} title={name} description={description} selected={value === scope.code} onPress={() => onChange(scope.code)} />
          </XStack>
        )
      })}
    </ScopeListFrame>
  )
}
