import { useCallback, useEffect, useMemo, useState } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useMedia, XStack, YStack } from 'tamagui'
import { ScopeList } from './components/ScopeList'
import { xor } from 'lodash'

export default function ScopesSelector() {
  const { data: scopes, isLoading: isLoadingScopes } = useGetExecutiveScopes()
  const { mutate: mutateScope } = useMutateExecutiveScope()
  const [selectedScope, setSelectedScope] = useState(scopes?.default?.code)
  const scopesCodeList = useMemo(() => scopes?.list?.map((scope) => scope.code) ?? [], [scopes])
  const [shouldOpen, setShouldOpen] = useState(false)

  // Mettre à jour shouldOpen seulement quand les données sont chargées
  useEffect(() => {
    if (!isLoadingScopes && scopes) {
      const shouldOpenModal = 
        !scopes.lastAvailableScopes || 
        scopes.lastAvailableScopes.length === 0 || 
        xor(scopesCodeList, scopes.lastAvailableScopes).length > 0
      setShouldOpen(shouldOpenModal)
    }
  }, [isLoadingScopes, scopes, scopesCodeList])

  const media = useMedia()

  const handleSubmit = useCallback(() => {
    mutateScope({
      scope: selectedScope,
      lastAvailableScopes: scopesCodeList,
    })
    setShouldOpen(false)
  }, [mutateScope, selectedScope, scopesCodeList])

  const handleChange = useCallback((scope: string) => {
    setSelectedScope(scope)
  }, [])

  if (!scopes || !scopes.list || scopes.list.length < 2) {
    return null
  }

  return (
    <ModalOrBottomSheet open={shouldOpen} onClose={() => setShouldOpen(false)}>
      <YStack
        width={media.gtSm ? 390 : undefined}
        gap="$medium"
      >
        <YStack flex={1}>
          <YStack p="$medium" borderBottomWidth={1} borderBottomColor="$textOutline">
            <Text.LG multiline semibold>
              Vous avez plusieurs rôles Cadre
            </Text.LG>
            <Text.SM>Choisissez en un principal.</Text.SM>
          </YStack>
          <YStack>
            <ScopeList scopes={scopes.list} onChange={handleChange} value={selectedScope} />
          </YStack>
        </YStack>
        <YStack p="$medium" pt={0} alignItems="center" gap="$medium">
          <Text.SM>Vos fonctonnalités de cadre sont indiquées en violet dans votre espace Militant.</Text.SM>
          <XStack>
            <VoxButton theme="purple" iconRight={ArrowRight} onPress={handleSubmit}>
              Continuer
            </VoxButton>
          </XStack>
        </YStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}
