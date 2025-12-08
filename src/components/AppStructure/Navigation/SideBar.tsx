import React, { useState, useMemo } from 'react'
import { usePathname } from 'expo-router'
import { BellOff, ChevronRight, Sparkle, Ellipsis, CircleCheckBig } from '@tamagui/lucide-icons'
import { styled, YStack, XStack } from 'tamagui'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { NavItem } from './NavItem'
import { ScopeSelector } from './ScopeSelector'
import { FeaturebaseFooterItems } from './FeaturebaseFooterItems'
import type { NavItemSubItem } from './NavItemDropdown'
import { useVisibleNavItems } from '@/components/AppStructure/hooks/useVisibleNavItems'
import { isNavItemActive } from '@/components/AppStructure/utils'
import { useMilitantNavItems, type NavItemConfig } from '@/config/navigationItems'
import { useGetExecutiveScopes, useGetProfil } from '@/services/profile/hook'
import useCheckNotificationsState from '@/hooks/notifications/useCheckNotificationsState'
import { useSession } from '@/ctx/SessionProvider'
import CadreIllustration from '@/assets/illustrations/CadreIllustration'

export const WIDTH_MILITANT = 248;
export const WIDTH_COLLAPSED = 58;
export const MARGINS = {
  small: 8,
  medium: 12,
  large: 16,
};


export type SideBarState = 'floating' | 'militant' | 'collapsed' | 'cadre' | 'hide'

export const SideBarArea = styled(XStack, {
  position: 'relative',
  zIndex: 1000,
  justifyContent: 'flex-start',
  variants: {
    state: {
      floating: {
        width: 0,
      },
      militant: {
        $lg: {
          width: WIDTH_MILITANT + MARGINS.small,
        },
        $xl: {
          width: WIDTH_MILITANT + MARGINS.medium,
        },
        width: WIDTH_MILITANT + MARGINS.large,
      },
      collapsed: {
        $lg: {
          width: WIDTH_COLLAPSED + MARGINS.small,
        },
        $xl: {
          width: WIDTH_COLLAPSED + MARGINS.medium,
        },
        width: WIDTH_COLLAPSED + MARGINS.large,
      },
      cadre: {
        $lg: {
          width: MARGINS.small + WIDTH_COLLAPSED + MARGINS.small + WIDTH_MILITANT,
        },
        $xl: {
          width: MARGINS.medium + WIDTH_COLLAPSED + MARGINS.medium + WIDTH_MILITANT,
        },
        width: MARGINS.large + WIDTH_COLLAPSED + MARGINS.large + WIDTH_MILITANT,
      },
      hide: {
        width: 0,
        display: 'none',
      },
    },
  },
  defaultVariants: {
    state: 'militant',
  },
} as const)

const SideBarContainer = styled(YStack, {
  $lg: {
    my: MARGINS.small,
    ml: MARGINS.small,
  },
  $xl: {
    my: MARGINS.medium,
    ml: MARGINS.medium,
  },
  my: MARGINS.large,
  ml: MARGINS.large,

  paddingTop: 20,
  paddingBottom: 8,
  paddingLeft: 8,
  paddingRight: 8,

  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: 'white',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$textOutline',
  width: WIDTH_MILITANT,
  justifyContent: 'space-between',
  gap: 16,
  variants: {
    collapsed: {
      true: {
        width: WIDTH_COLLAPSED,
        alignItems: 'center',
      },
    },
    isMilitantInCadreMode: {
      true: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      },
    },
    isCadre: {
      true: {
        $lg: {
          marginLeft: 4,
        },
        $xl: {
          marginLeft: 4,
        },
        marginLeft: 4,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      },
    },
    hasBoxShadow: {
      true: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        boxShadow: '2px 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      false: {
        boxShadow: 'none',
      },
    },
  },
} as const)

const LogoContainer = styled(YStack, {
  paddingHorizontal: 8,
  paddingVertical: 8,
  variants: {
    collapsed: {
      true: {
        paddingHorizontal: 0,
        alignItems: 'center',
      },
    },
  },
} as const)

const MenuContainer = styled(YStack, {
  flex: 1,
  gap: 4,
  marginBottom: 44,
  variants: {
    collapsed: {
      true: {
        alignItems: 'center',
      },
    },
  },
} as const)

const MenuFooterContainer = styled(YStack, {
  gap: 4,
  variants: {
    collapsed: {
      true: {
        alignItems: 'center',
      },
    },
  },
} as const)

const Line = styled(YStack, {
  backgroundColor: '$purple3',
  position: 'absolute',
  left: 20,
  top: -16,
  bottom: 16,
  width: 1,
  height: '100%',
})

interface SideBarProps {
  state?: SideBarState
  navCadreItems: NavItemConfig[]
}

