import React from 'react'
import { Platform, SafeAreaView as RNSafeAreaView, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { ROUTES } from '@/config/routes'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import type { IconProps } from '@tamagui/helpers-icon'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Link, router, usePathname, useSegments } from 'expo-router'
import { capitalize } from 'lodash'
import { isWeb, Spinner, Stack, styled, ThemeableStack, useMedia, useStyle, View, ViewProps, withStaticProperties, XStack, YStack, YStackProps } from 'tamagui'
import Text from '../base/Text'
import { SignInButton, SignUpButton } from '../Buttons/AuthButton'
import Container from '../layouts/Container'
import ProfilePicture from '../ProfilePicture'
import AuthFallbackWrapper from '../Skeleton/AuthFallbackWrapper'

const ButtonNav = styled(ThemeableStack, {
  tag: 'button',
  backgroundColor: 'transparent',
  animation: 'quick',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  gap: 6,
  borderRadius: 999,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: 'transparent',
  height: 32,
  hoverStyle: {
    backgroundColor: '$color1',
  },
  focusable: true,
  focusStyle: {
    backgroundColor: '$color1',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$color1',
      },
    },
  },
})

const NavItem = (props: { route: (typeof ROUTES)[number]; isActive: boolean }) => {
  const [isHover, setIsHover] = React.useState(false)
  const activeColor = (props.isActive || isHover) && props.route.theme !== 'gray' ? '$color5' : '$textPrimary'
  const path = props.route.name === '(home)' ? '/' : (`/${props.route.name}` as const)
  return (
    <Link href={path} asChild={!isWeb} key={props.route.name}>
      <ButtonNav onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} theme={props.route.theme} active={props.isActive}>
        <props.route.icon color={activeColor} size={16} active={[props.isActive, isHover].some(Boolean)} />

        <Text.MD color={activeColor} fontWeight={'500'}>
          {props.route.screenName}
        </Text.MD>
      </ButtonNav>
    </Link>
  )
}

const MemoizedNavItem = React.memo(NavItem)

export const NavBar = () => {
  const pathname = usePathname()
  const { gtSm } = useMedia()
  const { session } = useSession()
  if (!session) return null
  return gtSm ? (
    <XStack gap={24}>
      {ROUTES.filter((x) => !x.hidden).map((route) => {
        const isIndex = route.name === '(home)'
        const focused = pathname.includes(route.name) || (isIndex && pathname === '/')
        return <MemoizedNavItem key={route.name} route={route} isActive={focused} />
      })}
    </XStack>
  ) : null
}

export const ProfileView = () => {
  const { session } = useSession()
  const user = useGetProfil({ enabled: !!session })
  const profile = user?.data
  return (
    <View flexDirection="row" gap={'$medium'} justifyContent="space-between" alignItems="center">
      {!user.isLoading ? (
        <>
          <Stack gap={4} flexDirection="column" alignContent="flex-end" alignItems="flex-end" display="none" $gtMd={{ display: 'flex' }}>
            <Text fontFamily={'$PublicSans'} color="$textPrimary" fontWeight={'500'} fontSize={14}>
              {profile?.first_name} {profile?.last_name}
            </Text>
          </Stack>
          <ProfilePicture
            fullName={`${profile?.first_name} ${profile?.last_name}`}
            src={profile?.image_url ?? undefined}
            alt="profile picture"
            size="$3"
            rounded
          />
        </>
      ) : (
        <Spinner size="small" />
      )}
    </View>
  )
}
const LoginView = () => (
  <View flexDirection="row" gap={'$medium'} justifyContent="space-between" alignItems="center">
    <Stack gap={'$medium'} flexDirection="row">
      <SignInButton />
      <SignUpButton />
    </Stack>
  </View>
)

export const ProfileNav = (props: ViewProps) => {
  return (
    <AuthFallbackWrapper fallback={<LoginView />}>
      <XStack {...props}>
        <Link href="/profil">
          <View>
            <ProfileView />
          </View>
        </Link>
      </XStack>
    </AuthFallbackWrapper>
  )
}

