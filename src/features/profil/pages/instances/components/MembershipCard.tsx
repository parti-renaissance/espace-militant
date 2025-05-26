import Text from "@/components/base/Text"
import { VoxButton } from "@/components/Button"
import ProfilePicture from "@/components/ProfilePicture"
import VoxCard, { VoxCardFrame } from "@/components/VoxCard/VoxCard"
import { AgoraMemberSchema } from "@/services/agoras/schema"
import { styled, XStack, YStack } from "tamagui"

const MembershipCardFrame = styled(VoxCardFrame, {
  tag: 'button',
  animation: 'quick',
  cursor: 'pointer',
  flex: 1,
  borderWidth: 2,
  justifyContent: 'center',
  backgroundColor: '$blue1',
  borderColor: '$textOutline',
  overflow: 'hidden',

  pressStyle: {
    borderColor: '$blue5',
    backgroundColor: '$blue1',
  },
  hoverStyle: {
    borderColor: '$blue3',
    backgroundColor: '$blue2',
  },
  focusStyle: {
    borderColor: '$blue5',
    backgroundColor: '$blue3',
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
        backgroundColor: '$gray1',
        borderColor: '$gray5',
        pressStyle: {
          borderColor: '$gray5',
          backgroundColor: '$gray1',
        },
        hoverStyle: {
          borderColor: '$gray',
          backgroundColor: '$gray1',
        },
        focusStyle: {
          borderColor: '$gray5',
          backgroundColor: '$gray1',
        },
      },
    },
  },
})

type MembershipCardProps = {
  title: string
  subtitle: string
  loading?: boolean
  onPress?: () => void
  showJoinButton?: boolean
  isMember?: boolean
  disabled?: boolean
  manager?: {
    name?: string
    role?: string
    avatar: string | null
  }
}

export function MembershipCard({
  title,
  subtitle,
  loading,
  onPress,
  showJoinButton = true,
  isMember = false,
  disabled = false,
  manager
}: MembershipCardProps) {
  const isTrulyDisabled = disabled && !isMember

  const color = isTrulyDisabled ? '$gray6' : '$blue6'
  const subColor = isTrulyDisabled ? '$gray5' : '$blue5'
  const buttonTheme = isTrulyDisabled ? 'gray' : 'blue'

  const cardPressable = !isMember && !isTrulyDisabled && !showJoinButton && onPress ? onPress : undefined

  return (
    <MembershipCardFrame
      inside
      selected={isMember}
      disabled={isTrulyDisabled}
      onPress={cardPressable}
      focusable={!isTrulyDisabled}
      flexBasis={0}
    >
      <VoxCard.Content px={0} pb={0} flexShrink={1} height={148} overflow="hidden">
        <XStack justifyContent="space-between" alignItems="center" gap="$medium" px="$medium" flexGrow={1}>
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
                  onPress={onPress}
                  loading={loading}
                >
                  Rejoindre
                </VoxButton>
              )}
            </YStack>
          )}
        </XStack>
        {manager ? (
          <YStack backgroundColor="$white1" p="$medium">
            <XStack alignItems="center">
              <ProfilePicture rounded src={manager?.avatar ?? undefined} fullName={manager?.name ?? 'R E'} alt={`Avatar de ${manager?.name}`} size="$3" />
              <YStack ml="$small">
                {manager?.name && <Text.SM>{manager?.name}</Text.SM>}
                {manager?.role && <Text.P>{manager?.role}</Text.P>}
              </YStack>
            </XStack>
          </YStack>
        ) : (
          <YStack/>
        )}

      </VoxCard.Content>
    </MembershipCardFrame>
  )
}

