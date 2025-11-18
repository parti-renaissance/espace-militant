import { useState } from "react"
import { styled, YStack, XStack } from "tamagui"
import { ClipboardCheck, Calendar, Home, Link, HeartHandshake, Zap, GraduationCap, BellOff, CaptionsOff, ChevronRight, Sparkle, ScrollText, Flag, Users, Network, Goal, Vote, RefreshCcw, CircleHelp, LifeBuoy, FileText, Settings, Ellipsis } from "@tamagui/lucide-icons"
import EuCampaignIllustration from "@/assets/illustrations/EuCampaignIllustration"
import { NavItem } from "./NavItem"
import { ScopeSelector } from "./ScopeSelector"
import Text from "../base/Text"

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

const MenuItem = styled(XStack, {
  height: 40,
  backgroundColor: 'yellow',
})

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

export const SideBar = ({ state = 'militant' }: SideBarProps) => {
  const [displayNavCadre, setDisplayNavCadre] = useState(state === 'cadre')
  const [selectedScope, setSelectedScope] = useState<{ id: string; name: string; role?: string } | undefined>({
    id: 'scope-92',
    name: 'Assemblée - Hauts-de-Seine (92)',
    role: 'Responsable communication',
  })

  return (
    <SideBarArea state={state}>
      <SideBarContainer collapsed={displayNavCadre} isMilitantInCadreMode={displayNavCadre}>
        <LogoContainer collapsed={displayNavCadre}>
          <EuCampaignIllustration showText={!displayNavCadre} />
        </LogoContainer>
        <MenuContainer collapsed={displayNavCadre}>
          <NavItem iconLeft={Home} text="Accueil" active={!displayNavCadre} collapsed={displayNavCadre} href="/" />
          <NavItem iconLeft={Calendar} text="Événements" collapsed={displayNavCadre} href="/tools/test" />
          <NavItem iconLeft={Zap} text="Actions" collapsed={displayNavCadre} href="/tools/test" />
          <NavItem iconLeft={HeartHandshake} text="Parrainages" isNew collapsed={displayNavCadre} href="/tools/test" />
          <NavItem iconLeft={GraduationCap} text="Formations" externalLink collapsed={displayNavCadre} disabled />
          <NavItem iconLeft={Link} text="Ressources" isNew externalLink collapsed={displayNavCadre} href="/tools/test" />
          <NavItem iconLeft={ClipboardCheck} text="Questionnaires" externalLink collapsed={displayNavCadre} href="/tools/test" />
          <NavItem
            iconLeft={Ellipsis}
            text="Plus"
            collapsed={displayNavCadre}
            dropdownVerticalPosition="top"
            subItems={[
              {
                id: 'plus-documents',
                text: 'Documents',
                customContent: (
                  <NavItem
                    text="Documents"
                    iconLeft={FileText}
                    onPress={() => {
                      console.log('Documents sélectionné')
                    }}
                  />
                )
              },
              {
                id: 'plus-parametres',
                text: 'Autres',
                customContent: (
                  <NavItem
                    text="Autres"
                    iconLeft={Settings}
                    isNew
                    onPress={() => {
                      console.log('Autres sélectionné')
                    }}
                  />
                )
              },
            ]}
          />
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
            <MenuContainer>
              <Line />
              <NavItem iconLeft={ScrollText} text="Mes publications" theme="purple" active={displayNavCadre && state === 'cadre'} href="/tools/test/cadre" />
              <NavItem iconLeft={Flag} text="Mes militants" theme="purple" externalLink />
              <NavItem iconLeft={Users} text="Mon équipe" theme="purple" externalLink />
              <NavItem iconLeft={Network} text="Gestion des comités" theme="purple" externalLink />
              <NavItem iconLeft={Goal} disabled text="Gestion des circonscriptions" theme="purple" externalLink />
              <NavItem iconLeft={Vote} text="Votes et consultations" theme="purple" externalLink />
              <NavItem
                iconLeft={Ellipsis}
                text="Plus"
                dropdownVerticalPosition="top"
                subItems={[
                  {
                    id: 'plus-espace-cadre',
                    text: 'Espace cadre',
                    customContent: (
                      <NavItem
                        text="Espace cadre"
                        theme="purple"
                        iconLeft={ScrollText}
                        externalLink
                        onPress={() => {
                          console.log('Espace cadre sélectionné')
                        }}
                      />
                    )
                  },
                  {
                    id: 'plus-parametres',
                    text: 'Autres',
                    customContent: (
                      <NavItem
                        text="Autres"
                        theme="purple"
                        iconLeft={Settings}
                        isNew
                        onPress={() => {
                          console.log('Autres sélectionné')
                        }}
                      />
                    )
                  },
                ]}
              />
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