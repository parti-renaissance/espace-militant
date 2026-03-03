import { useCallback } from 'react'
import { Linking } from 'react-native'
import { ProfileCallToActionLayout } from '@/components/ProfileCards/ProfileCallToActionLayout/ProfileCallToActionLayout'
import clientEnv from '@/config/clientEnv'
import { gray } from '../../../../theme/colors.hex'
import { VoxButton } from '../../Button'

import programImg from './assets/program.png'

export default function ProgramCTA() {
  const onPress = useCallback(async () => {
    const link = `https://${clientEnv.CAMPAIGN_DOMAIN}/projet?utm_source=app`
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link)
    }
  }, [])

  return (
    <ProfileCallToActionLayout noPadding>
      <ProfileCallToActionLayout.Content
        title="NOTRE PROGRAMME"
        titleStyle={{
          fontWeight: 600,
          color: gray.gray6,
        }}
        content={'Nos 48 propositions en\ndétail sur notre site.'}
        contentStyle={{
          lineHeight: 24,
        }}
        padding={'$medium'}
        compact
      />
      <ProfileCallToActionLayout.Actions>
        <VoxButton variant={'outlined'} marginTop={'$small'} marginLeft={'$small'} zIndex={10} onPress={onPress}>
          Voir Notre Projet
        </VoxButton>
      </ProfileCallToActionLayout.Actions>
      <ProfileCallToActionLayout.BackgroundImageBottomRight source={programImg} bottom={-20} right={-16} height={170} />
    </ProfileCallToActionLayout>
  )
}
