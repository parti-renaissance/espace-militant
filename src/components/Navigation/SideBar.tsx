import EuCampaignIllustration from "@/assets/illustrations/EuCampaignIllustration"
import { styled, YStack, XStack } from "tamagui"
import { NavItem } from "./NavItem"
import { ClipboardCheck, Calendar, Home, Link, HeartHandshake, Zap, GraduationCap, BellOff, CaptionsOff, ChevronRight, Sparkle } from "@tamagui/lucide-icons"

const SideBarWrapper = styled(XStack, {
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

export const SideBar = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <SideBarWrapper>
      <SideBarContainer collapsed={collapsed}>
        <LogoContainer collapsed={collapsed}>
          <EuCampaignIllustration showText={!collapsed} />
        </LogoContainer>
        <MenuContainer collapsed={collapsed}>
          <NavItem iconLeft={Home} text="Accueil" active collapsed={collapsed} href="/" />
          <NavItem iconLeft={Calendar} text="Événements" collapsed={collapsed} />
          <NavItem iconLeft={Zap} text="Actions" collapsed={collapsed} />
          <NavItem iconLeft={HeartHandshake} text="Parrainages" isNew collapsed={collapsed} />
          <NavItem iconLeft={GraduationCap} text="Formations" externalLink collapsed={collapsed} disabled />
          <NavItem iconLeft={Link} text="Ressources" isNew externalLink collapsed={collapsed} />
          <NavItem iconLeft={ClipboardCheck} text="Questionnaires" externalLink collapsed={collapsed} />
          <YStack mt={32}>
            <NavItem iconLeft={Sparkle} text="CADRE" outlined collapsed={collapsed} iconRight={ChevronRight} theme="purple" isNew onPress={() => {
              console.log('CADRE clicked');
            }} />
          </YStack>
        </MenuContainer>
        <MenuFooterContainer collapsed={collapsed}>
          <NavItem iconLeft={BellOff} text="Abonnement emails" dangerAccent collapsed={collapsed} />
          <NavItem iconLeft={CaptionsOff} text="Notifications Mobile" dangerAccent collapsed={collapsed} />
          <NavItem
            text="Mon profil"
            profilePicture={{ src: 'https://staging-utilisateur.parti-renaissance.fr/assets/images/profile/2b332ff46df16603e15449a9a2da0dcf.webp', alt: 'Mon profil', fullName: 'John Doe' }}
            collapsed={collapsed}
          />
        </MenuFooterContainer>
      </SideBarContainer>
    </SideBarWrapper>
  )
}