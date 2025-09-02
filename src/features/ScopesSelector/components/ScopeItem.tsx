import { Sparkle } from '@/assets/icons/cadre/Sparkle'
import { SparklePlain } from '@/assets/icons/cadre/SparklePlain'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Check, RefreshCcw } from '@tamagui/lucide-icons'
import { Circle, createStyledContext, styled, withStaticProperties, XStack, YStack } from 'tamagui'

type Props = {
  title: string
  description: string
  onPress?: () => void
  selected: boolean
  pop?: boolean
  showButton?: boolean
}

const propsContext = createStyledContext({
  selected: false,
  pop: false,
  interactive: true,
})

const ScopeItemContainer = styled(YStack, {
  context: propsContext,
  paddingVertical: '$large',
  backgroundColor: '$white1',
  flex: 1,
  animation: '100ms',
  group: true,
  gap: '$medium',

  variants: {
    selected: {
      true: {
        backgroundColor: '$textSurface',
      },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$gray/8',
        },
      },
    },
    pop: {
      true: {
        backgroundColor: '$purple1',
      },
    },
  } as const,
})

const CircleIcon = styled(Circle, {
  context: propsContext,
  animation: '100ms',
  width: 64,
  height: 64,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'transparent',
  backgroundColor: '$gray2',

  variants: {
    selected: {
      true: {
        borderColor: '$purple9',
        backgroundColor: 'transparent',
      },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        // '$group-hover': { // Disabled for Expo 53 compatibility
        //   borderColor: '$purple9',
        //   backgroundColor: '$gray1',
        // },
      },
    },
  } as const,
})

const CircleBadge = styled(Circle, {
  context: propsContext,
  animation: '100ms',
  width: 20,
  height: 20,
  backgroundColor: '$white1',
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  right: 0,
  variants: {
    selected: {
      true: {
        backgroundColor: '$purple9',
      },
    },
  } as const,
})

const ScopeItemApi = withStaticProperties(ScopeItemContainer, {
  Props: propsContext,
  CircleIcon,
  CircleBadge,
})

export const ScopeItem = ({ title, description, onPress, pop, showButton = true, selected }: Props) => {
  return (
    <ScopeItemApi
      onPress={onPress}
      selected={selected}
      paddingHorizontal="$large"
      backgroundColor="$backgroundLight"
      justifyContent="center"
      alignItems="center"
      pop={pop}
      interactive={showButton}
    >
      <ScopeItemApi.CircleIcon selected={selected}>
        <ScopeItemApi.CircleBadge>{selected ? <Check size={12} color="$white1" /> : <RefreshCcw size={12} color="$gray5" />}</ScopeItemApi.CircleBadge>
        {selected ? <SparklePlain /> : <Sparkle color="$gray5" />}
      </ScopeItemApi.CircleIcon>
      <YStack gap="$small">
        <Text.SM semibold textAlign="center">
          {title}
        </Text.SM>
        <Text.SM numberOfLines={1} textAlign="center">
          {description}
        </Text.SM>
      </YStack>
      {showButton && (
        <XStack>
          <VoxButton variant="outlined" size="sm" onPress={onPress} disabled={selected}>
            Choisir
          </VoxButton>
        </XStack>
      )}
    </ScopeItemApi>
  )
}
