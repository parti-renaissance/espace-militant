import { ComponentProps, ComponentPropsWithoutRef, createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { PressableProps } from 'react-native'
import { Link, useRouter, type Href } from 'expo-router'
import { isWeb, styled, TamaguiElement, useMedia, XStack, YStack } from 'tamagui'
import { ExternalLink } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture/ProfilePicture'

import type { IconComponent } from '@/models/common.model'

import { NavItemDropdown, type NavItemSubItem } from './NavItemDropdown'

const NavItemFrame = styled(XStack, {
  alignItems: 'center',
  gap: 8,
  height: 40,
  $sm: {
    height: 48,
  },
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
    outlineOffset: 0,
  },
  variants: {
    inner: {
      true: {
        borderRadius: 4,
      },
    },
    active: {
      true: {
        backgroundColor: '$gray1',
      },
    },
    disabled: {
      true: {
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
        alignItems: 'center',
        paddingHorizontal: 6,
      },
    },
  },
} as const)

// Frame pour menu secondaire (fond gris clair) : default $textOutline, hover $textOutline20, press $textOutline32
const NavSecondaryItemFrame = styled(NavItemFrame, {
  backgroundColor: '$textOutline',
  hoverStyle: { backgroundColor: '$textSurface' },
  pressStyle: { backgroundColor: '$textOutline20' },
  variants: {
    active: {
      true: {
        backgroundColor: '$textOutline32',
        hoverStyle: { backgroundColor: '$textOutline32' },
        pressStyle: { backgroundColor: '$textOutline32' },
      },
    },
  },
} as const)

const NavCadreItemFrame = styled(NavItemFrame, {
  borderWidth: 1,
  borderColor: '$purple2',
  hoverStyle: {
    borderColor: '$purple1',
    backgroundColor: '$purple1',
  },
  pressStyle: {
    borderColor: '$purple2',
    backgroundColor: '$purple2',
  },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineColor: '$purple5',
    outlineStyle: 'solid',
    outlineOffset: 0,
  },
  variants: {
    active: {
      true: {
        borderColor: '$purple1',
        backgroundColor: '$purple1',
        hoverStyle: {
          borderColor: '$purple2',
          backgroundColor: '$purple2',
        },
        pressStyle: {
          borderColor: '$purple3',
          backgroundColor: '$purple3',
        },
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        hoverStyle: { backgroundColor: 'transparent' },
        pressStyle: { backgroundColor: 'transparent' },
      },
    },
  },
} as const)

const NewChip = () => {
  const media = useMedia()
  return (
    <YStack bg="$color5" borderRadius={4} paddingHorizontal={media.sm ? 5 : 4} paddingVertical={media.sm ? 6 : 4} height={media.sm ? 19 : 15}>
      <Text fontSize={media.sm ? 9 : 7} bold color="white" lineHeight={media.sm ? 9 : 8}>
        NEW
      </Text>
    </YStack>
  )
}

