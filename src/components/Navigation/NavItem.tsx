import { ComponentProps, ComponentPropsWithoutRef, createContext, forwardRef, useContext, useMemo } from 'react'
import { ExternalLink } from '@tamagui/lucide-icons'
import { styled, TamaguiElement, XStack, YStack, isWeb } from 'tamagui'
import { Link, useRouter, type Href } from 'expo-router'
import type { PressableProps } from 'react-native'
import Text from '@/components/base/Text'
import type { IconComponent } from '@/models/common.model'
import ProfilePicture from '@/components/ProfilePicture/ProfilePicture'

const NavItemFrame = styled(XStack, {
  alignItems: 'center',
  gap: 8,
  paddingLeft: 6,
  paddingRight: 12,
  paddingVertical: 6,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: 8,
  userSelect: 'none',
  hoverStyle: { backgroundColor: '$gray1' },
  pressStyle: { backgroundColor: '$gray2' },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineColor: '$color5',
    outlineStyle: 'solid',
    outlineOffset: 2,
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$gray1',
        hoverStyle: { backgroundColor: '$gray2' },
        pressStyle: { backgroundColor: '$gray3' },
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        hoverStyle: { backgroundColor: 'transparent' },
        pressStyle: { backgroundColor: 'transparent' },
      },
    },
    shape: {
      default: {},
      pillLeft: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
      },
      pillBoth: {
        borderRadius: 999,
      },
    },
    collapsed: {
      true: {
        width: 40,
        height: 40,
      },
    },
    outlined: {
      true: {
        borderWidth: 1,
        borderColor: '$color2',
        backgroundColor: 'transparent',
      },
    },
  },
} as const)

const NewChip = () => (
  <YStack bg="$color5" borderRadius={4} paddingHorizontal={4} paddingVertical={4}>
    <Text fontSize={7} bold color="white">
      NEW
    </Text>
  </YStack>
)

const IconContainer = styled(YStack, {
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  backgroundColor: 'white',
  variants: {
    tone: {
      default: { backgroundColor: 'white' },
      active: { backgroundColor: '$gray1' },
      danger: { backgroundColor: '#FFEBEC' },
      disabled: { backgroundColor: '$gray1', opacity: 0.6 },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
} as const)

type IconTone = 'default' | 'active' | 'danger' | 'disabled'
type NavItemProfilePictureProps = Omit<ComponentProps<typeof ProfilePicture>, 'rounded'> & { rounded?: boolean }

type NavItemContextValue = { collapsed: boolean }
const NavItemContext = createContext<NavItemContextValue>({ collapsed: false })
const useNavItemContext = () => useContext(NavItemContext)

export type NavItemProps = {
  iconLeft?: IconComponent
  iconRight?: IconComponent
  text: string
  isNew?: boolean
  externalLink?: boolean
  profilePicture?: NavItemProfilePictureProps
  dangerAccent?: boolean
  collapsed?: boolean
  outlined?: boolean
  href?: Href
  onPress?: PressableProps['onPress']
} & ComponentPropsWithoutRef<typeof NavItemFrame>

export const NavItem = forwardRef<TamaguiElement, NavItemProps>(
  (
    {
      href,
      iconLeft: IconLeft,
      iconRight: IconRight,
      text,
      isNew,
      externalLink,
      disabled,
      active,
      onPress,
      theme = 'blue',
      profilePicture,
      dangerAccent,
      collapsed,
      outlined,
      tabIndex,
      role,
      ...props
    },
    ref,
  ) => {
    const router = useRouter()
    const contentColor = disabled ? '$textDisabled' : '$textPrimary'

    const iconTone = useMemo<IconTone>(() => {
      if (dangerAccent) return 'danger'
      if (disabled) return 'disabled'
      if (active) return 'active'
      return 'default'
    }, [dangerAccent, disabled, active])

    const iconColor =
      iconTone === 'danger'
        ? '#FD393D'
        : outlined
          ? '$color5'
          : active && theme
            ? '$color5'
            : contentColor

    const { collapsed: contextCollapsed } = useNavItemContext()
    const resolvedCollapsed = collapsed ?? contextCollapsed

    const leftContent = (() => {
      if (profilePicture) {
        const { size, rounded, ...profilePictureRest } = profilePicture
        return (
          <ProfilePicture
            size={size ?? 28}
            rounded={rounded ?? true}
            marginRight={resolvedCollapsed ? 0 : 6}
            {...profilePictureRest}
          />
        )
      }

      if (IconLeft) {
        return (
          <IconContainer
            tone={iconTone}
            marginRight={resolvedCollapsed ? 0 : 6}
            $group-hover={{ backgroundColor: dangerAccent ? '#FFEBEC' : active ? '$gray2' : '$gray1' }}
            $group-press={{ backgroundColor: dangerAccent ? '#FFEBEC' : active ? '$gray3' : '$gray2' }}
          >
            <IconLeft size={16} color={iconColor} />
          </IconContainer>
        )
      }

      return null
    })()

    const shape: ComponentProps<typeof NavItemFrame>['shape'] = resolvedCollapsed
      ? (profilePicture || dangerAccent) ? 'pillBoth' : 'default'
      : (profilePicture || dangerAccent) ? 'pillLeft' : 'default'

    const shouldRenderAsWebLink = Boolean(href && isWeb)

    type PressEvent = Parameters<NonNullable<PressableProps['onPress']>>[0]
    const handlePress = (event: PressEvent) => {
      if (disabled) {
        if (typeof event?.preventDefault === 'function') {
          event.preventDefault()
        }
        return
      }
      onPress?.(event)
      if (href && !isWeb) {
        router.push(href)
      }
    }

    const resolvedTabIndex = shouldRenderAsWebLink ? undefined : tabIndex ?? (disabled ? -1 : 0)
    const resolvedRole = shouldRenderAsWebLink ? role : role ?? 'button'
    const shouldAttachPressToFrame = !shouldRenderAsWebLink && (Boolean(onPress) || Boolean(href))
    const shouldUseButtonTag = shouldAttachPressToFrame && !disabled && isWeb

    const navItemContent = (
      <NavItemContext.Provider value={{ collapsed: resolvedCollapsed }}>
        <NavItemFrame
          {...props}
          group // <-- important : active les $group-* descendants
          active={active}
          disabled={disabled}
          theme={theme}
          onPress={shouldAttachPressToFrame ? handlePress : undefined}
          ref={ref}
          collapsed={resolvedCollapsed}
          shape={shape}
          outlined={outlined}
          tabIndex={resolvedTabIndex}
          role={resolvedRole}
          tag={shouldUseButtonTag ? 'button' : undefined}
        >
          {resolvedCollapsed ? (
            leftContent
          ) : (
            <>
              <XStack flex={1} alignItems="center" height={28} gap={2}>
                {leftContent}
                <Text.MD flex={1} color={contentColor} medium numberOfLines={1}>
                  {text}
                </Text.MD>
              </XStack>
              <XStack alignItems="center" gap={4}>
                {isNew ? <NewChip /> : null}
                {externalLink ? <ExternalLink size={12} color="$gray4" /> : null}
                {IconRight ? <IconRight size={16} color="$color5" /> : null}
              </XStack>
            </>
          )}
        </NavItemFrame>
      </NavItemContext.Provider>
    )

    if (shouldRenderAsWebLink && href) {
      return (
        <Link
          href={href}
          onPress={handlePress}
          style={{ textDecorationLine: 'none' }}
          aria-disabled={disabled || undefined}
        >
          {navItemContent}
        </Link>
      )
    }

    return navItemContent
  },
)

NavItem.displayName = 'NavItem'
