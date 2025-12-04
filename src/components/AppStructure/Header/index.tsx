import React from 'react'
import { Href, useNavigation, useRouter } from 'expo-router'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Media, styled, ThemeableStack, useMedia, XStack, YStack } from 'tamagui'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { IconComponent } from '@/models/common.model'
import Text from '@/components/base/Text'

type NavigationConfig = {
  showBackButton?: boolean
  backButtonLabel?: string
  fallbackPath?: Href
  forcedPath?: Href
}

type StyleConfig = {
  backgroundColor?: string
  showOn?: keyof Media | 'always'
  withoutBorder?: boolean
}

type HeaderProps = {
  title: string
  icon?: IconComponent
  navigation?: NavigationConfig
  style?: StyleConfig
  children?: React.ReactNode
}

const DEFAULT_NAVIGATION: Required<NavigationConfig> = {
  showBackButton: true,
  backButtonLabel: '',
  fallbackPath: '/',
  forcedPath: '' as Href,
}

const DEFAULT_STYLE: Required<StyleConfig> = {
  backgroundColor: 'white',
  showOn: 'sm',
  withoutBorder: false,
}

// Styled Components avec Tamagui uniquement
const HeaderFrame = styled(ThemeableStack, {
  gap: 4,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  height: 56,
})

const HeaderContainer = styled(YStack, {
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '$textOutline',

  variants: {
    withoutBorder: {
      true: {
        borderBottomWidth: 0,
      },
    },
  },

  $md: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  $gtMd: {
    paddingHorizontal: 18,
  },
})

const HeaderInner = styled(YStack, {
  maxWidth: 1280,
  width: '100%',
  flexGrow: 1,
  marginHorizontal: 'auto',
})

const LeftButtonFrame = styled(ThemeableStack, {
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
  gap: 8,
  $md: {
    minWidth: 36,
  },
})

const useBackNavigation = (config: NavigationConfig) => {
  const router = useRouter()
  const navigation = useNavigation()
  const { forcedPath, fallbackPath = '/' } = config

  const handleBack = () => {
    if (forcedPath) {
      router.push(forcedPath)
      return
    }

    if (navigation.canGoBack?.()) {
      router.back()
      return
    }

    router.push(fallbackPath)
  }

  return { handleBack }
}

const useBackButtonLabel = (customLabel?: string, isDesktop?: boolean): string | undefined => {
  if (customLabel) return customLabel
  if (isDesktop) return 'Retour'
  return undefined
}

const Header = ({
  title,
  icon,
  navigation: navigationConfig = {},
  style: styleConfig = {},
  children,
}: HeaderProps) => {
  const media = useMedia()

  const navigationSettings = { ...DEFAULT_NAVIGATION, ...navigationConfig }
  const styleSettings = { ...DEFAULT_STYLE, ...styleConfig }

  const { handleBack } = useBackNavigation(navigationSettings)
  const backButtonLabel = useBackButtonLabel(navigationSettings.backButtonLabel, media.gtSm)

  const headerDisplay = styleSettings.showOn === 'always' ? undefined : (media[styleSettings.showOn] ? undefined : 'none')
  const borderWidth = styleSettings.withoutBorder ? 0 : undefined

  const insets = useSafeAreaInsets()
  const backgroundColor = styleSettings.backgroundColor
  const isWeb = Platform.OS === 'web'
  const height = isWeb ? undefined : insets.top + 56

  return (
    <HeaderContainer
      height={height}
      style={isWeb ? undefined : { paddingTop: insets.top, zIndex: 5 }}
      backgroundColor={backgroundColor}
      borderWidth={borderWidth}
      display={headerDisplay}
    >
      <HeaderInner>
        <HeaderFrame>
          {children ?? (
            <YStack flex={1} position="relative" minHeight={48} maxHeight={58}>
              <XStack position="absolute" left={0} top={0} bottom={0} zIndex={1}>
                {navigationSettings.showBackButton && (
                  <LeftButtonFrame onPress={handleBack} height="100%">
                    <ArrowLeft size={24} color="$textPrimary" />
                    {backButtonLabel ? <Text.LG semibold>{backButtonLabel}</Text.LG> : null}
                  </LeftButtonFrame>
                )}
              </XStack>

              <XStack flex={1} justifyContent="center" alignItems="center">
                <XStack alignItems="center" gap={10}>
                  {icon && React.createElement(icon, { size: 20, color: '$textPrimary' })}
                  <Text.LG semibold>{title}</Text.LG>
                </XStack>
              </XStack>
            </YStack>
          )}
        </HeaderFrame>
      </HeaderInner>
    </HeaderContainer>
  )
}

export default Header
