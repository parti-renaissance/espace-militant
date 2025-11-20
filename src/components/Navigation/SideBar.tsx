import { ComponentProps, useState, useMemo } from "react"
import { styled, YStack, XStack } from "tamagui"
import { ClipboardCheck, Calendar, Home, Link, HeartHandshake, Zap, GraduationCap, BellOff, CaptionsOff, ChevronRight, Sparkle, ScrollText, Flag, Users, Network, Goal, Vote, RefreshCcw, CircleHelp, LifeBuoy, FileText, Settings, Ellipsis } from "@tamagui/lucide-icons"
import EuCampaignIllustration from "@/assets/illustrations/EuCampaignIllustration"
import { NavItem } from "./NavItem"
import { ScopeSelector } from "./ScopeSelector"
import Text from "../base/Text"
import type { NavItemSubItem } from "./NavItemDropdown"
import { useVisibleNavItems } from "./useVisibleNavItems"
import { usePathname } from "expo-router"
import type { Href } from "expo-router"

export const WIDTH_MILITANT = 248;
export const WIDTH_COLLAPSED = 58;
export const MARGINS = {
  small: 8,
  medium: 12,
  large: 16,
};


export type SideBarState = 'floating' | 'militant' | 'collapsed' | 'cadre'

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
    },
  },
  defaultVariants: {
    state: 'militant',
  },
})

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
  height: 44 * 7,
  width: 1,
  backgroundColor: '$purple3',
  position: 'absolute',
  left: 20,
  top: -16,
})

interface SideBarProps {
  state?: SideBarState
}

export type NavItemConfig = {
  id: string
  iconLeft: typeof Home
  text: string
  href?: ComponentProps<typeof NavItem>['href']
  isNew?: boolean
  externalLink?: boolean
  disabled?: boolean
  active?: boolean
  onPress?: () => void
  theme?: 'blue' | 'purple' | 'green' | 'orange'
  frame?: 'default' | 'cadre'
}

import { cadreNavItems, militantNavItems } from "@/config/navigationItems"

export const SideBar = ({ state = 'militant' }: SideBarProps) => {
  const pathname = usePathname()
  const [displayNavCadre, setDisplayNavCadre] = useState(state === 'cadre')
  const [selectedScope, setSelectedScope] = useState<{ id: string; name: string; role?: string } | undefined>({
    id: 'scope-92',
    name: 'Assemblée - Hauts-de-Seine (92)',
    role: 'Responsable communication',
  })
  
  // Helper pour déterminer si un item est actif
  const isItemActive = useMemo(() => {
    return (item: NavItemConfig) => {
      if (!item.href) return false
      const normalizedPathname = pathname.replace(/\/$/, '') || '/'
      const normalizedHref = item.href.replace(/\/$/, '') || '/'
      return normalizedHref === normalizedPathname
    }
  }, [pathname])

  // Ajouter la propriété active aux items militant
  const militantNavItemsWithActive = useMemo(() => {
    return militantNavItems.map(item => ({
      ...item,
      active: isItemActive(item),
    }))
  }, [isItemActive])

  // Ajouter la propriété active aux items cadre
  const cadreNavItemsWithActive = useMemo(() => {
    return cadreNavItems.map(item => ({
      ...item,
      active: isItemActive(item),
    }))
  }, [isItemActive])
  
  // Utiliser le hook pour gérer la visibilité des items du menu militant
  const {
    visibleItems: visibleMilitantNavItems,
    hiddenItems: hiddenMilitantNavItems,
    onLayout: onMilitantMenuLayout,
  } = useVisibleNavItems<NavItemConfig>({
    items: militantNavItemsWithActive,
    hasCadreButton: true,
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
        />
      )
    }))

  const cadrePlusSubItems: NavItemSubItem[] =  hiddenCadreNavItems.map((item) => ({
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
            />
          )}
          <YStack mt={32}>
            <NavItem iconLeft={Sparkle} frame="cadre" active={displayNavCadre} text="CADRE" collapsed={displayNavCadre} iconRight={ChevronRight} theme="purple" isNew onPress={() => {
              setDisplayNavCadre(!displayNavCadre);
            }} />
          </YStack>
        </MenuContainer>
        <MenuFooterContainer collapsed={displayNavCadre}>
          <NavItem iconLeft={BellOff} text="Abonnement emails" dangerAccent collapsed={displayNavCadre} />
          <NavItem iconLeft={CaptionsOff} text="Notifications mobile" dangerAccent collapsed={displayNavCadre} />
          <NavItem
            text="Mon profil"
            profilePicture={{ src: 'https://staging-utilisateur.parti-renaissance.fr/assets/images/profile/2b332ff46df16603e15449a9a2da0dcf.webp', alt: 'Mon profil', fullName: 'John Doe' }}
            collapsed={displayNavCadre}
          />
        </MenuFooterContainer>
      </SideBarContainer>
      {
        displayNavCadre && (
          <SideBarContainer isCadre>
            <LogoContainer >
              <Text fontSize={20} medium>CADRE</Text>
            </LogoContainer>
            <YStack>
              <ScopeSelector
                scopes={[
                  {
                    id: 'scope-92',
                    name: 'Assemblée - Hauts-de-Seine (92)',
                    role: 'Responsable communication',
                  },
                  {
                    id: 'scope-75',
                    name: 'Hauts-de-Seine (92-3)',
                    role: 'Délégué de circonscription',
                  },
                  {
                    id: 'scope-13',
                    name: 'La Garenne-Colombes',
                    role: 'Responsable comité local',
                  },
                ]}
                selectedScope={selectedScope}
                onScopeSelect={(scope) => {
                  setSelectedScope(scope)
                  console.log('Scope sélectionné:', scope)
                }}
              />
            </YStack>
            <MenuContainer onLayout={onCadreMenuLayout}>
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
                />
              ))}
              {hiddenCadreNavItems.length > 0 && (
                <NavItem
                  iconLeft={Ellipsis}
                  text="Plus"
                  theme="purple"
                  dropdownVerticalPosition="top"
                  subItems={cadrePlusSubItems}
                />
              )}
            </MenuContainer>
            <MenuFooterContainer>
              <NavItem iconLeft={RefreshCcw} text="Dernières mises à jour" theme="purple" />
              <NavItem iconLeft={CircleHelp} text="Demande de retours" theme="purple" />
              <NavItem iconLeft={LifeBuoy} text="Centre d'aide" theme="purple" />
            </MenuFooterContainer>
          </SideBarContainer>
        )
      }
    </SideBarArea>
  )
}