import { NamedExoticComponent } from 'react'
import { VoxHeader } from '@/components/Header/Header'
import type { IconProps } from '@tamagui/helpers-icon'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useNavigation, useRouter } from 'expo-router'

type ProfilHeaderProps = {
  icon?: NamedExoticComponent<IconProps>
  title: string
  backArrow?: boolean
  hideOnMdUp?: boolean
}

const ProfilHeader = ({ icon, title, backArrow = true, hideOnMdUp = true }: ProfilHeaderProps) => {
  const router = useRouter()
  const navigation = useNavigation()

  const handleBack = () => {
    if (navigation.canGoBack?.()) {
      router.back()
    } else {
      router.push('/profil')
    }
  }

  return (
    <VoxHeader
      justifyContent="space-between"
      backgroundColor="white"
      {...(hideOnMdUp ? { $gtMd: { display: 'none' } } : {})}
    >
      {backArrow ? (
        <VoxHeader.LeftButton icon={ArrowLeft} onPress={handleBack} />
      ) : (
        <VoxHeader.LeftButton opacity={0} icon={ArrowLeft} />
      )}
      <VoxHeader.Title icon={icon}>{title}</VoxHeader.Title>
      <VoxHeader.LeftButton opacity={0} icon={ArrowLeft} />
    </VoxHeader>
  )
}

export default ProfilHeader
