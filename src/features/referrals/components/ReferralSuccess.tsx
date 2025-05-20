import React from 'react'
import Text from '@/components/base/Text'
import { Image, YStack } from 'tamagui'
import Button from '../../../components/Button'

interface Props {
  onClose?: () => void
  name: string
}

export default function ReferralSuccess({ onClose, name }: Props) {
  return (
    <YStack gap={'$medium'} paddingHorizontal={'$medium'} paddingBottom={'$12'} paddingTop={'$10'} alignItems={'center'} maxWidth={480}>
      <Image source={require('@/assets/illustrations/sent.png')} />
      <Text.LG bold textAlign={'center'}>
        Et hop,{'\n'}une invitation envoyée à {name} !
      </Text.LG>
      <Text textAlign={'center'}>Dans quelques minutes, il lui sera possible d’adhérer depuis un lien contenu dans l’email.</Text>
      <Text textAlign={'center'}>Il lui sera également possible de signaler une invitation non sollicitée.</Text>

      <Button theme="orange" size="xl" onPress={onClose} alignSelf={'center'}>
        <Button.Text color="$white1" bold>
          Fermer
        </Button.Text>
      </Button>
    </YStack>
  )
}
