import { useCallback, useMemo, useState } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'
import { ArrowRight } from '@tamagui/lucide-icons'
import { Image, useMedia, XStack, YStack } from 'tamagui'
import { ScopeItem } from './components/ScopeItem'
import { ScopeList } from './components/ScopeList'
import { getFormatedScope } from './utils'
import { xor } from 'lodash'

const tutoNavMobileImg = require('@/features/ScopesSelector/assets/mobile-nav-tuto.png')
const tutoNavDesktopImg = require('@/features/ScopesSelector/assets/sidebar-tuto.png')

export default function ScopesSelector() {
  const { data: scopes } = useGetExecutiveScopes()
  const { mutate: mutateScope } = useMutateExecutiveScope()
  const [selectedScope, setSelectedScope] = useState(scopes?.default?.code)
  const [hasSelectedScope, setHasSelectedScope] = useState(false)
  const scopesCodeList = useMemo(() => scopes?.list?.map((scope) => scope.code) ?? [], [scopes])
  const [shouldOpen, setShouldOpen] = useState(
    !scopes?.lastAvailableScopes || scopes.lastAvailableScopes.length === 0 || xor(scopesCodeList, scopes.lastAvailableScopes).length > 0,
  )

  const media = useMedia()

  if (!scopes || !scopes.list || scopes.list.length === 0) {
    return null
  }

  const handleSubmit = (confirm?: boolean) => () => {
    mutateScope({
      scope: selectedScope,
      lastAvailableScopes: scopesCodeList,
    })
    setHasSelectedScope(true)
    if (confirm) {
      setShouldOpen(false)
    }
  }

  const handleChange = (scope: string) => {
    setSelectedScope(scope)
  }

  const MultiScopeStep = useCallback(() => {
    return (
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
            <ScopeList scopes={scopes?.list ?? []} onChange={handleChange} value={selectedScope} />
          </YStack>
        </YStack>
        <YStack p="$medium" pt={0} alignItems="center" gap="$medium">
          <Text.SM>Vos fonctonnalités de cadre sont indiquées en violet dans votre espace Militant.</Text.SM>
          <XStack>
            <VoxButton theme="purple" iconRight={ArrowRight} onPress={handleSubmit()}>
              Continuer
            </VoxButton>
          </XStack>
        </YStack>
      </YStack>
    )
  }, [scopes, selectedScope, handleChange, handleSubmit])

  const HeaderOneScope = () => {
    const _scope = scopes?.list?.find((x) => x.code === selectedScope)
    if (!_scope) return null
    const { name, description } = getFormatedScope(_scope)
    return (
      <YStack backgroundColor="$purple1" paddingVertical="$xxlarge" paddingHorizontal="$large">
        <ScopeItem title={name} pop description={description ?? ''} showButton={false} selected />
      </YStack>
    )
  }

  const OneScopeStep = () => {
    return (
      <YStack
        width={media.gtSm ? 390 : undefined}
        gap="$medium"
      >
        <HeaderOneScope />
        <YStack gap="$medium" paddingHorizontal="$medium">
          <Text.LG semibold>Vous avez un rôle Cadre</Text.LG>
          <Text.SM multiline>Il vous ouvre des fonctionnalités Cadre qui sont indiquées en violet dans votre espace Militant.</Text.SM>
          <Text.SM multiline>Et l’accès à l’espace Cadre depuis le volet gauche de la page d’accueil.</Text.SM>
          <YStack p="$medium" pt={0} alignItems="center" gap="$medium">
            <Image source={media.gtSm ? tutoNavDesktopImg : tutoNavMobileImg} />
            <XStack paddingVertical="$medium">
              <VoxButton theme="purple" iconRight={ArrowRight} onPress={handleSubmit(true)}>
                C'est noté !
              </VoxButton>
            </XStack>
          </YStack>
        </YStack>
      </YStack>
    )
  }

  const FirstStep = () => (scopesCodeList.length > 1 ? <MultiScopeStep /> : <OneScopeStep />)

  const SecondStep = () => {
    return (
      <YStack
        width={media.gtSm ? 390 : undefined}
        gap="$medium"
      >
        <HeaderOneScope />
        <YStack gap="$medium" paddingHorizontal="$medium" alignItems="center">
          <Text.LG semibold>C’est maintenant votre rôle principal sur cet appareil</Text.LG>
          <Text.SM multiline>Il vous ouvre des fonctionnalités Cadre qui sont indiquées en violet dans votre espace Militant.</Text.SM>
          <Text.SM multiline>Et l’accès à l’espace Cadre depuis le volet gauche de la page d’accueil.</Text.SM>
          <YStack pt={0} gap="$medium" alignItems="center">
            <Image p="$medium" source={media.gtSm ? tutoNavDesktopImg : tutoNavMobileImg} />
            <Text.SM>Vous pouvez changer de rôle principal à tout moment depuis votre profil.</Text.SM>
            <YStack width="100%" justifyContent="center" alignItems="center" mb="$large">
              <XStack paddingVertical="$medium">
                <VoxButton theme="purple" iconRight={ArrowRight} onPress={() => setShouldOpen(false)}>
                  C'est noté !
                </VoxButton>
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    )
  }

  return (
    <ModalOrBottomSheet open={shouldOpen} onClose={() => setShouldOpen(false)} allowDrag={hasSelectedScope}>
      {!hasSelectedScope ? <FirstStep /> : <SecondStep />}
    </ModalOrBottomSheet>
  )
}
