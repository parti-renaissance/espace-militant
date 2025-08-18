import React from 'react'
import { createStyledContext, styled, withStaticProperties, XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { Check } from '@tamagui/lucide-icons'

// Types pour les états
type SelectItemState = 'default' | 'selected' | 'parentSelected'

// Context pour les propriétés stylées
export const SelectItemContext = createStyledContext<{
  state: SelectItemState
}>({
  state: 'default',
})

// Container principal
const SelectItemContainer = styled(XStack, {
  context: SelectItemContext,
  paddingHorizontal: '$medium',
  paddingVertical: 12,
  gap: 16,
  flexDirection: 'row',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  animation: 'quickest',
  borderWidth: 2,
  borderColor: '$gray1',

  variants: {
    state: {
      default: {
        backgroundColor: '$gray1',
        hoverStyle: {
          backgroundColor: '$gray2',
        },
        pressStyle: {
          backgroundColor: '$gray3',
        },
      },
      selected: {
        backgroundColor: '$blue1',
        borderColor: '$blue9',
        hoverStyle: {
          backgroundColor: '$blue2',
        },
        pressStyle: {
          backgroundColor: '$blue3',
        },
      },
      parentSelected: {
        backgroundColor: '$blue1',
        borderColor: '$blue1',
        hoverStyle: {
          backgroundColor: '$blue2',
          borderColor: '$blue2',
        },
        pressStyle: {
          backgroundColor: '$blue3',
          borderColor: '$blue3',
        },
      },
    },
  } as const,
  defaultVariants: {
    state: 'default',
  },
})

// Label
const SelectItemLabel = styled(Text.MD, {
  context: SelectItemContext,
  flex: 1,
  variants: {
    state: {
      default: {
        color: '$textSecondary',
        fontWeight: '600',
      },
      selected: {
        color: '$textPrimary',
        fontWeight: '600',
      },
      parentSelected: {
        color: '$textSecondary',
        fontWeight: '600',
      },
    },
  } as const,
  defaultVariants: {
    state: 'default',
  },
})

// Compteur
const SelectItemCount = styled(Text.SM, {
  context: SelectItemContext,
  variants: {
    state: {
      default: {
        color: '$textSecondary',
      },
      selected: {
        color: '$blue9',
      },
      parentSelected: {
        color: '$textSecondary',
        opacity: 0.4,
      },
    },
  } as const,
  defaultVariants: {
    state: 'default',
  },
})

// Bouton radio/checkbox
const SelectItemButton = styled(XStack, {
  context: SelectItemContext,
  width: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    state: {
      default: {
        // Bouton non sélectionné
      },
      selected: {
        // Bouton sélectionné
      },
      parentSelected: {
        opacity: 0.4,
      },
    },
  } as const,
  defaultVariants: {
    state: 'default',
  },
})

// Props pour le composant
interface SelectItemProps {
  label: string
  count?: number
  state?: SelectItemState
  onPress?: () => void
  disabled?: boolean
  type?: 'radio' | 'checkbox'
}

// Composant principal
const SelectItemComponent = ({
  label,
  count,
  state = 'default',
  onPress,
  disabled = false,
  type = 'radio'
}: SelectItemProps) => {
  const currentState = disabled ? 'default' : state

  const renderButton = () => {
    if (type === 'radio') {
      return currentState === 'selected' || currentState === 'parentSelected' ? (
        <YStack h="$medium" w="$medium" borderWidth={3} borderColor="$blue9" bg="white" borderRadius="$medium" />
      ) : (
        <YStack h="$medium" w="$medium" borderWidth={2} borderColor="$gray6" borderRadius="$medium" />
      )
    } else {
      // Checkbox
      return currentState === 'selected' ? (
        <Check size={16} color="$blue9" />
      ) : (
        <XStack
          width={16}
          height={16}
          borderWidth={2}
          borderColor="$gray6"
          borderRadius={4}
        />
      )
    }
  }

  return (
    <SelectItemContext.Provider state={currentState}>
      <SelectItemContainer state={currentState} onPress={disabled ? undefined : onPress}>
        <XStack flex={1} gap={4}>
          <SelectItemLabel state={currentState}>
            {label}
          </SelectItemLabel>
          {count !== undefined && (
            <SelectItemCount state={currentState}>
              {count}
            </SelectItemCount>
          )}
        </XStack>
        <SelectItemButton state={currentState}>
          {renderButton()}
        </SelectItemButton>
      </SelectItemContainer>
    </SelectItemContext.Provider>
  )
}

// Export avec les propriétés statiques
export const SelectQuickFiltersItem = withStaticProperties(SelectItemComponent, {
  Container: SelectItemContainer,
  Label: SelectItemLabel,
  Count: SelectItemCount,
  Button: SelectItemButton,
})

export default SelectQuickFiltersItem 