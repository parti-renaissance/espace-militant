import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard, { VoxCardFrame } from '@/components/VoxCard/VoxCard'
import type { RestUserScopesResponse } from '@/services/profile/schema'
import { FEATURES_STRUCT, FEATURES_TRANSLATION, GROUPS_TRANSLATION, HIDDEN_FEATURES } from '@/utils/Scopes'
import { Check, X } from '@tamagui/lucide-icons'
import { isWeb, styled, XStack, YStack } from 'tamagui'

export const listAvailableFeatureByGroup = (scope: RestUserScopesResponse[number]) => {
  const flattenGroups = Object.values(FEATURES_STRUCT).flat()
  // @ts-expect-error x come from backend and maybe unknown
  const others = scope.features.filter((x: string) => !flattenGroups.includes(x) && !HIDDEN_FEATURES.includes(x))

  const groups = others.length > 0 ? { ...FEATURES_STRUCT, others } : FEATURES_STRUCT
  return (
    Object.entries(groups)
      .map(([key, group]) => ({
        group: GROUPS_TRANSLATION[key as keyof typeof GROUPS_TRANSLATION] ?? 'Autres',
        access: group.some((x: string) => scope.features.includes(x)),
        features: group
          // à desactiver si on veut afficher les features désactivées
          .filter((x: string) => scope.features.includes(x))
          .map((x: string) => ({
            // à activer si on veut afficher les features désactivées
            // access: scope.features.includes(x),
            access: true,
            name: FEATURES_TRANSLATION[x] ?? x,
          })),
      }))
      // à desactiver si on veut afficher les features désactivées
      .filter((x) => x.features.length > 0)
  )
}

const ScopeCardFrame = styled(VoxCardFrame, {
  tag: 'button',
  backgroundColor: '$purple/8',
  animation: 'quick',
  cursor: 'pointer',
  borderWidth: 2,
  borderColor: '$textOutline',
  overflow: 'hidden',

  pressStyle: {
    borderColor: '$purple5',
    backgroundColor: '$purple1',
  },
  hoverStyle: {
    borderColor: '$purple3',
    backgroundColor: '$purple/16',
  },
  focusStyle: {
    borderColor: '$purple5',
    backgroundColor: '$purple1',
  },

  variants: {
    selected: {
      true: {
        borderColor: '$purple5',
        backgroundColor: '$purple1',
        cursor: 'default',
        hoverStyle: {
          borderColor: '$purple5',
          backgroundColor: '$purple1',
        },
      },
    },
  },
})

type ScopeCardProps = {
  scope: RestUserScopesResponse[number]
  selected: boolean
  onPress?: () => void
  loading?: boolean
}

export default function ScopeCard({ scope, selected, onPress, loading }: ScopeCardProps) {
  const [head, ...data] = listAvailableFeatureByGroup(scope)
  const chunks = data.reduce(
    (acc, curr, i) => {
      if (i % 2 === 0) {
        acc.push([curr])
      } else {
        acc[acc.length - 1].push(curr)
      }
      return acc
    },
    [[head]] as Array<Array<{ group: string; access: boolean; features: { access: boolean; name: string }[] }>>,
  )

  return (
    <ScopeCardFrame inside selected={selected} onPress={selected ? undefined : onPress} focusable>
      <VoxCard.Content pb={0} justifyContent="center">
        <XStack justifyContent="space-between" alignItems="center" gap="$medium">
          <YStack flexShrink={1} gap={8}>
            <Text.MD semibold color="$purple6">
              {scope.name}
            </Text.MD>
            <Text.SM color="$purple5">{scope.zones.map(({ name, code }) => `${name} (${code})`).join(', ')}</Text.SM>
          </YStack>
          <YStack>
            {selected ? (
              <VoxButton variant="text" theme="purple">
                Sélectionné
              </VoxButton>
            ) : (
              <VoxButton variant="outlined" bg="white" theme="purple" onPress={isWeb ? undefined : onPress} loading={loading}>
                Choisir
              </VoxButton>
            )}
          </YStack>
        </XStack>
      </VoxCard.Content>
      <VoxCard.Content backgroundColor="white" paddingVertical={0}>
        <YStack gap="$large" pt="$large">
          {chunks.map((group, i) => (
            <XStack key={i} gap="$large" borderBottomWidth={chunks.length - 1 === i ? 0 : 1} pb="$large" borderColor="$textOutline">
              {group.map(({ group, features, access: groupAccess }, y) => (
                <YStack
                  key={group}
                  flex={1}
                  flexBasis={0}
                  gap="$medium"
                  borderRightWidth={i > 0 && y > 0 ? 0 : 1}
                  borderColor="$textOutline"
                  opacity={groupAccess ? 1 : 0.4}
                >
                  {group.length > 0 ? <Text.MD semibold>{group}</Text.MD> : null}
                  <YStack gap="$small" flexDirection={i > 0 ? 'column' : 'row'} flexWrap="wrap">
                    {features.map(({ access, name }) => (
                      <XStack gap="$xsmall" key={name}>
                        {access ? <Check size={16} color="$purple9" /> : <X size={16} color="$textSecondary" />}
                        <Text.SM secondary>{name}</Text.SM>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              ))}
            </XStack>
          ))}
        </YStack>
      </VoxCard.Content>
    </ScopeCardFrame>
  )
}
