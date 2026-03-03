import { useCallback } from 'react'
import { Linking } from 'react-native'
import Button from '@/components/Button'
import { ProfileCallToActionLayout } from '@/components/ProfileCards/ProfileCallToActionLayout/ProfileCallToActionLayout'
import clientEnv from '@/config/clientEnv'
import { gray } from '../../../../theme/colors.hex'

import boxImg from './box.png'

export default function ProcurationCTA() {
  // desactivate procuration block
  return null
  const onPress = useCallback(async () => {
    const link = `https://${clientEnv.CAMPAIGN_DOMAIN}/procurations?utm_source=app`
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link)
    }
  }, [])

  return (
    <ProfileCallToActionLayout backgroundColor={'#DEECF1'} noPadding>
      <ProfileCallToActionLayout.Content
        title="PROCURATION"
        titleStyle={{
          fontWeight: 600,
          color: gray.gray6,
        }}
        content={'Aucune voix ne doit manquer !'}
        padding={'$medium'}
        compact
      />
      <ProfileCallToActionLayout.Actions>
        <Button variant={'outlined'} marginTop={'$small'} marginLeft={'$small'} zIndex={10} onPress={onPress}>
          <Button.Text>Accéder aux démarches</Button.Text>
        </Button>
      </ProfileCallToActionLayout.Actions>
      <ProfileCallToActionLayout.BackgroundImageBottomRight source={boxImg} />
    </ProfileCallToActionLayout>
  )
}
