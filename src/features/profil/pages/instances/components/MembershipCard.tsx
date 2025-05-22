import Text from "@/components/base/Text"
import { VoxButton } from "@/components/Button"
import VoxCard, { VoxCardFrame } from "@/components/VoxCard/VoxCard"
import { styled, XStack, YStack } from "tamagui"

const MembershipCardFrame = styled(VoxCardFrame, {
  tag: 'button',
  animation: 'quick',
  cursor: 'pointer',
  flex: 1,
  height: 148,
  borderWidth: 2,
  justifyContent: 'center',
  backgroundColor: '$blue/8',
  borderColor: 'white',

  pressStyle: {
    borderColor: '$blue5',
    backgroundColor: '$blue1',
  },
  hoverStyle: {
    borderColor: '$blue3',
    backgroundColor: '$blue/16',
  },
  focusStyle: {
    borderColor: '$blue5',
    backgroundColor: '$blue1',
  },

  variants: {
    selected: {
      true: {
        borderColor: '$blue5',
        backgroundColor: '$blue1',
        cursor: 'default',
        hoverStyle: {
          borderColor: '$blue5',
          backgroundColor: '$blue1',
        },
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        backgroundColor: '$gray/6',
        borderColor: '$gray5',
        pressStyle: {
          borderColor: '$gray5',
          backgroundColor: '$gray2',
        },
        hoverStyle: {
          borderColor: '$gray4',
          backgroundColor: '$gray/10',
        },
        focusStyle: {
          borderColor: '$gray5',
          backgroundColor: '$gray2',
        },
      },
    },
  },
})

type MembershipCardProps = {
  title: string
  subtitle: string
  selected?: boolean
  loading?: boolean
  onPress?: () => void
  showJoinButton?: boolean
  isMember?: boolean
  disabled?: boolean
}

export function MembershipCard({
    title,
    subtitle,
    selected,
    loading,
    onPress,
    showJoinButton = true,
    isMember = false,
    disabled = false,
  }: MembershipCardProps) {
    const isTrulyDisabled = disabled && !isMember
  
    const color = isTrulyDisabled ? '$gray6' : '$blue6'
    const subColor = isTrulyDisabled ? '$gray5' : '$blue5'
    const buttonTheme = isTrulyDisabled ? 'gray' : 'blue'
  
    // Le onPress pour le card wrapper, seulement si pas de bouton join visible
    const cardPressable = !selected && !isTrulyDisabled && !showJoinButton && onPress ? onPress : undefined
  
    return (
      <MembershipCardFrame
        inside
        selected={selected}
        disabled={isTrulyDisabled}
        onPress={cardPressable}
        focusable={!isTrulyDisabled}
        flexBasis={0}
      >
        <VoxCard.Content>
          <XStack justifyContent="space-between" alignItems="center" gap="$medium">
            <YStack flexShrink={1} gap={8}>
              <Text.MD semibold color={color}>{title}</Text.MD>
              <Text.SM color={subColor}>{subtitle}</Text.SM>
            </YStack>
  
            {showJoinButton && (
              <YStack>
                {isMember ? (
                  <VoxButton variant="text" theme={buttonTheme}>Membre</VoxButton>
                ) : isTrulyDisabled ? (
                  <Text.MD color="$gray5" semibold px="$medium">Complète</Text.MD>
                ) : (
                  <VoxButton
                    variant="outlined"
                    bg="white"
                    theme="blue"
                    onPress={onPress} // seul ce bouton déclenche l'action
                    loading={loading}
                  >
                    Rejoindre
                  </VoxButton>
                )}
              </YStack>
            )}
          </XStack>
        </VoxCard.Content>
      </MembershipCardFrame>
    )
  }
  
