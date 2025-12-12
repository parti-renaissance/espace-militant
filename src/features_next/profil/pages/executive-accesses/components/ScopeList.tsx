import { memo, useRef } from 'react'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'
import ScopeCard from './ScopeCard'

const MemoizedScopeCard = memo(ScopeCard)

const ChangeCommiteeList = () => {
  const { data } = useGetExecutiveScopes()
  const { mutate } = useMutateExecutiveScope()

  const { current: handlePress } = useRef((uuid: string) => () => {
    mutate({ scope: uuid })
  })

  if (!data || !data.list || !data.default) return null

  return data.list.map((item) => (
    <MemoizedScopeCard 
      key={item.code} 
      scope={item} 
      onPress={handlePress(item.code)} 
      selected={data.default.code === item.code} 
    />
  ))
}

export default function ChangeScope() {
  return <ChangeCommiteeList />
}