const IconContainer = styled(YStack, {
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  variants: {
    tone: {
      default: {
        backgroundColor: 'white',
        ['$group-hover']: { backgroundColor: '$gray1' },
        ['$group-press']: { backgroundColor: '$gray2' },
      },
      active: {
        backgroundColor: '$gray1',
        ['$group-hover']: { backgroundColor: '$gray1' },
        ['$group-press']: { backgroundColor: '$gray2' },
      },
      danger: {
        backgroundColor: '#FFEBEC',
        ['$group-hover']: { backgroundColor: '$gray1' },
        ['$group-press']: { backgroundColor: '$gray2' },
      },
      disabled: {
        backgroundColor: 'white',
        ['$group-hover']: { backgroundColor: 'white' },
        ['$group-press']: { backgroundColor: 'white' },
      },
      secondary: {
        backgroundColor: '$textOutline',
        ['$group-hover']: { backgroundColor: '$textSurface' },
        ['$group-press']: { backgroundColor: '$textOutline20' },
      },
      secondaryActive: {
        backgroundColor: '$textOutline32',
        ['$group-hover']: { backgroundColor: '$textOutline32' },
        ['$group-press']: { backgroundColor: '$textOutline32' },
      },
      cadre: {
        backgroundColor: 'white',
        ['$group-hover']: { backgroundColor: '$purple1' },
        ['$group-press']: { backgroundColor: '$purple2' },
      },
      cadreActive: {
        backgroundColor: '$purple1',
        ['$group-hover']: { backgroundColor: '$purple2' },
        ['$group-press']: { backgroundColor: '$purple3' },
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
} as const)

type IconTone = 'default' | 'active' | 'danger' | 'disabled' | 'secondary' | 'secondaryActive' | 'cadre' | 'cadreActive'
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
  href?: Href
  onPress?: PressableProps['onPress']
  frame?: 'primary' | 'secondary' | 'cadre'
  subItems?: NavItemSubItem[]
  dropdownVerticalPosition?: 'top' | 'bottom'
  inner?: boolean
} & ComponentPropsWithoutRef<typeof NavItemFrame>

type PressEvent = Parameters<NonNullable<PressableProps['onPress']>>[0]

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
      tabIndex,
      role,
      frame = 'primary',
      subItems,
      dropdownVerticalPosition = 'bottom',
      inner = false,
      ...props
    },
    ref,
  ) => {
    const router = useRouter()
    const media = useMedia()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const frameRef = useRef<HTMLElement | null>(null)

    const hasSubItems = Boolean(subItems?.length)
    const isWebLink = Boolean(href && isWeb)
    const contentColor = disabled ? '$textOutline32' : frame === 'cadre' ? '$purple6' : '$textPrimary'

    const iconTone = useMemo<IconTone>(() => {
      if (disabled) return 'disabled'
      if (frame === 'cadre' && active) return 'cadreActive'
      if (frame === 'cadre') return 'cadre'
      if (frame === 'secondary' && active) return 'secondaryActive'
      if (frame === 'secondary') return 'secondary'
      if (active) return 'active'
      return 'default'
    }, [disabled, active, frame])

    const iconColor = useMemo(() => {
      if (dangerAccent) return '#FD393D'
      if (frame === 'cadre') return '$purple5'
      if (frame === 'secondary') return active ? '$color5' : '$textSecondary'
      if (active) return '$color5'
      return contentColor
    }, [dangerAccent, active, frame, contentColor])

    const { collapsed: contextCollapsed } = useNavItemContext()
    const resolvedCollapsed = collapsed ?? contextCollapsed

    const handlePress = useCallback(
      (event: PressEvent) => {
        if (disabled) {
          if (typeof event?.preventDefault === 'function') {
            event.preventDefault()
          }
          return
        }
        if (hasSubItems) {
          setDropdownOpen((prev) => !prev)
          return
        }
        onPress?.(event)
        if (href && !isWeb && !active) {
          router.navigate(href)
        }
      },
      [disabled, hasSubItems, onPress, href, active, router],
    )

    const setRef = useCallback(
      (node: TamaguiElement | null) => {
        frameRef.current = node as HTMLElement | null
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const shouldAttachPressToFrame = hasSubItems || (!isWebLink && (Boolean(onPress) || Boolean(href)))
    const shouldUseButtonTag = shouldAttachPressToFrame && !disabled && isWeb
    const resolvedTabIndex = isWebLink ? undefined : (tabIndex ?? (disabled ? -1 : 0))
    const resolvedRole = isWebLink ? role : (role ?? 'button')
    const shouldUseLink = isWebLink && Boolean(href) && !hasSubItems

    const FrameComponent = frame === 'cadre' ? NavCadreItemFrame : frame === 'secondary' ? NavSecondaryItemFrame : NavItemFrame

    const navItemContent = (
      <NavItemContext.Provider value={{ collapsed: resolvedCollapsed }}>
        <FrameComponent
          {...props}
          group
          inner={inner}
          active={active}
          disabled={disabled}
          theme={theme}
          onPress={shouldAttachPressToFrame ? handlePress : undefined}
          ref={setRef}
          collapsed={resolvedCollapsed}
          shape={resolvedCollapsed ? (profilePicture ? 'pillBoth' : 'default') : profilePicture ? 'pillLeft' : 'default'}
          tabIndex={resolvedTabIndex}
          role={resolvedRole}
          tag={shouldUseButtonTag ? 'button' : undefined}
        >
          <XStack flex={resolvedCollapsed ? 0 : 1} alignItems="center" height={28} gap={2}>
            {profilePicture ? (
              <ProfilePicture
                {...profilePicture}
                size={profilePicture.size ?? 28}
                rounded={profilePicture.rounded ?? true}
                marginRight={resolvedCollapsed ? 0 : 6}
              />
            ) : IconLeft ? (
              <IconContainer tone={iconTone} marginRight={resolvedCollapsed ? 0 : 2}>
                <IconLeft size={16} color={iconColor} />
              </IconContainer>
            ) : null}
            {!resolvedCollapsed && (
              <Text.MD flex={1} color={contentColor} medium numberOfLines={1}>
                {text}
              </Text.MD>
            )}
          </XStack>
          {!resolvedCollapsed && (
            <XStack alignItems="center" gap={8}>
              {isNew ? <NewChip /> : null}
              {externalLink ? <ExternalLink size={media.sm ? 14 : 12} color="$gray4" /> : null}
              {IconRight ? <IconRight size={16} color="$color5" /> : null}
            </XStack>
          )}
        </FrameComponent>
      </NavItemContext.Provider>
    )

    return (
      <>
        {shouldUseLink ? (
          <Link href={href!} onPress={handlePress} style={{ textDecorationLine: 'none' }} aria-disabled={disabled || undefined}>
            {navItemContent}
          </Link>
        ) : (
          navItemContent
        )}
        {hasSubItems && (
          <NavItemDropdown
            open={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            subItems={subItems!}
            triggerRef={frameRef}
            verticalPosition={dropdownVerticalPosition}
          />
        )}
      </>
    )
  },
)

NavItem.displayName = 'NavItem'