const Header = (_props: NativeStackHeaderProps & YStackProps) => {
  const { options, navigation, back, ...props } = _props
  const media = useMedia()
  const segments = useSegments()

  const BackBtn = () => (
    <Stack justifyContent="center" alignItems="center">
      <TouchableWithoutFeedback onPress={() => (navigation.canGoBack() ? navigation.goBack() : router.navigate('/'))}>
        <XStack gap={'$medium'} alignItems="center" cursor="pointer">
          <View flexDirection="row" gap={'$medium'} alignItems="center">
            <ArrowLeft color="$textPrimary" />
          </View>
          <Text fontSize="$4" fontWeight="$6">
            {back?.title ?? 'Retour'}
          </Text>
        </XStack>
      </TouchableWithoutFeedback>
    </Stack>
  )

  const LeftNav = () => {
    if (options.headerLeft) return options.headerLeft({ label: back?.title, canGoBack: navigation.canGoBack() })

    if (navigation.canGoBack() && segments.includes('(tabs)') ? navigation.getState().index > 0 : true) {
      return <BackBtn key={segments.join('')} />
    }

    return media.gtSm && isWeb ? (
      <Link href="/" asChild>
        <View cursor="pointer">
          <EuCampaignIllustration />
        </View>
      </Link>
    ) : (
      <Text fontSize="$4" fontWeight="$6">
        {capitalize(options.title)}
      </Text>
    )
  }
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <Container
        borderBottomWidth={options.headerShadowVisible === undefined ? 1 : undefined}
        borderBottomColor="rgba(145, 158, 171, 0.2)"
        paddingHorizontal={'$medium'}
        height={82}
        {...props}
        alignContent="center"
      >
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" flex={1}>
          <LeftNav />
          {!(navigation.canGoBack() && navigation.getState().index > 0) && <NavBar />}
          {options.headerRight ? options.headerRight({ canGoBack: navigation.canGoBack() }) : <ProfileNav />}
        </Stack>
      </Container>
    </SafeAreaView>
  )
}

export const SmallHeader: typeof Header = (props) => {
  const media = useMedia()
  return <Header {...props} height={media.gtSm ? 82 : 52} />
}

export default Header

export const VoxHeaderFrameStyled = styled(ThemeableStack, {
  gap: 4,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  height: 56,
})

const VoxHeaderContainerStyled = styled(Container, {
  borderBottomWidth: 1,
  borderBottomColor: '$textOutline',

  $md: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  $gtMd: {
    paddingHorizontal: 18,
  },
})

const Wrapper = React.memo(
  ({ children, backgroundColor, safeAreaView = true }: { children: React.ReactNode; backgroundColor: string; safeAreaView?: boolean }) => {
    return safeAreaView ? (
      <SafeAreaView edges={['top']} style={{ backgroundColor }}>
        {children}
      </SafeAreaView>
    ) : (
      <YStack style={{ backgroundColor }}>{children}</YStack>
    )
  },
)

const VoxHeaderFrameRouter = ({
  safeAreaView = true,
  borderWidth,
  ...props
}: React.ComponentProps<typeof VoxHeaderFrameStyled> & { safeAreaView?: boolean }) => {
  const styles = useStyle(props)
  const backgroundColor = (styles.backgroundColor as string) ?? 'white'
  const insets = useSafeAreaInsets()
  const height = safeAreaView ? insets.top + 56 : 56

  return (
    <VoxHeaderContainerStyled
      height={height}
      style={{ paddingTop: safeAreaView ? insets.top : 0, zIndex: 5 }}
      backgroundColor={backgroundColor}
      borderWidth={borderWidth}
    >
      <VoxHeaderFrameStyled {...props} />
    </VoxHeaderContainerStyled>
  )
}

const VoxHeaderFrameModal = (props: React.ComponentProps<typeof VoxHeaderFrameStyled>) => {
  const SAV = Platform.OS !== 'ios' ? SafeAreaView : RNSafeAreaView
  const SAVProps: any = Platform.OS !== 'ios' ? { edges: ['top'] } : {}
  return (
    <SAV style={{ backgroundColor: 'white' }} {...SAVProps}>
      <VoxHeaderContainerStyled>
        <VoxHeaderFrameStyled {...props} />
      </VoxHeaderContainerStyled>
    </SAV>
  )
}

const VoxHeaderLeftButtonFrame = styled(ThemeableStack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  $md: {
    minWidth: 36,
    // height: 36,
  },
})

const VoxHeaderLeftButton = (
  props: React.ComponentProps<typeof VoxHeaderLeftButtonFrame> & { icon?: React.NamedExoticComponent<IconProps>; backTitle?: string },
) => (
  <VoxHeaderLeftButtonFrame {...props} height="100%">
    {props.icon ? <props.icon size={24} color="$textPrimary" /> : null}
    {!!props.backTitle && <Text.LG semibold>{props.backTitle}</Text.LG>}
  </VoxHeaderLeftButtonFrame>
)

const VoxHeaderTitle = (props: { children: string; icon?: React.NamedExoticComponent<IconProps> }) => {
  return (
    <XStack alignItems="center" gap={10}>
      {props.icon ? <props.icon size={20} color="$textPrimary" /> : null}
      <Text.LG semibold>{props.children}</Text.LG>
    </XStack>
  )
}

export const VoxHeader = withStaticProperties(VoxHeaderFrameRouter, {
  ModalFrame: VoxHeaderFrameModal,
  NoSafeFrame: VoxHeaderContainerStyled,
  LeftButtonFrame: VoxHeaderLeftButtonFrame,
  LeftButton: VoxHeaderLeftButton,
  Title: VoxHeaderTitle,
})
