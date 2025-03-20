import React from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import InstanceCard from '@/components/InstanceCard/InstanceCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { HeartHandshake } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import { View, YStack } from 'tamagui'

export default function ReferralLockedCard({ hideHeader }: { hideHeader?: boolean }) {
  const { isPending, open: openAdh } = useOpenExternalContent({ slug: 'adhesion', utm_campaign: 'profil' })

  return (
    <InstanceCard title="Parrainages" icon={HeartHandshake} hideHeader={hideHeader}>
      <YStack alignItems={'center'} gap={'$8'} justifyContent={'center'}>
        <View margin={'$8'}>
          <Image source={require('@/assets/illustrations/VisuCadnas.png')} contentFit={'contain'} style={{ height: 153, width: 88 }} />
        </View>

        <Text bold>Les parrainages sont réservés aux adhérents. Adhérez pour y participer.</Text>

        <VoxButton theme="yellow" size="lg" disabled={isPending} onPress={openAdh()} alignSelf={'center'}>
          J’adhère
        </VoxButton>
      </YStack>
    </InstanceCard>
  )
}
