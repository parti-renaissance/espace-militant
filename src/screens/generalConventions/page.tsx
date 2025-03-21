import React from 'react'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Section from '@/screens/generalConventions/Section'
import { Image, YStack } from 'tamagui'
import type { GeneralConventionScreenProps } from './types'

const GeneralConventionScreen: GeneralConventionScreenProps = () => {
  return (
    <YStack alignItems="center" marginTop={'$space.6'} paddingBottom={'5rem'} gap={16} $gtSm={{ gap: 40 }}>
      <Image source={require('@/assets/illustrations/EtatsGeneraux-hd.png')} objectFit={'contain'} height={140} width={250} />

      <Text.MD fontSize={'$3'} maxWidth={550} textAlign={'center'} fontWeight={600} color="white">
        Consultez l’ensemble des remontées des États généraux faites par nos instances internes : Assemblées départementales, Circonscriptions et Comités
        locaux.
      </Text.MD>

      <BoundarySuspenseWrapper>
        <Section />
      </BoundarySuspenseWrapper>
    </YStack>
  )
}

export default GeneralConventionScreen
