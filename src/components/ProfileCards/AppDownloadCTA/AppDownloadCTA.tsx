import { useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import { ProfileCallToActionLayout } from '@/components/ProfileCards/ProfileCallToActionLayout/ProfileCallToActionLayout'
import redirectToStore from '@/helpers/redirectToStore'
import { Image, View } from 'tamagui'

export interface AppDownloadCTAProps {
  variant?: 'date' | 'screenshots'
}

export default function AppDownloadCTA({ variant = 'date' }: AppDownloadCTAProps) {
  const redirectToApple = useCallback(() => redirectToStore('ios'), [])
  const redirectToAndroid = useCallback(() => redirectToStore('android'), [])

  const isDateVariant = variant === 'date'

  return (
    <ProfileCallToActionLayout>
      <ProfileCallToActionLayout.Image
        source={isDateVariant ? require('./Assets/downloadCTA.png') : require('./Assets/screenshots.png')}
        height={isDateVariant ? 120 : 220}
      />
      <ProfileCallToActionLayout.Content>
        <Text fontWeight={'$7'} textAlign={'center'} mb={isDateVariant ? undefined : '$medium'}>
          {isDateVariant
            ? 'Gardez le parti à portée de main avec l’application mobile.'
            : 'Les Questionnaires et le Porte à porte sont pour le moment réservées à notre application mobile.'}
        </Text>

        {!isDateVariant && (
          <Text fontWeight={'$4'} textAlign={'center'}>
            Téléchargez-là pour profiter de toutes les fonctionnalités !
          </Text>
        )}
      </ProfileCallToActionLayout.Content>
      <ProfileCallToActionLayout.Actions>
        <View flexDirection={'row'} flex={1} justifyContent={'center'} gap={'$medium'}>
          <TouchableOpacity onPress={redirectToApple}>
            <Image source={require('./Assets/Apple.png')} resizeMode={'contain'} width={115} height={40} />
          </TouchableOpacity>

          <TouchableOpacity onPress={redirectToAndroid}>
            <Image source={require('./Assets/Google.png')} resizeMode={'contain'} width={115} height={40} />
          </TouchableOpacity>
        </View>
      </ProfileCallToActionLayout.Actions>
    </ProfileCallToActionLayout>
  )
}
