import { VoxHeader } from '@/components/Header/Header'
import type { IconComponent } from '@/models/common.model'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Href, useNavigation, useRouter } from 'expo-router'
import { Media, useMedia, XStack, YStack } from 'tamagui'

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
}: HeaderProps) => {
  const media = useMedia()

  const navigationSettings = { ...DEFAULT_NAVIGATION, ...navigationConfig }
  const styleSettings = { ...DEFAULT_STYLE, ...styleConfig }

  const { handleBack } = useBackNavigation(navigationSettings)
  const backButtonLabel = useBackButtonLabel(navigationSettings.backButtonLabel, media.gtSm)

  const headerDisplay = styleSettings.showOn === 'always' ? undefined : (media[styleSettings.showOn] ? undefined : 'none')
  const borderWidth = styleSettings.withoutBorder ? 0 : undefined

  return (
    <VoxHeader
      backgroundColor={styleSettings.backgroundColor}
      display={headerDisplay}
      borderWidth={borderWidth}
    >
      <YStack flex={1} position="relative" minHeight={48} maxHeight={58}>
        <XStack position="absolute" left={0} top={0} bottom={0} zIndex={1}>
          {navigationSettings.showBackButton && (
            <VoxHeader.LeftButton
              icon={ArrowLeft}
              onPress={handleBack}
              backTitle={backButtonLabel}
            />
          )}
        </XStack>

        <XStack flex={1} justifyContent="center" alignItems="center">
          <VoxHeader.Title icon={icon}>{title}</VoxHeader.Title>
        </XStack>
      </YStack>
    </VoxHeader>
  )
}

export default Header
