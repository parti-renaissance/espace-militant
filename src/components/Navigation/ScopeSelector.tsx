import { useState, useRef } from 'react'
import { styled, ThemeableStack, XStack, YStack } from 'tamagui'
import { ChevronsUpDown } from '@tamagui/lucide-icons'
import { NavItemDropdown, type NavItemSubItem } from './NavItemDropdown'
import Text from '../base/Text'

export type Scope = {
  id: string
  name: string
  role?: string
}

type ScopeSelectorProps = {
  scopes: Scope[]
  selectedScope?: Scope
  onScopeSelect?: (scope: Scope) => void
}

const SelectorContainer = styled(XStack, {
  p: 12,
  gap: '$small',
  cursor: 'pointer',
  borderRadius: 8,
  hoverStyle: { backgroundColor: '$purple1' },
  pressStyle: { backgroundColor: '$purple2' },
})

const ScopeItemFrame = styled(ThemeableStack, {
  padding: 8,
  gap: 8,
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'space-between',
  borderRadius: 4,
  cursor: 'pointer',
  marginBottom: 4,
  maxWidth: 380,
  hoverStyle: {
    backgroundColor: '$gray1',
  },
  pressStyle: {
    backgroundColor: '$gray2',
  },
  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$purple5',
    outlineStyle: 'solid',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$purple1',
        hoverStyle: {
          backgroundColor: '$purple2',
        },
        pressStyle: {
          backgroundColor: '$purple3',
        },
        focusStyle: {
          backgroundColor: '$purple2',
          outlineWidth: 2,
          outlineColor: '$purple6',
          outlineStyle: 'solid',
        },
      },
    },
    last: {
      true: {
        marginBottom: 0,
      },
    },
  } as const,
})

type ScopeItemProps = {
  scope: Scope
  selected: boolean
  onPress: () => void
  last: boolean
}

const ScopeItem = ({ scope, selected, onPress, last }: ScopeItemProps) => {
  return (
    <ScopeItemFrame
      selected={selected}
      onPress={onPress}
      last={last}
    >
      <XStack flex={1} alignItems="center" gap={8} justifyContent="space-between">
        <YStack flex={1} gap={4}>
          <Text fontSize={12} semibold numberOfLines={2}>
            {scope.name}
          </Text>
          {scope.role && (
            <Text fontSize={11} primary numberOfLines={1}>
              {scope.role}
            </Text>
          )}
        </YStack>
      </XStack>
    </ScopeItemFrame>
  )
}

export const ScopeSelector = ({
  scopes,
  selectedScope,
  onScopeSelect,
}: ScopeSelectorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  const subItems: NavItemSubItem[] = scopes.map((scope, index) => ({
    id: scope.id,
    text: scope.name,
    subtitle: scope.role,
    selected: selectedScope?.id === scope.id,
    customContent: (
      <ScopeItem
        scope={scope}
        selected={selectedScope?.id === scope.id}
        onPress={() => {
          onScopeSelect?.(scope)
        }}
        last={scopes.length - 1 === index}
      />
    ),
    onPress: () => {
      onScopeSelect?.(scope)
    },
  }))

  const displayScope = selectedScope || scopes[0]

  return (
    <>
      <SelectorContainer
        ref={(node) => {
          triggerRef.current = node as HTMLElement | null
        }}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <YStack flexShrink={1} gap={4}>
          <Text.MD semibold color="$purple6" numberOfLines={1}>
            {displayScope.name}
          </Text.MD>
          {displayScope.role && (
            <Text.SM color="$purple6" numberOfLines={1}>
              {displayScope.role}
            </Text.SM>
          )}
        </YStack>
        <YStack flexShrink={0}>
          <ChevronsUpDown size={16} color="$purple5" />
        </YStack>
      </SelectorContainer>
      <NavItemDropdown
        open={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        triggerRef={triggerRef}
        verticalPosition="bottom"
        subItems={subItems}
        helpText="Changer de rôle permet d'accéder aux contenus qui lui sont associés."
      />
    </>
  )
}

