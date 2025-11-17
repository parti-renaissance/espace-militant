import EuCampaignIllustration from "@/assets/illustrations/EuCampaignIllustration"
import { styled, YStack, XStack } from "tamagui"
import { NavItem } from "./NavItem"
import { ClipboardCheck, Calendar, Home, Link, HeartHandshake, Zap, GraduationCap, BellOff, CaptionsOff, ChevronRight, Sparkle, ScrollText, Flag, Users, Network, Goal, Vote, RefreshCcw, CircleHelp, LifeBuoy } from "@tamagui/lucide-icons"
import { useState } from "react"
import Text from "../base/Text"

const SideBarWrapper = styled(XStack, {
  position: 'relative',
  zIndex: 100,
  justifyContent: 'flex-start',
  $lg: {
    width: 248 + 8,
  },
  $xl: {
    width: 248 + 12,
  },
  width: 248 + 16,
})

const SideBarContainer = styled(YStack, {
  $lg: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
  },
  $xl: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  marginTop: 16,
  marginBottom: 16,
  marginLeft: 16,

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
  width: 248,
  justifyContent: 'space-between',
  gap: 16,
  variants: {
    collapsed: {
      true: {
        width: 58,
        alignItems: 'center',
      },
    },
  },
} as const)

const LogoContainer = styled(YStack, {
  paddingHorizontal: 8,
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
  height: 44 * 6,
  width: 1,
  backgroundColor: '$purple3',
  position: 'absolute',
  left: 20,
  top: -12,
})

export const SideBar = () => {
  const [displayNavCadre, setDisplayNavCadre] = useState(false)

  return (
    <SideBarWrapper>
      <SideBarContainer collapsed={displayNavCadre}>
        <LogoContainer collapsed={displayNavCadre}>
          <EuCampaignIllustration showText={!displayNavCadre} />
        </LogoContainer>
        <MenuContainer collapsed={displayNavCadre}>
          <NavItem iconLeft={Home} text="Accueil" active={!displayNavCadre} collapsed={displayNavCadre} href="/" />
          <NavItem iconLeft={Calendar} text="Événements" collapsed={displayNavCadre} />
          <NavItem iconLeft={Zap} text="Actions" collapsed={displayNavCadre} />
          <NavItem iconLeft={HeartHandshake} text="Parrainages" isNew collapsed={displayNavCadre} />
          <NavItem iconLeft={GraduationCap} text="Formations" externalLink collapsed={displayNavCadre} disabled />
          <NavItem iconLeft={Link} text="Ressources" isNew externalLink collapsed={displayNavCadre} />
          <NavItem iconLeft={ClipboardCheck} text="Questionnaires" externalLink collapsed={displayNavCadre} />
          <YStack mt={32}>
            <NavItem iconLeft={Sparkle} text="CADRE" outlined collapsed={displayNavCadre} iconRight={ChevronRight} theme="purple" isNew onPress={() => {
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
          <SideBarContainer>
            <LogoContainer >
              <Text fontSize={20} medium>CADRE</Text>
            </LogoContainer>
            <YStack>

            </YStack>
            <MenuContainer>
              <Line/>
              <NavItem iconLeft={ScrollText} text="Mes publications" theme="purple" active={displayNavCadre}/>
              <NavItem iconLeft={Flag} text="Mes militants" theme="purple" externalLink />
              <NavItem iconLeft={Users} text="Mon équipe" theme="purple" externalLink />
              <NavItem iconLeft={Network} text="Gestion des comités" theme="purple" externalLink />
              <NavItem iconLeft={Goal} text="Gestion des circonscriptions" theme="purple" externalLink />
              <NavItem iconLeft={Vote} text="Votes et consultations" theme="purple" externalLink />
            </MenuContainer>
            <MenuFooterContainer>
              <NavItem iconLeft={RefreshCcw} text="Dernières mises à jour" theme="purple" />
              <NavItem iconLeft={CircleHelp} text="Demande de retours" theme="purple" />
              <NavItem iconLeft={LifeBuoy} text="Centre d'aide" theme="purple" />
            </MenuFooterContainer>
          </SideBarContainer>
        )
      }
    </SideBarWrapper>
  )
}