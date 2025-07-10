import { NamedExoticComponent } from 'react'
import { VoxHeader } from '@/components/Header/Header'
import type { IconProps } from '@tamagui/helpers-icon'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useNavigation, useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'

type ProfilHeaderProps = {
  icon?: NamedExoticComponent<IconProps>
  title: string
  backArrow?: boolean
  hideOnMdUp?: boolean
}

const ProfilHeader = ({ icon, title, backArrow = true, hideOnMdUp = true }: ProfilHeaderProps) => {
  const router = useRouter()
  const navigation = useNavigation()
  const { gtSm } = useMedia()

  const handleBack = () => {
    if (navigation.canGoBack?.()) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <VoxHeader
      backgroundColor="white"
      {...(hideOnMdUp ? { $gtMd: { display: 'none' } } : {})}
    >
      <YStack flex={1} position="relative" minHeight={48}>
        <XStack position="absolute" left={0} top={0} bottom={0} zIndex={1}>
          {backArrow ? (
            <VoxHeader.LeftButton 
              icon={ArrowLeft} 
              onPress={handleBack}
              backTitle={gtSm ? 'Retour' : undefined}
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
