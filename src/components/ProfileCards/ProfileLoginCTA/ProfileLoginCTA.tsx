import AuthButton from '@/components/Buttons/AuthButton'
import { ProfileCallToActionLayout } from '@/components/ProfileCards/ProfileCallToActionLayout/ProfileCallToActionLayout'
import { View } from 'tamagui'

import loginCTAImage from './loginCTAImage.png'

export default function ProfileLoginCTA() {
  return (
    <ProfileCallToActionLayout>
      <ProfileCallToActionLayout.Image source={loginCTAImage} height={205} />
      <ProfileCallToActionLayout.Content content={'Adhérez ou connectez-vous pour rejoindre le mouvement.'} />
      <ProfileCallToActionLayout.Actions>
        <View flex={1}>
          <AuthButton.SignInButton />
        </View>
        <View flex={1} flexDirection={'row'} justifyContent={'flex-end'}>
          <AuthButton.SignUpButton />
        </View>
      </ProfileCallToActionLayout.Actions>
    </ProfileCallToActionLayout>
  )
}
