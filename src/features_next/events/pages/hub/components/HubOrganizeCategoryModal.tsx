import { useCallback, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { Calendar, Info, X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import ActionTypeSelector from '@/features_next/actions/pages/create-edit/components/ActionTypeSelector'

import { ActionType, ActionTypeIcon, ReadableActionType } from '@/services/actions/schema'
import { useSuspenseGetCategories } from '@/services/events/hook'

type HubOrganizeCategoryModalProps = {
  open: boolean
  onClose: () => void
}

type OrganizeSelection = { itemType: 'action'; value: ActionType } | { itemType: 'event'; value: string }

const CREER_ACTION_HREF = '/actions/creer' as const satisfies Href
const CREER_EVENEMENT_HREF = '/evenements/creer' as const satisfies Href

const windowSize = Dimensions.get('window')

export function HubOrganizeCategoryModal({ open, onClose }: HubOrganizeCategoryModalProps) {
  const router = useRouter()
  const media = useMedia()
  const { data: categories } = useSuspenseGetCategories()
  const [selection, setSelection] = useState<OrganizeSelection | null>(null)

  const canContinue = selection != null

  const handleContinue = useCallback(() => {
    if (!selection) return
    onClose()
    if (selection.itemType === 'action') {
      router.push({ pathname: CREER_ACTION_HREF, params: { type: selection.value } })
      return
    }
    router.push({ pathname: CREER_EVENEMENT_HREF, params: { category: selection.value } })
  }, [onClose, router, selection])

  const mobileHeader = useMemo(
    () => (
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <VoxButton size="lg" variant="text" theme="orange" onPress={onClose}>
              Annuler
            </VoxButton>
          </XStack>
          <XStack flexGrow={1} justifyContent="center">
            <VoxHeader.Title>Organiser</VoxHeader.Title>
          </XStack>
          <XStack>
            <VoxButton size="md" theme="purple" disabled={!canContinue} onPress={handleContinue}>
              Suivant
            </VoxButton>
          </XStack>
        </XStack>
      </VoxHeader>
    ),
    [canContinue, handleContinue, onClose],
  )

  const desktopHeader = (
    <XStack width="100%" height={56} px="$medium" alignItems="center" justifyContent="center" borderBottomWidth={1} borderColor="$textOutline">
      <VoxHeader.Title>Organiser</VoxHeader.Title>
      <YStack position="absolute" right={0} onPress={onClose} padding="$large" cursor="pointer">
        <X size={24} color="$textPrimary" />
      </YStack>
    </XStack>
  )

  const maxHeight = media.sm ? windowSize.height - 56 : windowSize.height * 0.8
  const width = media.gtMd ? 892 : '100%'

  return (
    <ModalOrPageBase open={open} onClose={onClose} header={mobileHeader}>
      <SafeAreaView style={{ flex: 1 }} edges={media.gtMd ? [] : ['bottom']}>
        <YStack flex={1} width={width} maxHeight={media.gtMd ? maxHeight : undefined} bg="$white1">
          {media.gtMd ? desktopHeader : null}
          <MessageCard theme="gray" iconLeft={Info}>
            Créez vos propres événements et actions militantes pour mobiliser autour de vous et faire vivre le terrain.
          </MessageCard>
          <YStack flex={1} px="$medium" py="$large" gap="$medium">
            <Text.MD secondary semibold>
              Que souhaitez vous organiser ?
            </Text.MD>
            <YStack gap="$small">
              <XStack flexWrap="wrap" gap="$small">
                {Object.values(ActionType).map((type) => (
                  <ActionTypeSelector
                    key={type}
                    theme="green"
                    label={ReadableActionType[type]}
                    Icon={ActionTypeIcon[type]}
                    selected={selection?.itemType === 'action' && selection.value === type}
                    onPress={() => setSelection({ itemType: 'action', value: type })}
                  />
                ))}
              </XStack>
              <XStack flexWrap="wrap" gap="$small">
                {categories.map((category) => (
                  <ActionTypeSelector
                    key={category.slug}
                    theme="blue"
                    label={category.name}
                    Icon={Calendar}
                    selected={selection?.itemType === 'event' && selection.value === category.slug}
                    onPress={() => setSelection({ itemType: 'event', value: category.slug })}
                  />
                ))}
              </XStack>
            </YStack>
          </YStack>
          {media.gtMd ? (
            <XStack width="100%" height={56} px="$medium" alignItems="center" justifyContent="flex-end">
              <VoxButton size="md" theme="purple" disabled={!canContinue} onPress={handleContinue}>
                Suivant
              </VoxButton>
            </XStack>
          ) : null}
        </YStack>
      </SafeAreaView>
    </ModalOrPageBase>
  )
}
