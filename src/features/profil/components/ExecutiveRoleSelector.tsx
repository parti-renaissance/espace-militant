import SelectV3 from '@/components/base/Select/SelectV3'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'
import { Sparkle } from '@tamagui/lucide-icons'

export default function ExecutiveRoleSelector() {
  const { data: scopes } = useGetExecutiveScopes()
  const { mutate: mutateScope } = useMutateExecutiveScope()

  const formatedScopes = scopes?.list?.map((scope) => ({
    label: `${scope.name}`,
    subLabel: scope.zones.map(({ name, code }) => `${name} (${code})`).join(', '),
    value: scope.code,
    icon: Sparkle,
  }))

  const handleChange = (value: string) => {
    mutateScope({ scope: value })
  }

  if (!scopes || !scopes.list || scopes.list.length === 0) return null

  return (
    <VoxCard inside>
      <VoxCard.Content>
        <SelectV3
          matchTextWithTheme
          theme="purple"
          label="Changer de rôle actif"
          color="purple"
          size="xl"
          options={formatedScopes ?? []}
          multiline
          onChange={handleChange}
          value={scopes.default?.code ?? ''}
        />
      </VoxCard.Content>
    </VoxCard>
  )
}
