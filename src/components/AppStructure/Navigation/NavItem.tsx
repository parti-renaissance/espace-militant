import { ComponentProps, ComponentPropsWithoutRef, createContext, forwardRef, useContext, useMemo, useRef, useState } from 'react'
import type { PressableProps } from 'react-native'
import { Link, useRouter, type Href } from 'expo-router'
import { ExternalLink } from '@tamagui/lucide-icons'
import { styled, TamaguiElement, XStack, YStack, isWeb, useMedia } from 'tamagui'
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
  backgroundColor: 'white',
  variants: {
    tone: {
      default: { backgroundColor: 'white' },
      active: { backgroundColor: '$gray1' },
      danger: { backgroundColor: '#FFEBEC' },
      disabled: { backgroundColor: 'white' },
      cadre: { backgroundColor: 'white' },
      cadreActive: { backgroundColor: '$purple1' },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
} as const)

type IconTone = 'default' | 'active' | 'danger' | 'disabled' | 'cadre' | 'cadreActive'
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
  frame?: 'default' | 'cadre'
  subItems?: NavItemSubItem[]
  dropdownVerticalPosition?: 'top' | 'bottom' // Position verticale du dropdown
  inner?: boolean
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
      tabIndex,
      role,
      frame = 'default',
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
    const contentColor = disabled ? '$textOutline32' : frame === 'cadre' ? '$purple6' : '$textPrimary'

    const iconTone = useMemo<IconTone>(() => {
      if (disabled) return 'disabled'
      if (frame === 'cadre' && active) return 'cadreActive'
      if (frame === 'cadre') return 'cadre'
      if (active) return 'active'
      return 'default'
    }, [dangerAccent, disabled, active, frame])

    const iconColor = useMemo(() => {
      if (dangerAccent) return '#FD393D'
      if (frame === 'cadre') return '$purple5'
      if (active) return '$color5'
      return contentColor
    }, [dangerAccent, disabled, active, theme, contentColor, frame])

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
            marginRight={resolvedCollapsed ? 0 : 2}
            $group-hover={{ backgroundColor: (active && frame === 'cadre') ? '$purple2' : frame === 'cadre' ? '$purple1' : disabled ? 'white' : '$gray1' }}
            $group-press={{ backgroundColor: (active && frame === 'cadre') ? '$purple3' : frame === 'cadre' ? '$purple2' : disabled ? 'white' : '$gray2' }}
          >
            <IconLeft size={16} color={iconColor} />
          </IconContainer>
        )
      }

      return null
    })()

    const shape: ComponentProps<typeof NavItemFrame>['shape'] = resolvedCollapsed
      ? (profilePicture) ? 'pillBoth' : 'default'
      : (profilePicture) ? 'pillLeft' : 'default'

    const shouldRenderAsWebLink = Boolean(href && isWeb)

    type PressEvent = Parameters<NonNullable<PressableProps['onPress']>>[0]
    const handlePress = (event: PressEvent) => {
      if (disabled) {
        if (typeof event?.preventDefault === 'function') {
          event.preventDefault()
        }
        return
      }
      
      // Si le NavItem a des subItems, ouvrir le dropdown au lieu de naviguer
      if (subItems && subItems.length > 0) {
        setDropdownOpen(!dropdownOpen)
        return
      }
      
      onPress?.(event)
      if (href && !isWeb && !active) {
        router.navigate(href)
      }
    }

    const resolvedTabIndex = shouldRenderAsWebLink ? undefined : tabIndex ?? (disabled ? -1 : 0)
    const resolvedRole = shouldRenderAsWebLink ? role : role ?? 'button'
    // Attacher onPress au Frame si on a subItems, onPress, href, ou si ce n'est pas un lien web
    const shouldAttachPressToFrame = (Boolean(subItems && subItems.length > 0)) || (!shouldRenderAsWebLink && (Boolean(onPress) || Boolean(href)))
    const shouldUseButtonTag = shouldAttachPressToFrame && !disabled && isWeb

    const FrameComponent = frame === 'cadre' ? NavCadreItemFrame : NavItemFrame

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
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            frameRef.current = node as HTMLElement | null
          }}
          collapsed={resolvedCollapsed}
          shape={shape}
          tabIndex={resolvedTabIndex}
          role={resolvedRole}
          tag={shouldUseButtonTag ? 'button' : undefined}
        >
          <XStack flex={resolvedCollapsed ? 0 : 1} alignItems="center" height={28} gap={2}>
            {leftContent}
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

    // Si on a des subItems, on ne doit pas utiliser Link même si href est défini
    const shouldUseLink = shouldRenderAsWebLink && href && !(subItems && subItems.length > 0)
    
    const navItemWithDropdown = (
      <>
        {shouldUseLink ? (
          <Link
            href={href}
            onPress={handlePress}
            style={{ textDecorationLine: 'none' }}
            aria-disabled={disabled || undefined}
          >
            {navItemContent}
          </Link>
        ) : (
          navItemContent
        )}
        {subItems && subItems.length > 0 && (
          <NavItemDropdown
            open={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            subItems={subItems}
            triggerRef={frameRef}
            verticalPosition={dropdownVerticalPosition}
          />
        )}
      </>
    )

    return navItemWithDropdown
  },
)

NavItem.displayName = 'NavItem'