export const SideBar = ({ state = 'militant', navCadreItems }: SideBarProps) => {
  const { isAuth, signIn, signUp } = useSession()
  const pathname = usePathname()
  const { data: user } = useGetProfil({ enabled: isAuth })
  const { data: executiveScopes } = useGetExecutiveScopes()
  const militantNavItems = useMilitantNavItems()
  const [displayNavCadre, setDisplayNavCadre] = useState(state === 'cadre')
  const { notificationGranted, triggerNotificationRequest } = useCheckNotificationsState()
  const hasExecutiveScopes = useMemo(
    () => executiveScopes?.list && executiveScopes.list.length > 0,
    [executiveScopes],
  )

  React.useEffect(() => {
    if (displayNavCadre && state !== 'cadre') {
      setDisplayNavCadre(false)
    }
  }, [state, pathname])

  // Ajouter la propriété active aux items militant et filtrer selon displayIn
  const militantNavItemsWithActive = useMemo(() => {
    return militantNavItems
      .filter(item => {
        const displayIn = item.displayIn ?? 'all'
        return displayIn === 'all' || displayIn === 'sidebar'
      })
      .map(item => ({
        ...item,
        active: isNavItemActive(pathname, item.href),
      }))
  }, [pathname, militantNavItems])

  // Ajouter la propriété active aux items cadre et filtrer selon displayIn
  const cadreNavItemsWithActive = useMemo(() => {
    return navCadreItems
      .filter(item => {
        const displayIn = item.displayIn ?? 'all'
        return displayIn === 'all' || displayIn === 'sidebar'
      })
      .map(item => ({
        ...item,
        active: isNavItemActive(pathname, item.href),
      }))
  }, [pathname, navCadreItems])

  // Utiliser le hook pour gérer la visibilité des items du menu militant
  const {
    visibleItems: visibleMilitantNavItems,
    hiddenItems: hiddenMilitantNavItems,
    onLayout: onMilitantMenuLayout,
  } = useVisibleNavItems<NavItemConfig>({
    items: militantNavItemsWithActive,
    hasCadreButton: hasExecutiveScopes ?? false,
    isVisible: true,
  })

  // Utiliser le hook pour gérer la visibilité des items du menu cadre
  const {
    visibleItems: visibleCadreNavItems,
    hiddenItems: hiddenCadreNavItems,
    onLayout: onCadreMenuLayout,
  } = useVisibleNavItems<NavItemConfig>({
    items: cadreNavItemsWithActive,
    hasCadreButton: false,
    isVisible: displayNavCadre,
  })

  // Créer les subItems pour le menu "Plus" militant
  const militantPlusSubItems: NavItemSubItem[] = hiddenMilitantNavItems.map((item) => ({
    id: `plus-${item.id}`,
    text: item.text,
    customContent: (
      <NavItem
        text={item.text}
        iconLeft={item.iconLeft}
        href={item.href}
        isNew={item.isNew}
        externalLink={item.externalLink}
        disabled={item.disabled}
        active={item.active}
        onPress={item.onPress}
        inner={true}
      />
    )
  }))

  const cadrePlusSubItems: NavItemSubItem[] = hiddenCadreNavItems.map((item) => ({
    id: `plus-${item.id}`,
    text: item.text,
    customContent: (
      <NavItem
        text={item.text}
        iconLeft={item.iconLeft}
        theme={item.theme}
        href={item.href}
        isNew={item.isNew}
        externalLink={item.externalLink}
        disabled={item.disabled}
        active={item.active}
        inner={true}
      />
    )
  }))

  return (
    <SideBarArea state={state}>
      <SideBarContainer collapsed={displayNavCadre} isMilitantInCadreMode={displayNavCadre}>
        <LogoContainer collapsed={displayNavCadre}>
          <EuCampaignIllustration showText={!displayNavCadre} />
        </LogoContainer>
        <MenuContainer collapsed={displayNavCadre} onLayout={onMilitantMenuLayout}>
          {visibleMilitantNavItems.map((item) => (
            <NavItem
              key={item.id}
              iconLeft={item.iconLeft}
              text={item.text}
              href={item.href}
              isNew={item.isNew}
              externalLink={item.externalLink}
              disabled={item.disabled}
              active={item.active}
              collapsed={displayNavCadre}
              onPress={item.onPress}
            />
          ))}
          {hiddenMilitantNavItems.length > 0 && (
            <NavItem
              iconLeft={Ellipsis}
              text="Plus"
              collapsed={displayNavCadre}
              dropdownVerticalPosition="top"
              subItems={militantPlusSubItems}
              active={hiddenMilitantNavItems.some(item => item.active)}
            />
          )}
          {hasExecutiveScopes && (
            <YStack mt={32}>
              <NavItem
                iconLeft={Sparkle}
                frame="cadre"
                active={displayNavCadre}
                text="CADRE"
                collapsed={displayNavCadre}
                iconRight={ChevronRight}
                theme="purple"
                isNew
                onPress={() => {
                  setDisplayNavCadre(!displayNavCadre)
                }}
              />
            </YStack>
          )}
        </MenuContainer>
        <MenuFooterContainer collapsed={displayNavCadre}>
          {isAuth ? (
            <>
              {/** TODO: Add back when we have email subscription
              <NavItem iconLeft={BellOff} text="Abonnement emails" dangerAccent collapsed={displayNavCadre} />
              */}
              {notificationGranted === false && (
                <NavItem
                  iconLeft={BellOff}
                  text="Notifications"
                  dangerAccent
                  collapsed={displayNavCadre}
                  onPress={triggerNotificationRequest}
                />
              )}
              <NavItem
                text="Mon profil"
                profilePicture={{
                  src: user?.image_url ?? undefined,
                  alt: 'Mon profil',
                  fullName: user ? `${user.first_name} ${user.last_name}` : 'John Doe',
                }}
                collapsed={displayNavCadre}
                href="/(militant)/profil"
                active={isNavItemActive(pathname, '/(militant)/profil')}
              />
            </>
          ) : (
            <YStack gap={24} p={12} >
              <YStack gap={16}>
                <Text.MD semibold textWrap="balance">
                  Je me connecte à <Text.MD semibold color="$blue5">mon espace</Text.MD>
                </Text.MD>
                <VoxButton
                  variant="outlined"
                  size="lg"
                  width="100%"
                  theme="blue"
                  onPress={() => signIn()}
                >
                  Me connecter
                </VoxButton>
              </YStack>

              <YStack gap={16}>
                <Text.MD semibold textWrap="balance">
                  Adhérez pour débloquer <Text.MD semibold color="$yellow5">tous les contenus et fonctionnalités</Text.MD>
                </Text.MD>
                
                <YStack gap={8}>
                  <XStack gap={8} alignItems="center">
                    <CircleCheckBig size={16} color="$green4" />
                    <Text.SM medium>Carte adhérent</Text.SM>
                  </XStack>
                  <XStack gap={8} alignItems="center">
                    <CircleCheckBig size={16} color="$green4" />
                    <Text.SM medium>Comités locaux</Text.SM>
                  </XStack>
                  <XStack gap={8} alignItems="center">
                    <CircleCheckBig size={16} color="$green4" />
                    <Text.SM medium>Événements exclusifs</Text.SM>
                  </XStack>
                  <XStack gap={8} alignItems="center">
                    <CircleCheckBig size={16} color="$green4" />
                    <Text.SM medium>Consultations</Text.SM>
                  </XStack>
                  <XStack gap={8} alignItems="center">
                    <CircleCheckBig size={16} color="$green4" />
                    <Text.SM medium>Élections internes</Text.SM>
                  </XStack>
                </YStack>

                <VoxButton
                  variant="contained"
                  size="lg"
                  width="100%"
                  theme="yellow"
                  onPress={() => signUp()}
                >
                  J'adhère
                </VoxButton>
              </YStack>
            </YStack>
          )}
        </MenuFooterContainer>
      </SideBarContainer>
      <SideBarContainer
        isCadre
        hasBoxShadow={state !== 'cadre'}
        display={displayNavCadre ? 'flex' : 'none'}
      >
        <LogoContainer pb={0} pt={14}>
          <CadreIllustration showIcon={false} />
        </LogoContainer>
        <YStack>
          <ScopeSelector />
        </YStack>
        <MenuContainer onLayout={onCadreMenuLayout}>
          <YStack gap={4}>
            <Line />
            {visibleCadreNavItems.map((item) => (
              <NavItem
                key={item.id}
                iconLeft={item.iconLeft}
                text={item.text}
                theme={item.theme}
                href={item.href}
                isNew={item.isNew}
                externalLink={item.externalLink}
                disabled={item.disabled}
                active={item.active}
                onPress={item.onPress}
              />
            ))}
            {hiddenCadreNavItems.length > 0 && (
              <NavItem
                iconLeft={Ellipsis}
                text="Plus"
                theme="purple"
                dropdownVerticalPosition="top"
                subItems={cadrePlusSubItems}
                active={hiddenCadreNavItems.some(item => item.active)}
              />
            )}
          </YStack>

        </MenuContainer>
        <MenuFooterContainer>
          <FeaturebaseFooterItems variant="navItem" />
        </MenuFooterContainer>
      </SideBarContainer>
    </SideBarArea>
  )
}