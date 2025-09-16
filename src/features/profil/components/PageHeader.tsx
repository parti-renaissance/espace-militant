import { VoxHeader } from '@/components/Header/Header'
import type { IconComponent } from '@/models/common.model'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Href, useNavigation, useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'

type ProfilHeaderProps = {
  icon?: IconComponent
  title: string
  backArrow?: boolean
  hideOnMdUp?: boolean
  forcedBackTitle?: string
  backgroundColor?: string
  backPath?: Href
  forcedBackPath?: Href
}

const ProfilHeader = ({ icon, title, backArrow = true, hideOnMdUp = true, forcedBackTitle, backgroundColor = 'white', backPath = '/', forcedBackPath }: ProfilHeaderProps) => {
  const router = useRouter()
  const navigation = useNavigation()
  const { gtSm } = useMedia()

  const handleBack = () => {
    if (forcedBackPath) {
      router.push(forcedBackPath)
      return
    } else if (navigation.canGoBack?.()) {
      router.back()
    } else {
      router.push(backPath)
    }
  }

  return (
    <VoxHeader
      backgroundColor={backgroundColor}
      display={hideOnMdUp ? (gtSm ? 'none' : undefined) : undefined}
    >
      <YStack flex={1} position="relative" minHeight={48}>
        <XStack position="absolute" left={0} top={0} bottom={0} zIndex={1}>
          {backArrow ? (
            <VoxHeader.LeftButton 
              icon={ArrowLeft} 
              onPress={handleBack}
              backTitle={forcedBackTitle ? forcedBackTitle : (gtSm ? 'Retour' : undefined)}
            />
          ) : null }
        </XStack>
        <XStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$large">
          <VoxHeader.Title icon={icon}>{title}</VoxHeader.Title>
        </XStack>
      </YStack>
    </VoxHeader>
  )
}

export default ProfilHeader
